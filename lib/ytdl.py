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
    """Download video with robust file handling."""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'socket_timeout': 5,
        'retries': 1,
        'progress': False,
        'format': 'best[height<=360][ext=mp4][vcodec^=avc1]/best[height<=360][ext=mp4]',
        'merge_output_format': 'mp4',
        'noplaylist': True,
        'nooverwrites': True,
    }

    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE

    stdout_buffer = StringIO()
    stderr_buffer = StringIO()
    try:
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Extract minimal info
                info = ydl.extract_info(url, download=False, process=False)
                if not info or 'id' not in info:
                    raise ValueError("Failed to extract basic info")

                # Download the video
                ydl.download([url])
                
                # Get the expected filename
                expected_filename = ydl.prepare_filename(info)
                base, ext = os.path.splitext(expected_filename)
                final_filename = f"{base}.mp4"

                # Check if the downloaded file exists
                if not os.path.exists(expected_filename):
                    raise FileNotFoundError(f"Downloaded file not found: {expected_filename}")

                # Rename to .mp4 if needed
                if expected_filename != final_filename:
                    if os.path.exists(final_filename):
                        os.remove(final_filename)  # Remove old file if it exists
                    os.rename(expected_filename, final_filename)

                return {
                    'success': True,
                    'filename': os.path.abspath(final_filename),
                    'title': info.get('title', 'Unknown'),
                    'duration': info.get('duration', 0)
                }
    except Exception as e:
        return {
            'success': False,
            'error': f"Download failed: Error: {str(e)}"
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
