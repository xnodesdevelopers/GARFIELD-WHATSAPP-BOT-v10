#!/usr/bin/env python3
K='success'
J='error'
I=ValueError
E=False
B=True
import yt_dlp as U,json,sys as C,os as A,subprocess as D
from contextlib import redirect_stdout as V,redirect_stderr as W
from io import StringIO as M
N=A.path.join(A.path.dirname(__file__),'cookies.txt')
H=A.path.join(A.path.dirname(__file__),'store')
def G(url):
	T='duration';S='mp4';L='title';O={'outtmpl':A.path.join(H,'%(id)s.%(ext)s'),'quiet':B,'no_warnings':B,'nocheckcertificate':B,'socket_timeout':15,'retries':3,'progress':E,'format':'bestvideo[height<=360][ext=mp4][vcodec^=avc][fps<=30]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]','merge_output_format':S,'postprocessors':[{'key':'FFmpegVideoRemuxer','preferedformat':S}],'fragment_retries':3,'skip_unavailable_fragments':B,'keep_fragments':E,'extractor_args':{'youtube':{'player_skip':['js','configs','webpage'],'skip':['hls','dash']}},'throttledratelimit':1000000,'buffersize':65536,'http_chunk_size':1048576}
	if A.path.exists(N):O['cookiefile']=N
	P=M();Q=M()
	try:
		with V(P),W(Q):
			with U.YoutubeDL(O)as G:
				F=G.extract_info(url,download=E)
				if not F or L not in F:raise I('Failed to extract metadata')
				G.params.update({'noprogress':B});G.download([url]);C=G.prepare_filename(F)
				if not C.endswith('.mp4'):X,a=A.path.splitext(C);R=f"{X}.mp4";A.rename(C,R);C=R
				try:Y=['ffmpeg','-v',J,'-i',C,'-t','0.1','-f','null','-'];D.run(Y,stdout=D.PIPE,stderr=D.PIPE,check=B,timeout=10)
				except D.CalledProcessError:raise I('Downloaded video is corrupted or unplayable')
				except D.TimeoutExpired:
					if A.path.exists(C):0
					else:raise I('Video verification timed out')
				return{K:B,'filename':A.path.abspath(C),L:F.get(L,'Unknown'),T:F.get(T,0)}
	except Exception as Z:return{K:E,J:f"Error: {str(Z)}"}
	finally:P.close();Q.close()
if __name__=='__main__':
	if len(C.argv)!=2:F={K:E,J:'Usage: python ytdl.py <url>'}
	else:
		L=C.argv[1]
		if not A.path.exists(H):A.makedirs(H,exist_ok=B)
		F=G(L)
	C.stdout.write(json.dumps(F));C.stdout.flush()
