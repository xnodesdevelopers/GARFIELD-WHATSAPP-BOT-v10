#!/usr/bin/env python3
N=ValueError
I='success'
H='error'
F=False
B=True
import yt_dlp as U,json,sys as C,os as A,subprocess as E
from contextlib import redirect_stdout as V,redirect_stderr as W
from io import StringIO as L
M=A.path.join(A.path.dirname(__file__),'cookies.txt')
G=A.path.join(A.path.dirname(__file__),'store')
def J(url):
	T='duration';S='mp4';K='title';O={'outtmpl':A.path.join(G,'%(id)s.%(ext)s'),'quiet':B,'no_warnings':B,'nocheckcertificate':B,'socket_timeout':10,'retries':2,'progress':F,'format':'bestvideo[height<=360][ext=mp4][vcodec^=avc]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]','merge_output_format':S,'postprocessors':[{'key':'FFmpegVideoRemuxer','preferedformat':S}]}
	if A.path.exists(M):O['cookiefile']=M
	P=L();Q=L()
	try:
		with V(P),W(Q):
			with U.YoutubeDL(O)as J:
				D=J.extract_info(url,download=F)
				if not D or K not in D:raise N('Failed to extract metadata')
				J.download([url]);C=J.prepare_filename(D)
				if not C.endswith('.mp4'):X,a=A.path.splitext(C);R=f"{X}.mp4";A.rename(C,R);C=R
				try:Y=['ffmpeg','-v',H,'-i',C,'-f','null','-'];E.run(Y,stdout=E.PIPE,stderr=E.PIPE,check=B)
				except E.CalledProcessError:raise N('Downloaded video is corrupted or unplayable')
				return{I:B,'filename':A.path.abspath(C),K:D.get(K,'Unknown'),T:D.get(T,0)}
	except Exception as Z:return{I:F,H:f"Error: {str(Z)}"}
	finally:P.close();Q.close()
if __name__=='__main__':
	if len(C.argv)!=2:D={I:F,H:'Usage: python ytdl.py <url>'}
	else:
		K=C.argv[1]
		if not A.path.exists(G):A.makedirs(G,exist_ok=B)
		D=J(K)
	C.stdout.write(json.dumps(D));C.stdout.flush()
