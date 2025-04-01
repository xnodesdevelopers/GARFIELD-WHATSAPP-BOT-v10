#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os
from contextlib import redirect_stdout, redirect_stderr
from io import StringIO

# Define paths
COOKIES_FILE = os.path.join(os.path.dirname(__file__), 'cookies.txt')
STORE_DIR = os.path.join(os.path.dirname(__file__), 'store')

def extract_and_download(url, media_type):
    """Ultra fast audio download without re-encoding"""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'retries': 2,
        'progress': False,
        'extract_flat': False,
        # Speed optimizations
        'socket_timeout': 30,
        'nopart': True,
        'http_chunk_size': 10485760,
    }

    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE

    if media_type == 'audio':
        # Directly download m4a without re-encoding
        ydl_opts['format'] = 'bestaudio[ext=m4a]'  # or 'bestaudio[ext=mp3]'
        
        # KEY CHANGE: Skip FFmpeg entirely
        ydl_opts['postprocessors'] = []
        
        # Additional speed optimizations
        ydl_opts['extractor_args'] = {
            'youtube': {
                'skip': ['dash', 'hls', 'translated_subs'],
                'player_skip': ['configs', 'webpage']
            }
        }
    else:  # video
        ydl_opts['format'] = 'bestvideo[height<=360]+bestaudio/best[height<=360]'
        ydl_opts['merge_output_format'] = 'mp4'

    stdout_buffer = StringIO()
    stderr_buffer = StringIO()
    try:
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                ydl.params['check_formats'] = False
                info = ydl.extract_info(url, download=True)
                
                filename = ydl.prepare_filename(info)
                return {
                    'success': True,
                    'filename': os.path.abspath(filename),
                    'title': info.get('title', 'Unknown'),
                    'duration': info.get('duration', 0)
                }
    except Exception as e:
        return {
            'success': False,
            'error': f"Error: {str(e)}"
        }
    finally:
        stdout_buffer.close()
        stderr_buffer.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        result = {'success': False, 'error': 'Usage: python ytdl.py <url> <media_type>'}
    else:
        url = sys.argv[1]
        media_type = sys.argv[2]
        if not os.path.exists(STORE_DIR):
            os.makedirs(STORE_DIR, exist_ok=True)
        result = extract_and_download(url, media_type)
    
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
