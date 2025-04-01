#!/usr/bin/env python3
L='error'
G='success'
F=False
B=True
import yt_dlp as R,json,sys as C,os as A
from contextlib import redirect_stdout as S,redirect_stderr as T
from io import StringIO as J
K=A.path.join(A.path.dirname(__file__),'cookies.txt')
E=A.path.join(A.path.dirname(__file__),'store')
def H(url):
	Q='duration';I='title';M={'outtmpl':A.path.join(E,'%(id)s.%(ext)s'),'quiet':B,'no_warnings':B,'nocheckcertificate':B,'socket_timeout':10,'retries':2,'progress_hooks':[lambda d:None],'format':'bestvideo[height<=360]+bestaudio/best[height<=360]/best','postprocessors':[{'key':'FFmpegVideoRemuxer','preferedformat':'mp4'}]}
	if A.path.exists(K):M['cookiefile']=K
	N=J();O=J()
	try:
		with S(N),T(O):
			with R.YoutubeDL(M)as H:
				C=H.extract_info(url,download=F)
				if not C or I not in C:raise ValueError('Failed to extract metadata')
				H.download([url]);D=H.prepare_filename(C);P='.mp4'
				if not D.endswith(P):U,W=A.path.splitext(D);D=f"{U}{P}"
				return{G:B,'filename':A.path.abspath(D),I:C.get(I,'Unknown'),Q:C.get(Q,0)}
	except Exception as V:return{G:F,L:f"Error: {str(V)}"}
	finally:N.close();O.close()
if __name__=='__main__':
	if len(C.argv)!=2:D={G:F,L:'Usage: python ytdl.py <url>'}
	else:
		I=C.argv[1]
		if not A.path.exists(E):A.makedirs(E,exist_ok=B)
		D=H(I)
	C.stdout.write(json.dumps(D));C.stdout.flush()
