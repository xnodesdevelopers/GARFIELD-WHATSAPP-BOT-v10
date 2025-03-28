#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os
import subprocess
from contextlib import redirect_stdout, redirect_stderr
from io import StringIO

# Define paths
COOKIES_FILE = os.path.join(os.path.dirname(__file__), 'cookies.txt')
STORE_DIR = os.path.join(os.path.dirname(__file__), 'store')

def extract_and_download(url, media_type):
    """Ultra fast audio download without timeout limits"""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'retries': 2,
        'progress': False,
        'extract_flat': False,
    }

    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE

    if media_type == 'audio':
        # Fastest possible audio download settings
        ydl_opts['format'] = 'bestaudio/best'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'm4a',
        }]
        
        # Remove all timeout limits for maximum speed
        ydl_opts['socket_timeout'] = None
        ydl_opts['extractor_args'] = {'youtube': {'skip': ['dash', 'hls']}}
    else:  # video
        # Video settings remain unchanged
        ydl_opts['format'] = 'bestvideo[height<=360][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]'
        ydl_opts['merge_output_format'] = 'mp4'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegVideoRemuxer',
            'preferedformat': 'mp4'
        }]

    stdout_buffer = StringIO()
    stderr_buffer = StringIO()
    try:
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Bypass some slow checks
                ydl.params['check_formats'] = False
                
                info = ydl.extract_info(url, download=True)
                if not info or 'title' not in info:
                    raise ValueError("Failed to extract metadata")

                if media_type == 'audio':
                    filename = ydl.prepare_filename(info)
                    base, ext = os.path.splitext(filename)
                    filename = f"{base}.m4a"
                else:
                    filename = ydl.prepare_filename(info)
                    if not filename.endswith('.mp4'):
                        base, _ = os.path.splitext(filename)
                        filename = f"{base}.mp4"

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
