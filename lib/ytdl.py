#!/usr/bin/env python3
import json
import sys
import os
from pytube import YouTube
from pytube.exceptions import PytubeError
from pathlib import Path
import subprocess

# Define paths
STORE_DIR = os.path.join(os.path.dirname(__file__), 'store')

def download_with_ffmpeg(stream, output_path):
    """Download using ffmpeg for potentially better performance"""
    cmd = [
        'ffmpeg',
        '-i', stream.url,
        '-c', 'copy',  # No re-encoding for fastest speed
        '-y',  # Overwrite without asking
        output_path
    ]
    subprocess.run(cmd, check=True, stderr=subprocess.DEVNULL, stdout=subprocess.DEVNULL)

def extract_and_download(url, media_type):
    """Ultra fast download implementation using pytube"""
    try:
        # Create store directory if not exists
        Path(STORE_DIR).mkdir(parents=True, exist_ok=True)
        
        yt = YouTube(url)
        yt.bypass_age_gate()  # Bypass age restriction checks
        
        if media_type == 'audio':
            # Get the best audio stream
            stream = yt.streams.filter(only_audio=True, mime_type='audio/mp4').order_by('abr').last()
            if not stream:
                raise PytubeError("No suitable audio stream found")
            
            output_path = os.path.join(STORE_DIR, f"{yt.video_id}.m4a")
            stream.download(output_path=STORE_DIR, filename=f"{yt.video_id}.m4a", skip_existing=False)
            
            # Return metadata in the exact format expected by the JavaScript code
            return {
                'success': True,
                'filename': os.path.abspath(output_path),
                'title': yt.title,
                'duration': yt.length
            }
            
        else:  # video
            # Get 360p mp4 stream (matching the JavaScript command description)
            stream = yt.streams.filter(
                progressive=True,
                file_extension='mp4',
                resolution='360p'
            ).first()
            
            if not stream:
                # Fallback to any mp4 stream if no 360p available
                stream = yt.streams.filter(
                    progressive=True,
                    file_extension='mp4'
                ).order_by('resolution').first()
                
            if not stream:
                raise PytubeError("No suitable video stream found")
            
            output_path = os.path.join(STORE_DIR, f"{yt.video_id}.mp4")
            stream.download(output_path=STORE_DIR, filename=f"{yt.video_id}.mp4", skip_existing=False)
        
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
    
    # Ensure the output is in the exact format expected by the JavaScript code
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()
