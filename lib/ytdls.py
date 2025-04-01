#!/usr/bin/env python3
J='error'
F='success'
C=False
B=True
import yt_dlp as P,json,sys as D,os as A
from contextlib import redirect_stdout as Q,redirect_stderr as R
from io import StringIO as H
I=A.path.join(A.path.dirname(__file__),'cookies.txt')
E=A.path.join(A.path.dirname(__file__),'store')
def K(url):
	O='duration';N='title';K={'outtmpl':A.path.join(E,'%(id)s.%(ext)s'),'quiet':B,'no_warnings':B,'nocheckcertificate':B,'retries':2,'progress':C,'extract_flat':C,'socket_timeout':30,'nopart':B,'http_chunk_size':10485760,'format':'bestaudio[ext=m4a]','postprocessors':[],'extractor_args':{'youtube':{'skip':['dash','hls','translated_subs'],'player_skip':['configs','webpage']}}}
	if A.path.exists(I):K['cookiefile']=I
	L=H();M=H()
	try:
		with Q(L),R(M):
			with P.YoutubeDL(K)as D:D.params['check_formats']=C;G=D.extract_info(url,download=B);S=D.prepare_filename(G);return{F:B,'filename':A.path.abspath(S),N:G.get(N,'Unknown'),O:G.get(O,0)}
	except Exception as T:return{F:C,J:f"Error: {str(T)}"}
	finally:L.close();M.close()
if __name__=='__main__':
	if len(D.argv)!=2:G={F:C,J:'Usage: python ytdl.py <url>'}
	else:
		L=D.argv[1]
		if not A.path.exists(E):A.makedirs(E,exist_ok=B)
		G=K(L)
	D.stdout.write(json.dumps(G));D.stdout.flush()
