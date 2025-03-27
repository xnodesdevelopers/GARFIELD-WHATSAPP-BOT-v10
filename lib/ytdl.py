#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os

def download_media(url, media_type, store_dir):
    # Common options
    ydl_opts = {
        'outtmpl': os.path.join(store_dir, f'%(title)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'restrictfilenames': True,
        'noplaylist': True,
        'nocheckcertificate': True
    }

    # Audio specific
    if media_type == 'audio':
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'm4a',
                'preferredquality': '192'
            }],
            'extractaudio': True
        })
    # Video specific (360p)
    elif media_type == 'video':
        ydl_opts.update({
            'format': 'bestvideo[height<=360]+bestaudio/best[height<=360]',
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4'
            }]
        })

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Fix extensions
            if media_type == 'audio':
                filename = filename.replace('.webm', '.m4a').replace('.mp4', '.m4a')
            elif media_type == 'video' and not filename.endswith('.mp4'):
                os.rename(filename, filename + '.mp4')
                filename += '.mp4'
            
            return {
                'success': True,
                'filename': filename,
                'title': info.get('title'),
                'duration': info.get('duration'),
                'thumbnail': info.get('thumbnail'),
                'type': media_type
            }
    except Exception as e:
        return {
            'success': False, 
            'error': str(e),
            'type': f'{media_type}_download_error'
        }

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({
            'success': False, 
            'error': 'Usage: python ytdl.py <url> <audio|video> <store_dir>'
        }))
        sys.exit(1)

    url = sys.argv[1]
    media_type = sys.argv[2]
    store_dir = sys.argv[3]

    if media_type not in ['audio', 'video']:
        print(json.dumps({
            'success': False, 
            'error': 'Invalid media type. Use "audio" or "video"'
        }))
        sys.exit(1)

    result = download_media(url, media_type, store_dir)
    print(json.dumps(result))
