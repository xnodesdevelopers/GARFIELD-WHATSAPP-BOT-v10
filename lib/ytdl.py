#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os

def download_media(url, media_type, store_dir, cookies_file=None):
    try:
        # Create store directory if not exists
        os.makedirs(store_dir, exist_ok=True)
        
        # Common options
        ydl_opts = {
            'outtmpl': os.path.join(store_dir, '%(title)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'restrictfilenames': True,
            'noplaylist': True,
            'nocheckcertificate': True,
            'socket_timeout': 30,
            'retries': 3
        }

        # Add cookies if provided and exists
        if cookies_file and os.path.exists(cookies_file):
            ydl_opts['cookiefile'] = cookies_file

        # Audio configuration
        if media_type == 'audio':
            ydl_opts.update({
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'm4a',
                    'preferredquality': '192',
                }],
                'extractaudio': True,
            })
        # Video configuration (360p)
        elif media_type == 'video':
            ydl_opts.update({
                'format': 'bestvideo[height<=360]+bestaudio/best[height<=360]',
                'postprocessors': [{
                    'key': 'FFmpegVideoConvertor',
                    'preferedformat': 'mp4',
                }],
            })

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Handle file extensions
            if media_type == 'audio':
                base, ext = os.path.splitext(filename)
                new_filename = f"{base}.m4a"
                if ext.lower() in ['.webm', '.mp4']:
                    os.rename(filename, new_filename)
                    filename = new_filename
            elif media_type == 'video' and not filename.lower().endswith('.mp4'):
                new_filename = f"{filename}.mp4"
                os.rename(filename, new_filename)
                filename = new_filename
            
            return {
                'success': True,
                'filename': os.path.abspath(filename),
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
                'thumbnail': info.get('thumbnail', ''),
                'type': media_type
            }

    except yt_dlp.DownloadError as e:
        return {
            'success': False,
            'error': f"Download failed: {str(e)}",
            'type': 'download_error'
        }
    except Exception as e:
        return {
            'success': False,
            'error': f"Unexpected error: {str(e)}",
            'type': 'general_error'
        }

if __name__ == "__main__":
    if len(sys.argv) < 4 or len(sys.argv) > 5:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python ytdl.py <url> <audio|video> <store_dir> [cookies_file]'
        }))
        sys.exit(1)

    url = sys.argv[1]
    media_type = sys.argv[2]
    store_dir = sys.argv[3]
    cookies_file = sys.argv[4] if len(sys.argv) == 5 else None

    if media_type not in ['audio', 'video']:
        print(json.dumps({
            'success': False,
            'error': 'Invalid media type. Use "audio" or "video"'
        }))
        sys.exit(1)

    result = download_media(url, media_type, store_dir, cookies_file)
    print(json.dumps(result, indent=2))
