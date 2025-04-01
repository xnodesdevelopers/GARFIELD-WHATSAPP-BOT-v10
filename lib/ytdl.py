#!/usr/bin/env python3
import json
import sys
import os
from pytube import YouTube
from pytube.exceptions import PytubeError
from pathlib import Path
import subprocess
import http.cookiejar

# Define paths
COOKIES_FILE = os.path.join(os.path.dirname(__file__), 'cookies.txt')
STORE_DIR = os.path.join(os.path.dirname(__file__), 'store')

def load_cookies():
    """Load cookies from file if exists"""
    if os.path.exists(COOKIES_FILE):
        cookie_jar = http.cookiejar.MozillaCookieJar(COOKIES_FILE)
        cookie_jar.load()
        return cookie_jar
    return None

def download_with_ffmpeg(stream, output_path, cookies=None):
    """Download using ffmpeg with optional cookies"""
    cmd = [
        'ffmpeg',
        '-headers', f'Cookie: {cookies}' if cookies else '',
        '-i', stream.url,
        '-c', 'copy',
        '-y',
        output_path
    ]
    subprocess.run(cmd, check=True, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)

def extract_and_download(url, media_type):
    """Download implementation with cookie support"""
    try:
        # Create store directory if not exists
        Path(STORE_DIR).mkdir(parents=True, exist_ok=True)
        
        # Load cookies if available
        cookies = load_cookies()
        cookie_header = None
        if cookies:
            cookie_header = '; '.join([f'{c.name}={c.value}' for c in cookies])
        
        yt = YouTube(
            url,
            use_oauth=False,
            allow_oauth_cache=False,
            # Pytube doesn't directly support cookie files, so we'll pass headers manually
        )
        yt.bypass_age_gate()
        
        if media_type == 'audio':
            stream = yt.streams.filter(only_audio=True, mime_type='audio/mp4').order_by('abr').last()
            if not stream:
                raise PytubeError("No suitable audio stream found")
            
            output_path = os.path.join(STORE_DIR, f"{yt.video_id}.m4a")
            
            if cookie_header:
                # Use FFmpeg with cookies for potentially better compatibility
                download_with_ffmpeg(stream, output_path, cookie_header)
            else:
                stream.download(output_path=STORE_DIR, filename=f"{yt.video_id}.m4a")
            
            return {
                'success': True,
                'filename': os.path.abspath(output_path),
                'title': yt.title,
                'duration': yt.length
            }
            
        else:  # video
            stream = yt.streams.filter(
                progressive=True,
                file_extension='mp4',
                resolution='360p'
            ).first()
            
            if not stream:
                stream = yt.streams.filter(
                    progressive=True,
                    file_extension='mp4'
                ).order_by('resolution').first()
                
            if not stream:
                raise PytubeError("No suitable video stream found")
            
            output_path = os.path.join(STORE_DIR, f"{yt.video_id}.mp4")
            
            if cookie_header:
                download_with_ffmpeg(stream, output_path, cookie_header)
            else:
                stream.download(output_path=STORE_DIR, filename=f"{yt.video_id}.mp4")
            
            return {
                'success': True,
                'filename': os.path.abspath(output_path),
                'title': yt.title,
                'duration': yt.length
            }
            
    except Exception as e:
        return {
            'success': False,
            'error': f"Error: {str(e)}"
        }

if __name__ == "__main__":
    if len(sys.argv) != 3:
        result = {'success': False, 'error': 'Usage: python ytdl.py <url> <media_type>'}
    else:
        url = sys.argv[1]
        media_type = sys.argv[2]
        result = extract_and_download(url, media_type)
    
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
