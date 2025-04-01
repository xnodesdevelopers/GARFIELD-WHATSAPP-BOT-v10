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

def download_audio(url):
    """Ultra fast M4A audio download without re-encoding"""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        # Speed optimizations
        'socket_timeout': 10,
        'nopart': True,
        'http_chunk_size': 20971520,
        'concurrent_fragment_downloads': 4,
        # Audio format selection (M4A without re-encoding)
        'format': 'bestaudio[ext=m4a]',
        'extractaudio': True,
        'keepvideo': False,
        # Skip all processing
        'postprocessors': [],
        'nooverwrites': True,
        # YouTube specific optimizations
        'extractor_args': {
            'youtube': {
                'skip': ['dash', 'hls', 'translated_subs', 'thumbnails'],
                'player_skip': ['configs', 'webpage', 'js']
            }
        },
        # Network optimizations
        'ratelimit': 0,
        'buffersize': 65536,
    }

    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE

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
    if len(sys.argv) != 2:
        result = {'success': False, 'error': 'Usage: python ytdl.py <url>'}
    else:
        url = sys.argv[1]
        if not os.path.exists(STORE_DIR):
            os.makedirs(STORE_DIR, exist_ok=True)
        result = download_audio(url)
    
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
