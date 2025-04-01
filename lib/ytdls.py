#!/usr/bin/env python3
K='error'
H='success'
G='audio'
D=False
C=True
import yt_dlp as X,json,sys as B,os as A
from contextlib import redirect_stdout as Y,redirect_stderr as Z
from io import StringIO as N
O=A.path.join(A.path.dirname(__file__),'cookies.txt')
J=A.path.join(A.path.dirname(__file__),'store')
def I(url,media_type):
	W='duration';V='mp4';U='key';T='postprocessors';S='format';M='title';I=media_type;B={'outtmpl':A.path.join(J,'%(id)s.%(ext)s'),'quiet':C,'no_warnings':C,'nocheckcertificate':C,'retries':3,'progress':D,'extract_flat':D,'check_formats':D}
	if A.path.exists(O):B['cookiefile']=O
	if I==G:B[S]='bestaudio/best';B[T]=[{U:'FFmpegExtractAudio','preferredcodec':'m4a','preferredquality':'320'}];B['extractor_args']={'youtube':{'skip':['dash','hls'],'player_skip':['js','configs']}};B['socket_timeout']=30
	else:B[S]='bestvideo[height<=360][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]';B['merge_output_format']=V;B[T]=[{U:'FFmpegVideoRemuxer','preferedformat':V}]
	P=N();Q=N()
	try:
		with Y(P),Z(Q):
			with X.YoutubeDL(B)as R:
				F=R.extract_info(url,download=C)
				if not F or M not in F:raise ValueError('Failed to extract metadata')
				E=R.prepare_filename(F)
				if I==G:L,b=A.path.splitext(E);E=f"{L}.m4a"
				elif not E.endswith('.mp4'):L,c=A.path.splitext(E);E=f"{L}.mp4"
				return{H:C,'filename':A.path.abspath(E),M:F.get(M,'Unknown'),W:F.get(W,0),'bitrate':320 if I==G else None}
	except Exception as a:return{H:D,K:f"Error: {str(a)}",'type':I}
	finally:P.close();Q.close()
if __name__=='__main__':
	if len(B.argv)!=3:E={H:D,K:'Usage: python ytdl.py <url> <audio|video>'}
	else:
		L=B.argv[1];F=B.argv[2].lower()
		if F not in(G,'video'):E={H:D,K:'Media type must be "audio" or "video"'}
		else:
			if not A.path.exists(J):A.makedirs(J,exist_ok=C)
			E=I(L,F)
	B.stdout.write(json.dumps(E));B.stdout.flush()
