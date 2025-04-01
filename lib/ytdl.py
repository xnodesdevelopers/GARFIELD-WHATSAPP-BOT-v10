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

def download_video(url, fast_verify=True):
    """Download video with optimized settings and optional fast verification."""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'socket_timeout': 10,
        'retries': 2,
        'progress': False,
        # Optimized format for stable MP4 output
        'format': 'bestvideo[height<=360][ext=mp4][vcodec^=avc1]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]',
        'merge_output_format': 'mp4',
        'postprocessors': [{
            'key': 'FFmpegVideoRemuxer',
            'preferedformat': 'mp4'
        }]
    }

    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE

    stdout_buffer = StringIO()
    stderr_buffer = StringIO()
    try:
        with redirect_stdout(stdout_buffer), redirect_stderr(stderr_buffer):
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)
                if not info or 'title' not in info:
                    raise ValueError("Failed to extract metadata")

                ydl.download([url])
                filename = ydl.prepare_filename(info)

                # Ensure MP4 extension
                if not filename.endswith('.mp4'):
                    base, _ = os.path.splitext(filename)
                    new_filename = f"{base}.mp4"
                    os.rename(filename, new_filename)
                    filename = new_filename

                # Optional fast verification
                if fast_verify:
                    try:
                        # Check only first 5 seconds for playability
                        cmd = ['ffmpeg', '-v', 'error', '-t', '5', '-i', filename, '-f', 'null', '-']
                        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
                    except subprocess.CalledProcessError:
                        raise ValueError("Downloaded video appears corrupted")

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
        # Set fast_verify=False if you want to skip verification completely
        result = download_video(url, fast_verify=True)
    
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
