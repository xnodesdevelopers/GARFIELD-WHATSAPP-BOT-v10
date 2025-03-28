#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os

# Define paths
COOKIES_FILE = os.path.join(os.path.dirname(__file__), 'cookies.txt')
STORE_DIR = os.path.join(os.path.dirname(__file__), 'store')

def extract_and_download(url, media_type):
    """Fast audio or video download with minimal overhead."""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.%(ext)s'),
        'quiet': True,
        'nocheckcertificate': True,
        'socket_timeout': 10,
        'retries': 2,
    }

    # Use cookies if available
    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE

    # Configure based on media type
    if media_type == 'video':
        ydl_opts['format'] = 'bestvideo[height<=360]+bestaudio/best[height<=360]/best'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegVideoRemuxer',
            'preferedformat': 'mp4'
        }]
    else:  # audio
        ydl_opts['format'] = 'bestaudio/best'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'm4a',
            'preferredquality': '128'
        }]

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract minimal info
            info = ydl.extract_info(url, download=False)
            if not info or 'title' not in info:
                raise ValueError("Failed to extract metadata")

            # Download and process
            ydl.download([url])
            filename = ydl.prepare_filename(info)
            ext = '.mp4' if media_type == 'video' else '.m4a'
            if not filename.endswith(ext):
                base, _ = os.path.splitext(filename)
                filename = f"{base}{ext}"

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

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print(json.dumps({'success': False, 'error': 'Usage: python ytdl.py <url> <media_type>'}))
        sys.exit(1)

    url = sys.argv[1]
    media_type = sys.argv[2]

    # Ensure store directory exists
    if not os.path.exists(STORE_DIR):
        os.makedirs(STORE_DIR, exist_ok=True)

    result = extract_and_download(url, media_type)
    print(json.dumps(result))
