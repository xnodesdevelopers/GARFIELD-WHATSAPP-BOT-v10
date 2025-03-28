#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os

def extract_and_download(url, media_type, quality, store_dir, cookies_file=None):
    """Extract video info and download media with cookies support."""
    ydl_opts = {
        'outtmpl': os.path.join(store_dir, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'noplaylist': True,
        'nocheckcertificate': True,
        'socket_timeout': 30,
        'retries': 3,
    }

    # Add cookies if file exists
    if cookies_file and os.path.exists(cookies_file):
        ydl_opts['cookiefile'] = cookies_file

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

            return {
                'success': True,
                'filename': os.path.abspath(filename),
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', ''),
                'uploader': info.get('uploader', 'Unknown')
            }
    except Exception as e:
        return {
            'success': False,
            'error': f"Error: {str(e)}",
            'type': 'download_error'
        }

if __name__ == "__main__":
    if len(sys.argv) < 5 or len(sys.argv) > 6:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python ytdl.py <url> <media_type> <quality> <store_dir> [cookies_file]'
        }))
        sys.exit(1)

    url = sys.argv[1]
    media_type = sys.argv[2]
    quality = sys.argv[3]
    store_dir = sys.argv[4]
    cookies_file = sys.argv[5] if len(sys.argv) == 6 else None

    result = extract_and_download(url, media_type, quality, store_dir, cookies_file)
    print(json.dumps(result))
