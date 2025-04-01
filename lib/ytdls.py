#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os
from contextlib import redirect_stdout, redirect_stderr
from io import StringIO

# Configuration
STORE_DIR = os.path.join(os.path.dirname(__file__), 'store')

def download_m4a(url):
    """Download audio in m4a format without re-encoding"""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.m4a'),
        'quiet': True,
        'no_warnings': True,
        'format': 'bestaudio[ext=m4a]',  # Only m4a format
        'postprocessors': [],  # No post-processing
        'extractaudio': True,  # Extract audio
        'keepvideo': False,   # No video
        # Performance optimizations
        'nocheckcertificate': True,
        'ignoreerrors': False,
        'logtostderr': False,
        'nooverwrites': True,
        'noplaylist': True,
        'socket_timeout': 30,
        'nopart': True,
        'http_chunk_size': 10485760,
        # YouTube specific optimizations
        'extractor_args': {
            'youtube': {
                'skip': ['dash', 'hls', 'translated_subs'],
                'player_skip': ['configs', 'webpage']
            }
        }
    }

    stdout_buffer = StringIO()
    stderr_buffer = StringIO()
    
    try:
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info).replace('.webm', '.m4a').replace('.mp4', '.m4a')
                
                if not os.path.exists(filename):
                    return {
                        'success': False,
                        'error': 'File not created'
                    }
                
                return {
                    'success': True,
                    'filename': os.path.abspath(filename),
                    'title': info.get('title', 'Unknown'),
                    'duration': info.get('duration', 0)
                }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }
    finally:
        stdout_buffer.close()
        stderr_buffer.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        result = {'success': False, 'error': 'Usage: python ytdls.py <url>'}
    else:
        url = sys.argv[1]
        if not os.path.exists(STORE_DIR):
            os.makedirs(STORE_DIR, exist_ok=True)
        result = download_m4a(url)
    
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
