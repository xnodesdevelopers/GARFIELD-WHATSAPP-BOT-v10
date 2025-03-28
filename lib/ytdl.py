#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os
import subprocess
import logging

# Configure logging to suppress debug output in stdout
logging.basicConfig(level=logging.ERROR)  # Only errors to stderr
logger = logging.getLogger('yt_dlp')
logger.setLevel(logging.ERROR)

# Define paths
COOKIES_FILE = os.path.join(os.path.dirname(__file__), 'cookies.txt')
STORE_DIR = os.path.join(os.path.dirname(__file__), 'store')

def export_cookies_from_browser():
    """Export cookies from browser if needed."""
    try:
        logger.info(f"Exporting fresh cookies to {COOKIES_FILE}...")
        result = subprocess.run(
            ['yt-dlp', '--cookies-from-browser', 'chrome', '--output', COOKIES_FILE],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        if os.path.exists(COOKIES_FILE):
            return True
        else:
            logger.error(f"Cookie export failed: {result.stderr.decode()}")
            return False
    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to export cookies: {e.stderr.decode()}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error during cookie export: {str(e)}")
        return False

def extract_and_download(url, media_type, quality, store_dir=STORE_DIR):
    """Extract video info and download media with cookies support."""
    ydl_opts = {
        'outtmpl': os.path.join(store_dir, '%(id)s.%(ext)s'),
        'quiet': True,  # Suppress non-error messages
        'no_warnings': True,  # Suppress warnings
        'noplaylist': True,
        'nocheckcertificate': True,
        'socket_timeout': 30,
        'retries': 3,
        'verbose': False,  # Disable verbose debug output
        'logger': logger,  # Redirect logs to logger instead of stdout
    }

    # Handle cookies
    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE
        logger.info(f"Using cookies from: {COOKIES_FILE}")
    else:
        logger.warning("Cookies file not found, attempting to export...")
        if export_cookies_from_browser():
            ydl_opts['cookiefile'] = COOKIES_FILE
        else:
            logger.warning("No cookies available! Proceeding without cookies.")

    # Configure format based on media type
    if media_type == 'video':
        ydl_opts['format'] = f'bestvideo[height<={quality}]+bestaudio/best[height<={quality}]'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegVideoConvertor',
            'preferredformat': 'mp4'
        }]
    else:  # audio
        ydl_opts['format'] = 'bestaudio/best'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'm4a',
            'preferredquality': '128'
        }]

    result = {}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Extract info first
            info = ydl.extract_info(url, download=False)
            if not info or 'title' not in info:
                raise ValueError("Failed to extract video metadata")

            # Download
            ydl.download([url])
            filename = ydl.prepare_filename(info)

            # Ensure correct extension
            if media_type == 'video' and not filename.endswith('.mp4'):
                base, _ = os.path.splitext(filename)
                filename = f"{base}.mp4"
            elif media_type == 'audio' and not filename.endswith('.m4a'):
                base, _ = os.path.splitext(filename)
                filename = f"{base}.m4a"

            result = {
                'success': True,
                'filename': os.path.abspath(filename),
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', ''),
                'uploader': info.get('uploader', 'Unknown')
            }
    except Exception as e:
        if "Sign in to confirm" in str(e):
            logger.warning("Bot verification detected, refreshing cookies...")
            if export_cookies_from_browser():
                ydl_opts['cookiefile'] = COOKIES_FILE
                try:
                    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                        info = ydl.extract_info(url, download=False)
                        ydl.download([url])
                        filename = ydl.prepare_filename(info)
                        result = {
                            'success': True,
                            'filename': os.path.abspath(filename),
                            'title': info.get('title', 'Unknown'),
                            'duration': info.get('duration', 0),
                            'thumbnail': info.get('thumbnail', ''),
                            'uploader': info.get('uploader', 'Unknown')
                        }
                except Exception as retry_e:
                    result = {
                        'success': False,
                        'error': f"Retry failed: {str(retry_e)}",
                        'type': 'download_error'
                    }
            else:
                result = {
                    'success': False,
                    'error': f"Cookie refresh failed: {str(e)}",
                    'type': 'download_error'
                }
        else:
            result = {
                'success': False,
                'error': f"Error: {str(e)}",
                'type': 'download_error'
            }

    return result

if __name__ == "__main__":
    if len(sys.argv) != 4:
        result = {
            'success': False,
            'error': 'Usage: python ytdl.py <url> <media_type> <quality>'
        }
        print(json.dumps(result))
        sys.exit(1)

    url = sys.argv[1]
    media_type = sys.argv[2]
    quality = sys.argv[3]

    # Ensure store directory exists
    if not os.path.exists(STORE_DIR):
        os.makedirs(STORE_DIR, exist_ok=True)

    result = extract_and_download(url, media_type, quality)
    print(json.dumps(result))
