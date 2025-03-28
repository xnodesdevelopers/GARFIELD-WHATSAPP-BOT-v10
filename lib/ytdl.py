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

def extract_audio_from_video(video_path, output_path):
    """Extract AAC audio from video without re-encoding."""
    cmd = [
        'ffmpeg', '-i', video_path, '-vn', '-acodec', 'copy', '-y', output_path
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

def extract_and_download(url, media_type):
    """Fast audio or video download with strict JSON output."""
    ydl_opts = {
        'outtmpl': os.path.join(STORE_DIR, '%(id)s.%(ext)s'),
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'socket_timeout': 10,
        'retries': 2,
        'progress': False,
    }

    # Use cookies if available
    if os.path.exists(COOKIES_FILE):
        ydl_opts['cookiefile'] = COOKIES_FILE

    # Configure format based on media type
    if media_type == 'audio':
        # Original audio download settings (unchanged)
        ydl_opts['format'] = 'worstvideo[height<=240]+bestaudio[abr<=128]/worst[abr<=128]'
    else:  # video
        # Optimized for most playable 360p MP4 format
        ydl_opts['format'] = 'bestvideo[height<=360][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]'
        ydl_opts['merge_output_format'] = 'mp4'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegVideoRemuxer',
            'preferedformat': 'mp4'
        }]

    # Fully suppress yt-dlp output
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

                if media_type == 'audio':
                    # Original audio extraction process (unchanged)
                    video_path = filename
                    audio_path = f"{os.path.splitext(filename)[0]}.m4a"
                    extract_audio_from_video(video_path, audio_path)
                    os.remove(video_path)  # Clean up video file
                    filename = audio_path
                else:
                    # Enhanced video processing for better compatibility
                    if not filename.endswith('.mp4'):
                        base, _ = os.path.splitext(filename)
                        new_filename = f"{base}.mp4"
                        os.rename(filename, new_filename)
                        filename = new_filename

                    # Verify video is playable
                    try:
                        cmd = ['ffmpeg', '-v', 'error', '-i', filename, '-f', 'null', '-']
                        subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)
                    except subprocess.CalledProcessError:
                        raise ValueError("Downloaded video is corrupted or unplayable")

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
    if len(sys.argv) != 3:
        result = {'success': False, 'error': 'Usage: python ytdl.py <url> <media_type>'}
    else:
        url = sys.argv[1]
        media_type = sys.argv[2]
        if not os.path.exists(STORE_DIR):
            os.makedirs(STORE_DIR, exist_ok=True)
        result = extract_and_download(url, media_type)
    
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
