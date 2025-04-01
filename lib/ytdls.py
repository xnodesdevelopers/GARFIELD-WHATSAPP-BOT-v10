#!/usr/bin/env python3
J=False
I='error'
E='success'
B=True
import yt_dlp as Q,json,sys as C,os as A
from contextlib import redirect_stdout as R,redirect_stderr as S
from io import StringIO as G
H=A.path.join(A.path.dirname(__file__),'cookies.txt')
D=A.path.join(A.path.dirname(__file__),'store')
def K(url):
	P='duration';O='m4a';F='title';K={'outtmpl':A.path.join(D,'%(title)s.%(ext)s'),'quiet':B,'no_warnings':B,'format':'bestaudio/best','postprocessors':[{'key':'FFmpegExtractAudio','preferredcodec':O,'preferredquality':'320'}],'extractaudio':B,'audioformat':O,'nocheckcertificate':B,'retries':3,'socket_timeout':30,'extractor_args':{'youtube':{'player_skip':['js','configs'],'skip':['dash','hls']}},'source_address':'0.0.0.0'}
	if A.path.exists(H):K['cookiefile']=H
	L=G();M=G()
	try:
		with R(L),S(M):
			with Q.YoutubeDL(K)as N:
				C=N.extract_info(url,download=B)
				if not C or F not in C:raise ValueError('Failed to extract metadata')
				T=N.prepare_filename(C);U,X=A.path.splitext(T);V=f"{U}.m4a";return{E:B,'filename':A.path.abspath(V),F:C.get(F,'Unknown'),P:C.get(P,0),'bitrate':320}
	except Exception as W:return{E:J,I:f"Error: {str(W)}"}
	finally:L.close();M.close()
if __name__=='__main__':
	if len(C.argv)!=2:F={E:J,I:'Usage: python ytdl.py <url>'}
	else:
		L=C.argv[1]
		if not A.path.exists(D):A.makedirs(D,exist_ok=B)
		F=K(L)
	C.stdout.write(json.dumps(F));C.stdout.flush()
