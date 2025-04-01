#!/usr/bin/env python3
L='error'
F='success'
C=False
B=True
import yt_dlp as Q,json,sys as D,os as A
from contextlib import redirect_stdout as R,redirect_stderr as S
from io import StringIO as J
K=A.path.join(A.path.dirname(__file__),'cookies.txt')
E=A.path.join(A.path.dirname(__file__),'store')
def H(url):
	P='duration';I='title';M={'outtmpl':A.path.join(E,'%(id)s.%(ext)s'),'quiet':B,'no_warnings':B,'nocheckcertificate':B,'retries':2,'progress':C,'extract_flat':C,'format':'bestaudio/best','postprocessors':[{'key':'FFmpegExtractAudio','preferredcodec':'m4a','preferredquality':'320'}],'socket_timeout':None,'extractor_args':{'youtube':{'skip':['dash','hls']}}}
	if A.path.exists(K):M['cookiefile']=K
	N=J();O=J()
	try:
		with R(N),S(O):
			with Q.YoutubeDL(M)as G:
				G.params['check_formats']=C;D=G.extract_info(url,download=B)
				if not D or I not in D:raise ValueError('Failed to extract metadata')
				H=G.prepare_filename(D);T,V=A.path.splitext(H);H=f"{T}.m4a";return{F:B,'filename':A.path.abspath(H),I:D.get(I,'Unknown'),P:D.get(P,0)}
	except Exception as U:return{F:C,L:f"Error: {str(U)}"}
	finally:N.close();O.close()
if __name__=='__main__':
	if len(D.argv)!=2:G={F:C,L:'Usage: python ytdls.py <url>'}
	else:
		I=D.argv[1]
		if not A.path.exists(E):A.makedirs(E,exist_ok=B)
		G=H(I)
	D.stdout.write(json.dumps(G));D.stdout.flush()
