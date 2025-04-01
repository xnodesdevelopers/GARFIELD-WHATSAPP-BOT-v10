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

def download_video(url):
    """Download video with maximum speed and minimal processing."""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'socket_timeout': 5,  # Reduced timeout for speed
        'retries': 1,        # Fewer retries
        'progress': False,
        # Fastest stable format (no separate audio/video merge if possible)
        'format': 'best[height<=360][ext=mp4][vcodec^=avc1]/best[height<=360][ext=mp4]',
        'merge_output_format': 'mp4',
        # Skip postprocessing if possible
        'noplaylist': True,
        'nooverwrites': True,  # Avoid re-downloading
    }

    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE

    stdout_buffer = StringIO()
    stderr_buffer = StringIO()
    try:
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Minimal metadata extraction
                info = ydl.extract_info(url, download=False, process=False)
                if not info or 'id' not in info:
                    raise ValueError("Failed to extract basic info")

                # Download directly without extra checks
                ydl.download([url])
                filename = ydl.prepare_filename(info)

                # Force MP4 extension if needed
                if not filename.endswith('.mp4'):
                    base, _ = os.path.splitext(filename)
                    filename = f"{base}.mp4"
                    if os.path.exists(filename):
                        os.remove(filename)  # Clean up if exists
                    os.rename(ydl.prepare_filename(info), filename)

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
        result = download_video(url)
    
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
