import yt_dlp
import json
import sys
import os

def download_media(url, media_type, quality, store_dir):
    ydl_opts = {
        'format': (
            f'bestvideo[height<={quality}]+bestaudio/best[height<={quality}]' 
            if media_type == 'video' 
            else f'bestaudio[abr<=128]/best'
        ),
        'outtmpl': os.path.join(store_dir, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        'postprocessors': [{
            'key': 'FFmpegVideoConvertor' if media_type == 'video' else 'FFmpegExtractAudio',
            'preferredformat': 'mp4' if media_type == 'video' else 'mp3'
        }]
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            return {
                'success': True,
                'filename': filename,
                'title': info.get('title'),
                'duration': info.get('duration'),
                'thumbnail': info.get('thumbnail')
            }
    except Exception as e:
        return {
            'success': False, 
            'error': str(e)
        }

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print(json.dumps({
            'success': False, 
            'error': 'Incorrect number of arguments'
        }))
        sys.exit(1)

    url = sys.argv[1]
    media_type = sys.argv[2]
    quality = sys.argv[3]
    store_dir = sys.argv[4]

    if media_type not in ['video', 'audio']:
        print(json.dumps({
            'success': False, 
            'error': 'Invalid media type. Must be "video" or "audio"'
        }))
        sys.exit(1)

    result = download_media(url, media_type, quality, store_dir)
    print(json.dumps(result))
