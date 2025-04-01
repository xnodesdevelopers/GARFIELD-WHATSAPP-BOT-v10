#!/usr/bin/env python3
K='error'
F='success'
C=False
B=True
import yt_dlp as P,json,sys as D,os as A
from contextlib import redirect_stdout as Q,redirect_stderr as R
from io import StringIO as I
J=A.path.join(A.path.dirname(__file__),'cookies.txt')
E=A.path.join(A.path.dirname(__file__),'store')
def H(url):
	O='duration';N='title';D={'outtmpl':A.path.join(E,'%(id)s.%(ext)s'),'quiet':B,'no_warnings':B,'nocheckcertificate':B,'retries':2,'progress':C,'extract_flat':C,'socket_timeout':30,'nopart':B,'http_chunk_size':10485760,'format':'bestvideo[height<=360]','merge_output_format':'mp4'}
	if A.path.exists(J):D['cookiefile']=J
	D['extractor_args']={'youtube':{'skip':['dash','hls','translated_subs'],'player_skip':['configs','webpage']}};L=I();M=I()
	try:
		with Q(L),R(M):
			with P.YoutubeDL(D)as G:G.params['check_formats']=C;H=G.extract_info(url,download=B);S=G.prepare_filename(H);return{F:B,'filename':A.path.abspath(S),N:H.get(N,'Unknown'),O:H.get(O,0)}
	except Exception as T:return{F:C,K:f"Error: {str(T)}"}
	finally:L.close();M.close()
if __name__=='__main__':
	if len(D.argv)!=2:G={F:C,K:'Usage: python ytdl.py <url>'}
	else:
		L=D.argv[1]
		if not A.path.exists(E):A.makedirs(E,exist_ok=B)
		G=H(L)
	D.stdout.write(json.dumps(G));D.stdout.flush()
