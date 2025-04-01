#!/usr/bin/env python3
L='error'
G='success'
F=False
B=True
import yt_dlp as Q,json,sys as C,os as A
from contextlib import redirect_stdout as R,redirect_stderr as S
from io import StringIO as J
K=A.path.join(A.path.dirname(__file__),'cookies.txt')
E=A.path.join(A.path.dirname(__file__),'store')
def H(url):
	P='duration';I='title';M={'outtmpl':A.path.join(E,'%(id)s.%(ext)s'),'quiet':B,'no_warnings':B,'nocheckcertificate':B,'socket_timeout':10,'retries':2,'progress_hooks':[lambda d:None],'format':'bestvideo[height<=360]+bestaudio/best[height<=360]/best','postprocessors':[{'key':'FFmpegVideoRemuxer','preferedformat':'mp4'}]}
	if A.path.exists(K):M['cookiefile']=K
	N=J();O=J()
	try:
		with R(N),S(O):
			with Q.YoutubeDL(M)as H:
				C=H.extract_info(url,download=F)
				if not C or I not in C:raise ValueError('Failed to extract metadata')
				H.download([url]);D=H.prepare_filename(C)
				if not D.endswith('.mp4'):T,V=A.path.splitext(D);D=f"{T}.mp4"
				return{G:B,'filename':A.path.abspath(D),I:C.get(I,'Unknown'),P:C.get(P,0)}
	except Exception as U:return{G:F,L:f"Error: {str(U)}"}
	finally:N.close();O.close()
if __name__=='__main__':
	if len(C.argv)!=2:D={G:F,L:'Usage: python ytdl.py <url>'}
	else:
		I=C.argv[1]
		if not A.path.exists(E):A.makedirs(E,exist_ok=B)
		D=H(I)
	C.stdout.write(json.dumps(D));C.stdout.flush()
