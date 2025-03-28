#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os
from io import StringIO

def get_full_cookies():
    """සම්පූර්ණ YouTube cookies embed කිරීම"""
    return """# Netscape HTTP Cookie File
.youtube.com	TRUE	/	TRUE	1744761600	YSC	t_HmzTh5omc
.youtube.com	TRUE	/	TRUE	1744761600	VISITOR_INFO1_LIVE	rQ81apo74qM
.youtube.com	TRUE	/	TRUE	1744761600	VISITOR_PRIVACY_METADATA	CgJHQhIEGgAgMA%3D%3D
.youtube.com	TRUE	/	TRUE	1744761600	PREF	tz=Asia.Colombo
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-1PSIDTS	sidts-CjEB7pHptVaKWzLVZCetgaSUXafx_r8wC4n1lC_h28ZsOUifjLH-P6_mP5mzCA-nzOwOEAA
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-3PSIDTS	sidts-CjEB7pHptVaKWzLVZCetgaSUXafx_r8wC4n1lC_h28ZsOUifjLH-P6_mP5mzCA-nzOwOEAA
.youtube.com	TRUE	/	TRUE	1744761600	HSID	AZoFEL00JYN1EjeVz
.youtube.com	TRUE	/	TRUE	1744761600	SSID	AIVBWQT0lhzYoed6H
.youtube.com	TRUE	/	TRUE	1744761600	APISID	msFZvYs46PCbe0XM/AXQnQe2WwVsYIdyOB
.youtube.com	TRUE	/	TRUE	1744761600	SAPISID	0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-1PAPISID	0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-3PAPISID	0itb1zpbupB4m5rJ/A-6UAR3iB-4z1f-Bj
.youtube.com	TRUE	/	TRUE	1744761600	SID	g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vhT0aibC6e-KAn2azhZKBdwAACgYKAT8SARASFQHGX2MirXYmvMJ34yDNTX8BEX6QJBoVAUF8yKov3c7wb1XegdJRXhLVkl0c0076
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-1PSID	g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vh6PPomyhFWultXkoWQ1OznwACgYKAWkSARASFQHGX2MiM057HufCvNlCcbz7Y2PVeRoVAUF8yKpqaovc1I792nnpWfTE5KpQ0076
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-3PSID	g.a000vAhqA2YSw1xCma51VDEsCV9wSSRdt3ZBpltHvj9_wsn243vhqunIOQAT6uUunqYLHsyrbAACgYKAfgSARASFQHGX2MiNYwW06M73dI9M3pX8hUwfxoVAUF8yKreaeDdJ2fc5Va_fo4Y-Fj10076
.youtube.com	TRUE	/	TRUE	1744761600	LOGIN_INFO	AFmmF2swRgIhALi65i_2kwRwS0OF2bwTm3LgwhZDvK33oKmE6MRKpuBbAiEAwHIvg6Enp--kBFpdFI7JVR6iz_7CneQEur2uO0BJkOI:QUQ3MjNmd3JJeEZlZFhybm5NbU1sT1d4ZS1lTGw4ZWo4cmRYOFJhTUNjRWRNdXZHMHNqOUdFZ29nQk0xWkM0VHNkTXg5U1pjZTBLbV9yTklkS0JqQXRlOXU5cEN0a3N5SWgtSFZXX0Z1NzZxMzZOcnN0ckxRMHdBM0ZBVU9SWDQ4bllfcFY0cXJoZlBmcUF6dnA0WllUNnNuenNESGRMZXlB
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-ROLLOUT_TOKEN	CJy5rYyd-e6DCBCBk-i18p2MAxiKyp2_7qqMAw%3D%3D
.youtube.com	TRUE	/	TRUE	1744761600	SIDCC	AKEyXzUX0RIe-Fu3thVmWKCp6rn_CkCSqepZXvrISLqqRZ_54OWgYcSZ5qB8wUjUKebUALOong
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-1PSIDCC	AKEyXzUK_8Own-mVc3-T_K_dgZ-vwWKJKkRhpV6c8dCCenI87Jm0eXGrcim5xqW-NphcE84nvQ
.youtube.com	TRUE	/	TRUE	1744761600	__Secure-3PSIDCC	AKEyXzXm1vFnneXyz6pO-20MgPtcO1SRd4zHFc9vNAvyhIeue84a-4CqdfpbjJUHGrWi_Vo5ug
"""

def download_media(url, media_type, store_dir, use_cookies=True):
    # Create directory if not exists
    os.makedirs(store_dir, exist_ok=True)
    
    # Configure yt-dlp options
    ydl_opts = {
        'outtmpl': os.path.join(store_dir, '%(title)s.%(ext)s'),
        'quiet': False,
        'no_warnings': False,
        'restrictfilenames': True,
        'noplaylist': True,
        'nocheckcertificate': True,
        'socket_timeout': 30,
        'retries': 3,
        'extract_flat': False,
    }

    # Add full cookies if enabled
    if use_cookies:
        try:
            cookies_file = StringIO(get_full_cookies())
            ydl_opts['cookiefile'] = cookies_file
            ydl_opts['cookiesfrombrowser'] = ('none',)
        except Exception as e:
            print(f"Cookie loading error: {str(e)}", file=sys.stderr)

    # Media type configuration
    if media_type == 'audio':
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'm4a',
                'preferredquality': '128',
            }],
            'extractaudio': True,
        })
    elif media_type == 'video':
        ydl_opts.update({
            'format': 'bestvideo[height<=360]+bestaudio/best[height<=360]',
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4',
            }],
        })

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Download with full cookie support
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
            
            # Get best thumbnail
            thumbnail = info.get('thumbnail', '')
            if 'thumbnails' in info and info['thumbnails']:
                thumbnail = info['thumbnails'][-1]['url']

            return {
                'success': True,
                'filename': os.path.abspath(filename),
                'title': info.get('title', 'Unknown'),
                'duration': info.get('duration', 0),
                'thumbnail': thumbnail,
                'type': media_type,
                'resolution': info.get('resolution', '360p') if media_type == 'video' else None,
            }

    except yt_dlp.DownloadError as e:
        return {
            'success': False,
            'error': f"Download error: {str(e)}",
            'type': 'download_error',
            'url': url,
        }
    except Exception as e:
        return {
            'success': False,
            'error': f"Unexpected error: {str(e)}",
            'type': 'general_error',
            'url': url,
        }

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print(json.dumps({
            'success': False,
            'error': 'Usage: python ytdl.py <url> <audio|video> <store_dir> [--no-cookies]',
            'example_audio': 'python ytdl.py "https://youtu.be/example" audio ./downloads',
            'example_video': 'python ytdl.py "https://youtu.be/example" video ./downloads --no-cookies',
        }, indent=2))
        sys.exit(1)

    url = sys.argv[1]
    media_type = sys.argv[2].lower()
    store_dir = sys.argv[3]
    use_cookies = '--no-cookies' not in sys.argv

    if media_type not in ['audio', 'video']:
        print(json.dumps({
            'success': False,
            'error': 'Invalid media type. Use "audio" or "video"',
            'received': media_type,
        }, indent=2))
        sys.exit(1)

    result = download_media(url, media_type, store_dir, use_cookies)
    print(json.dumps(result, indent=2))
