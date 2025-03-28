#!/usr/bin/env python3
N='error'
I='success'
F=False
D=True
import yt_dlp as X,json,sys as B,os as A,subprocess
from contextlib import redirect_stdout as Y,redirect_stderr as Z
from io import StringIO as L
M=A.path.join(A.path.dirname(__file__),'cookies.txt')
H=A.path.join(A.path.dirname(__file__),'store')
def E(url,media_type):
	W='duration';V='mp4';U='key';T='postprocessors';S='format';R='audio';O=media_type;K='title';B={'outtmpl':A.path.join(H,'%(id)s.%(ext)s'),'quiet':D,'no_warnings':D,'nocheckcertificate':D,'retries':2,'progress':F,'extract_flat':F}
	if A.path.exists(M):B['cookiefile']=M
	if O==R:B[S]='bestaudio/best';B[T]=[{U:'FFmpegExtractAudio','preferredcodec':'m4a'}];B['socket_timeout']=None;B['extractor_args']={'youtube':{'skip':['dash','hls']}}
	else:B[S]='bestvideo[height<=360][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]';B['merge_output_format']=V;B[T]=[{U:'FFmpegVideoRemuxer','preferedformat':V}]
	P=L();Q=L()
	try:
		with Y(P),Z(Q):
			with X.YoutubeDL(B)as G:
				G.params['check_formats']=F;E=G.extract_info(url,download=D)
				if not E or K not in E:raise ValueError('Failed to extract metadata')
				if O==R:C=G.prepare_filename(E);J,b=A.path.splitext(C);C=f"{J}.m4a"
				else:
					C=G.prepare_filename(E)
					if not C.endswith('.mp4'):J,c=A.path.splitext(C);C=f"{J}.mp4"
				return{I:D,'filename':A.path.abspath(C),K:E.get(K,'Unknown'),W:E.get(W,0)}
	except Exception as a:return{I:F,N:f"Error: {str(a)}"}
	finally:P.close();Q.close()
if __name__=='__main__':
	if len(B.argv)!=3:C={I:F,N:'Usage: python ytdl.py <url> <media_type>'}
	else:
		G=B.argv[1];J=B.argv[2]
		if not A.path.exists(H):A.makedirs(H,exist_ok=D)
		C=E(G,J)
	B.stdout.write(json.dumps(C));B.stdout.flush()
