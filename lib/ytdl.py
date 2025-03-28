
#!/usr/bin/env python3
import yt_dlp
import json
import sys
import os
import re


def sanitize_filename(filename):
    """Sanitize filename to remove invalid characters."""
    # Remove or replace invalid filename characters
    sanitized = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # Limit filename length
    return sanitized[:64]


def extract_video_info(url):
    """
    Extract video information safely using yt-dlp.
    
    Args:
        url (str): YouTube video URL
    
    Returns:
        dict: Extracted video information or error details
    """
    try:
        with yt_dlp.YoutubeDL({'quiet': True}) as ydl:
            info_dict = ydl.extract_info(url, download=False)
            
            # Basic validation
            if not info_dict or 'title' not in info_dict:
                return {
                    'success': False,
                    'error': 'Unable to extract video information',
                    'type': 'info_extraction_error'
                }
            
            return {
                'success': True,
                'title': info_dict.get('title', 'Unknown'),
                'duration': info_dict.get('duration', 0),
                'thumbnail': info_dict.get('thumbnail', ''),
                'view_count': info_dict.get('view_count', 0),
                'uploader': info_dict.get('uploader', 'Unknown'),
                'url': url
            }
    except Exception as e:
        return {
            'success': False,
            'error': f"Video info extraction failed: {str(e)}",
            'type': 'info_extraction_error'
        }


def download_media(url, media_type, store_dir, cookies_file=None):
    try:
        # Validate input
        if media_type not in ['audio', 'video']:
            return {
                'success': False,
                'error': 'Invalid media type. Use "audio" or "video"',
                'type': 'input_error'
            }
        
        # Create store directory if not exists
        os.makedirs(store_dir, exist_ok=True)
        
        # Common options
        ydl_opts = {
            'outtmpl': os.path.join(store_dir, '%(title)s.%(ext)s'),
            'quiet': False,
            'no_warnings': False,
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
            try:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
                
                # Handle file extensions
                if media_type == 'audio':
            return {
                'success': True,
                'title': info_dict.get('title', 'Unknown'),
                'duration': info_dict.get('duration', 0),
                'thumbnail': info_dict.get('thumbnail', ''),
                'view_count': info_dict.get('view_count', 0),
                'uploader': info_dict.get('uploader', 'Unknown'),
                'url': url
            }
    except Exception as e:
        return {
            'success': False,
            'error': f"Video info extraction failed: {str(e)}",
            'type': 'info_extraction_error'
        }


def download_media(url, media_type, store_dir, cookies_file=None):
    try:
        # Validate input
        if media_type not in ['audio', 'video']:
            return {
                'success': False,
                'error': 'Invalid media type. Use "audio" or "video"',
                'type': 'input_error'
            }
        
        # Create store directory if not exists
        os.makedirs(store_dir, exist_ok=True)
        
        # Common options
        ydl_opts = {
            'outtmpl': os.path.join(store_dir, '%(title)s.%(ext)s'),
            'quiet': False,
            'no_warnings': False,
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
            try:
                info = ydl.extract_info(url, download=True)
                filename = ydl.prepare_filename(info)
                
                # Handle file extensions
                if media_type == 'audio':
