import yt_dlp
import json
import sys

def download_media(url, media_type, quality):
    ydl_opts = {
        'format': f'bestvideo[height<={quality}]+bestaudio/best[height<={quality}]' if media_type == 'video' else f'bestaudio[abr<=128]/best',
        'outtmpl': '%(id)s.%(ext)s',
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        'postprocessors': [{
            'key': 'FFmpegVideoConvertor' if media_type == 'video' else 'FFmpegExtractAudio',
            'preferedformat': 'mp4' if media_type == 'video' else 'mp3'
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
        return {'success': False, 'error': str(e)}

if __name__ == "__main__":
    try:
        args = json.loads(sys.argv[1])
        result = download_media(args['url'], args['media_type'], args['quality'])
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({'success': False, 'error': str(e)}))
