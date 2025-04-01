#!/usr/bin/env python3
L='error'
G='success'
E=False
B=True
import yt_dlp as S,json,sys as C,os as A
from contextlib import redirect_stdout as T,redirect_stderr as U
from io import StringIO as J
K=A.path.join(A.path.dirname(__file__),'cookies.txt')
F=A.path.join(A.path.dirname(__file__),'store')
def H(url):
	R='duration';Q='mp4';I='title';M={'outtmpl':A.path.join(F,'%(id)s.%(ext)s'),'quiet':B,'no_warnings':B,'nocheckcertificate':B,'socket_timeout':10,'retries':3,'progress':E,'format':'bestvideo[height<=360][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]','merge_output_format':Q,'postprocessors':[{'key':'FFmpegVideoRemuxer','preferedformat':Q}],'http_headers':{'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}}
	if A.path.exists(K):M['cookiefile']=K
	N=J();O=J()
	try:
		with T(N),U(O):
			with S.YoutubeDL(M)as H:
				C=H.extract_info(url,download=E)
				if not C or I not in C:raise ValueError('Failed to extract metadata')
				H.download([url]);D=H.prepare_filename(C)
				if not D.endswith('.mp4'):V,X=A.path.splitext(D);P=f"{V}.mp4";A.rename(D,P);D=P
				return{G:B,'filename':A.path.abspath(D),I:C.get(I,'Unknown'),R:C.get(R,0)}
	except Exception as W:return{G:E,L:f"Error: {str(W)}"}
	finally:N.close();O.close()
if __name__=='__main__':
	if len(C.argv)!=2:D={G:E,L:'Usage: python ytdl.py <url>'}
	else:
		I=C.argv[1]
		if not A.path.exists(F):A.makedirs(F,exist_ok=B)
		D=H(I)
	C.stdout.write(json.dumps(D));C.stdout.flush()
