// Utils.js (c) ThA
/*jslint bitwise:true, convert:true, eval:true, long:true, multivar:true,
 browser:true, devel:true, single:true, white:true
-- Jslint: too many pbs with regexps.
*/
/*jshint bitwise:false, maxlen:500, noarg:false, nocomma:false, strict:false,asi:true,laxbreak:true,
 evil:true, funcscope:true, scripturl:true, nonstandard:true, browser:true
*/
/* eslint-env browser */
/* eslint no-bitwise:0, max-len:0, no-caller:0, no-sequences:0, strict:0,
 no-eval: 0, no-empty:0, no-script-url: 0, no-unused-vars:0
*/
/*global
ATUtilsInit, iLangue, iLangueDate, ActiveXObject, JSON, self, innerWidth, innerHeight, screenLeft, screenTop
*/

var ATUtilsVersion='17.00.05';

/*
	Les parametres identifants ObXs acceptent Id, Name (prend tous), Objets, collections, tableaux. Selecteurs JQuery Ok
	Variables globales de controles: ATUtilsInit, iLangue, ATdoLog, CharDblLoc, iLangueDate, NoGoToCat, DoAffLoading, ATtabLng, DoSelLanguage.etc
*/

function $Xid(i,o){try{return (!o||o===document)?document.getElementById(i):o.querySelector('#'+i.replace(/([^0-9A-Za-z])/g,'\\$1'));}catch(e){}}
function $Xname(i,o){try{return (i!=='*'&&(!o||o===document))?document.getElementsByName(i||''):(o||document).querySelectorAll('[name'+(i!=='*'?'="'+i.replace(/([^0-9A-Za-z])/g,'\\$1')+'"]':']'));}catch(e){}}
function $Xtag(i,o){return (o||document).getElementsByTagName(i||'');}
function $Xqs(s,o){try{return (o||document).querySelector(s);}catch(e){}}
function $Xqsa(s,o){try{return (o||document).querySelectorAll(s);}catch(e){return []}}
function $Xclass(c,o){
	try{return c==='*'?(o||document).querySelectorAll('[class]'):(c?(o||(o=document)).getElementsByClassName(c):[]);
	}catch(e){return document.getElementsByClassName?[]:(o||document).querySelectorAll('.'+c.replace(/\./g,'\\.').replace(/\s+/g,'.'));}
}
function $Xelt(i,o){ // Accept object or string or array. String: seach for Id, then Name then escape and QS, then QS as is.
	try{var t;
	return (typeof i==='object'?(i.tagName?i:((i.length && i[0].tagName)?i[0]:(typeof i[0]==='string'?$Xelt(i[0],o): null))):
	((!o||o===document?document.getElementById(i):o.querySelector('#'+(t=i.replace(/([^0-9A-Za-z])/g,'\\$1'))))
	||(!o||o===document?document.getElementsByName(i)[0]:o.querySelector('[name="'+t+'"]'))
	||(o||document).querySelector(t||i.replace(/([^0-9A-Za-z])/g,'\\$1'))
	||(t==i?null:(o||document).querySelector(i))));
	}catch(e){try{return (i?(o||document).querySelector(i):null);}catch(e){}}
}
function $Xelts(i,o){ // ALWAYS return an array. Accept strings, objects, arrays. Search ids, THEN names THEN escape and QSA , THEN QSA as is.
	try{var r,t;
	return ((typeof i==='object' && i.tagName)?[i]:(ATisArray(i)?ATforEach(i,function(e){return $Xelt(e,o)},'*'):
	(((r=(o||(o=document)).querySelectorAll('#'+(t=i.replace(/([^0-9A-Za-z])/g,'\\$1'))))&&r.length)?r:
	(((r=(o===document?document.getElementsByName(i):o.querySelectorAll('[name="'+t+'"]')))&&r.length)?r:
		(((r=o.querySelectorAll(t))&&r.length)?r: o.querySelectorAll(i))))));
	}catch(e){try{return (i?o.querySelectorAll(i):[]);}catch(e){return[]}}
}
function $Xhas(s,h,o,c){ // returns array of elts s (in o) for whom s.querySelector(h) exists
// if (c) populates [].XhasChildren for elts
	var ox=$Xqsa(s,o);
	if (!h || !ox || !ox.length) return ox;
	for (var i=0,l=ox.length,r=[];i<l;i++) {
		if ($Xqs(h,ox[i])) {r.push(ox[i]); if(c)r[r.length-1].XhasChildren=$Xqsa(h,ox[i]);}
		}
	return r;
}
//***********************************************

function ATLog(stMsg, TimeStamp, doLog, w) {
/*	Log messages. Compatibles IE, timers, Mobiles.
	pour error: passer ['msg',e] e=err/{error:'..'}
	doLog: !div! -> trace haut. Objet->dedans
*/
	if(!w)w=window;
	if (w.ATdoLog===false && !doLog) return;
	var tp=0,stS='',st1='';
	if (ATisArray(stMsg)) {
		if (stMsg.length===2 && (stMsg[1].error||(stMsg[1].stack && stMsg[1].message))) {tp=1;stS='background-color:#FAA;color:#B00;';st1='!err! %c';}
		else {tp=2;stS='font-style:italic;color:#888;';st1='[array]: %c';}
	}else{if (typeof stMsg==='object') {tp=3;stS='font-style:italic;color:#888;';st1='{object}: %c';}}

	stMsg=(TimeStamp?((TimeStamp===true?ATTimeStamp():TimeStamp)+': ') : '') +
		(tp===1?stMsg[0]+' :: '+(stMsg[1].error||(stMsg[1]+'\r\n'+XTrim((stMsg[1].stack||'').replace(new RegExp(EscRegExp(stMsg[1])),'')))):
		(tp===2||tp===3?JSON.stringify(stMsg):
		stMsg));
	if (doLog===undefined) doLog=w.ATdoLog;
	if (w.console && typeof doLog!=='string' && (typeof doLog!=='object' || doLog===w.console)) {w.console.log(st1+stMsg,stS);}
	else {
		var oid,addX=true, d=w.document;
		if (typeof doLog!=='object') {
			if (doLog==='!div!'){addX=false;doLog='div';}
			oid=(doLog===true || doLog==='div')?'ATLogDiv':doLog;
			doLog=$Xid(oid,d);
			}
		stMsg=st1.replace(/\%c/,'<span style="'+stS+'">')+stMsg.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\r\n/g,'<br/>\r\n')+(st1.indexOf('%c')>=0?'</span>':'');
		if (!doLog) {
			SetInnerHtmlObj(d.body,'<div id='+oid+' onclick="if(confirm(\'Full Del ?\')){ATdelObj(this);}else{this.style.display=\'none\';}" style="position:absolute;z-index:999999;top:0;left:0;width:50%;padding-left:4px;height:5em;overflow:auto;background-color:#ff8;color:#400;border:1px solid #222;opacity:.8;filter:alpha(opacity=80);">'+stMsg+'<br/></div>',true);
			doLog=$Xid(oid,d);
			}
		else {
			SetInnerHtmlObj(doLog, stMsg+'<br/>', addX);
			if (doLog.style.display==='none'){
				w.clearTimeout(ATLog.wto);
				doLog.style.display='';
				ATLog.wto=w.setTimeout(function(){doLog.style.display='none';doLog=null;},3000);
				}
			}
		if (doLog) doLog.scrollTop=doLog.scrollHeight;
		}
}

function ATiNav(vOAxDef) {
/* .isIE789: Version de IE ou 99 pour FF, 100 pour WebKit
	.isOAx: 0=Cf isIE789, 1=iPhone/iPod, 2=iPad, 3=Android-Tel, 4=Android-Tab, 5=WebOs, 6=IEMobile, 7=IETab (arm ou Touch), 8=Silk, 9="Mobile", 10="Tablet"
	< 0: idem > 0, + une version de Chrome detectee
*/
	if (ATiNav.isOAx!==undefined) {
		if (vOAxDef && ATiNav.isOAx===0) ATiNav.isOAx=vOAxDef;
		return ATiNav.isOAx;
		}
	var i,st=navigator.userAgent;
	ATiNav.isIE789=st.indexOf('MSIE ')<0?(st.search(/WebKit/i)>=0?100:(st.search(/Trident/i)>=0?parseInt(st.replace(/^.*; rv:/,''),10):99)):parseInt(st.replace(/^.*MSIE /,''),10);
	ATiNav.Loaded=ATiNav.isIE789<9?'load':'DOMContentLoaded';
	ATiNav.standalone=navigator.standalone || (window.matchMedia && matchMedia('(display-mode: standalone)').matches);
	i=st.search(/iPhone|iPod/i)>=0?1:
	((st.search(/iPad/i)>=0 || (st.search(/Mac OS X/)>=0 && navigator.maxTouchPoints>1))?2:
	(st.search(/Android/i)>=0?(st.search(/Mobile/i)>=0?3:4):
	(st.search(/WebOS/i)>=0?5:
	(st.search(/IEMobile/i)>=0?6:
	(st.search(/(MSIE.*ARM.*Touch)|(Trident.*Touch)/i)>=0?7:
	(st.search(/Silk/i)>=0?8:
	(st.search(/Mobile/i)>=0?9:
	(st.search(/Tablet/i)>=0?10:
	(vOAxDef||0) ))))))));
	if (i!==3 && i!==4 && st.search(/Chrome|CriOS/i)>=0) i=-i;
	ATiNav.isOAx=i;
	try{ATiNav.localStorage=window.localStorage||0;}catch(e){ATiNav.localStorage=!1;}
	ATiNav.PassiveEvents=!1;
	try {
		addEventListener("test", null, { get passive() {ATiNav.PassiveEvents=!0;} });
		}catch(e){}
	return i;
}

function ATgetVendor(StyleProp) {
	var dbs=document.body.style;
	if (dbs[StyleProp]!==undefined) return StyleProp;
	var st=StyleProp.charAt(0).toUpperCase()+StyleProp.substr(1);
	return (dbs['webkit'+st]!==undefined?'webkit':
		(dbs['Moz'+st]!==undefined?'Moz':
		(dbs['ms'+st]!==undefined?'ms':'O'
		))) + st;
}

//***********************************************
function encodeURIComponent8859(st) {
	return ((typeof st==='number'||typeof st==='bigint)')?st:(st||'').replace(/([^A-Z,a-z,0-9])/g,function(x){var c=x.charCodeAt(); return (c>255? ('%26%23'+c+'%3b') : ('%'+(c<16?'0':'')+c.toString(16)));}));
}
function decodeURIComponent8859(st) { return unescape(st); }

function decodeHtml(h) {
	if (!h || typeof h!=='string' || h.indexOf('&')>=h.lastIndexOf(';')) return h;
	var g=h.replace(/&#([0-9]+);/g,function(m,x){return String.fromCharCode(x)}).replace(/&([lg])t;/g,function(m,x){return x==='l'?'<':'>'});
	if (g.indexOf('&')>=g.lastIndexOf(';')) return g;
	var t=document.createElement('textarea');
	t.innerHTML=g;
	return t.value;
}

function ATshortUID(lmax) {// 6->16, Default:10
	return ((new Date().getTime()-1388534400000).toString(36)+(+Math.random().toString().substr(3,10)).toString(36)).substr(0,lmax||10);
}

function ATisArray(o) {
	switch(Object.prototype.toString.call(o).substr(8)){
	case 'Array]':return 'Array';
	case 'NodeList]':return 'NodeList';
	case 'HTMLCollection]':return 'HTMLCollection';
	case 'Object]':if(o&&o.length&&o[0].tagName&&ATiNav.isIE789<9)return 'NodeList';
	}
	return false;
}

function ATjsonParse(js){ // Support '{a:1}' as '{"a":1}'
	if (js && typeof js==='string') {try{js=JSON.parse(js);}catch(e){
		if ('[{'.indexOf(js.replace(/^\s+/,'').charAt(0))>=0) try{js=eval('('+js+')');}catch(e){js=false;}}
		}
	return js;
}

function ATfnExec(fthis,fn) {
/* fn: text or function - Arrays ok. if func, parameters follows. if string: parameter is {var1:val1,...}
	if no fn, check&use fn=fthis and fthis=null
*/
	if (!fn) {
		if (!this) return;
		fn=fthis; fthis=null;
		}
	if (ATisArray(fn)) {
		for (var i=0, p=Array.prototype.slice.call(arguments,2), r=[]; i<fn.length; i++) {
			r.push (p.length? ATfnExec.apply(fthis, Array.concat([fn[i]],p) ) : ATfnExec(fthis,fn[i]) );
			}
		return r;
		}
	try{
		if (typeof fn==='string') {
			if (arguments.length<=2) return eval(fn); // && (!fthis||fthis===window))
			var p=arguments[2],st='';
			if (typeof p==='object') {
				for (var k in p) {
					if (p.hasOwnProperty(k)) st+='var '+k+'=p["'+k+'"];';
					}
				}
			return eval(st+fn);
			}
		else {
			return (typeof fn==='function'?
				(arguments.length>2?fn.apply(fthis,Array.prototype.slice.call(arguments,2)):fn())
				: fn);
			}
	}catch(e){ATLog(['fn error "'+fn+'"',e]);return null;}
}

function ATforEach(arobj, fn, ropt) {
/* Makes foreach whatever arobj type is.
	if ropt===false: returns nothing, ropt==='*': pushs only if fn return not null nor undefined
	other values of ropt (true): returns same type as arobj with return of function fn; no ropt(undefined/null/0/''): returns original obj
	fn has parameters in same order (value, index, ArrayOrObject[, key]), depending on type
*/
	var i=0, r, fx;
	if (ATisArray(arobj)) {
		if (ropt) {
			r=[]; fx=ropt==='*'?function(v){if(v!=null)r.push(v);}:function(v){r.push(v);};
			for (;i<arobj.length; i++) { fx(fn(arobj[i], i, arobj)); }
			}
		else {
			for (;i<arobj.length; i++) { fn(arobj[i], i, arobj); }
			}
		}
	else if (typeof arobj==='object') {
		if (ropt) {
			r={}; fx=ropt==='*'?function(v){if(v!=null)r[key]=v;}:function(v){r[key]=v;};
			for (var key in arobj) {
				if (arobj.hasOwnProperty(key)) fx(fn(arobj[key], i++, arobj, key));
				}
			}
		else {
			for (var key in arobj) {
				if (arobj.hasOwnProperty(key)) fn(arobj[key], i++, arobj, key);
				}
			}
		}
	else {
		r=fn(arobj,i);
		}
	if (ropt!==false) return ropt?r:arobj;
}


function ATextend() { // ATextend( [deep,] obj1,...objn) return joined objects ("untyped"). if first obj is Array: merge arrays !. Support stringified.
	var a, b=(typeof arguments[0]==='boolean'), deep=b?arguments[0]:false, r={};
	for (var i=b?1:0, first=true, bAr=false; i < arguments.length; i++) {
		if (typeof (a=arguments[i])==='string') a=ATjsonParse(a);
		if (first) {first=!first; if (ATisArray(a)) {r=[];bAr=!bAr;}}
		if (bAr) {
			for (var j=0; j<a.length; j++) {
				if (r.indexOf(a[j])<0) r.push(a[j]);
				}
			}
		else {
			for (var key in a) {
				if(a.hasOwnProperty(key)) {
					if (deep && r[key] && typeof a[key]==='object' && a[key]) {
						r[key] = ATextend(deep,r[key],a[key]);
						}
					else {
						r[key] = a[key];
						}
					}
				}
			}
		}
	return r;
}

function EscRegExp(v) {
	return (v==null?'':v.toString().replace(/([\\\[\](){}|.*+?\^$])/g,'\\$1'));
}
//***********************************************
function setTimeout2(f,m) { // Parameters of f(..) follows m
	if(typeof f==='function') {
		var args = Array.prototype.slice.call(arguments,2),
			fx = (function(){ f.apply(null, args); });
		return setTimeout(fx,m);
	}
	return setTimeout(f,m);
}
function setInterval2(f,m) {
	if(typeof f==='function') {
		var args = Array.prototype.slice.call(arguments,2),
			fx = (function(){ f.apply(null, args); });
		return setInterval(fx,m);
	}
	return setInterval(f,m);
}

//***********************************************
function ATgetWFx(Fname){
	if (Fname.indexOf('.')>0) {
		var a=Fname.split('.'), f=a.splice(1).join('.');
		if (window[a] && window[a].window===window[a]) {
			return [window[a][f], window[a], f];
			}
		}
	return [window[Fname],window,Fname];
}
function ATrecallFunction(Fname,fthis,fargs,after,evo,argp) {
/* evo; +1(reset to "after")/-1:exec at first "after". Can be used to delay and avoid multiple calls, based on Fname.ATrecallFunction:
	function X(..){if(!X.ATrecallFunction){return ATrecallFunction('X',this,arguments,250,1)};..;ATLog('Ok:'+X.ATrecallFunction);}
	or to avoid task "collision" -whatever the purpose
	function X(..){if(this/X.trt){ATrecallFunction('X',this,arguments,5000,1); return};this.trt=1;..;ATLog('Ok:'+X.ATrecallFunction); this/X.trt=0;}
	argp: -1=ignore args for tmo, other value: concat to Fname for tmo
*/
	var wf=ATgetWFx(Fname);
	if (!evo) return setTimeout(function(){
		wf[1][wf[2]].apply(fthis,fargs);
		}, after);
	if (!ATrecallFunction.tmo) ATrecallFunction.tmo=[];
	var t, fx=argp?(argp!==-1?Fname+argp:Fname):(Fname+'('+Array.prototype.join.call(fargs,',')+')');
	if ((t=ATrecallFunction.tmo[fx])) {
		if (evo<0) return t;
		clearTimeout(t);
		}
	return (ATrecallFunction.tmo[fx]=setTimeout(function(){
		wf[1][wf[2]].ATrecallFunction=ATrecallFunction.tmo[fx];
		delete ATrecallFunction.tmo[fx];
		wf[1][wf[2]].apply(fthis,fargs);
		wf[1][wf[2]].ATrecallFunction=0;
		}, after));
}
function ATwaitForFunction(Fname,poll,r) {
	var wf=ATgetWFx(Fname);
	if (typeof wf[0]!=='function') {
		wf[1][wf[2]]=function() {
			ATrecallFunction(Fname,this,arguments,poll||150);
			return r;
			};
		wf[1][wf[2]].ATrecallFunction=-1;
		}
	return wf;
}
function ATexecOrWait(Fname,fargs, poll,r) {
	var wf=ATwaitForFunction(Fname,poll,r);
	return wf[1][wf[2]].apply(this,fargs);
}

function ATifExec(Test,fOk,fNok,poll,tmout) {
// Exec fOk if Test, until tmout. Retry every poll
	try { var b=typeof Test==='function'? Test() : eval(Test); }
	catch(e){tmout=0;}
	if (b) {
		if (typeof fOk==='function') {fOk(b);} else {eval(fOk);}
		}
	else {
		if (tmout>0 || tmout===undefined) {
			if(!poll)poll=250;
			setTimeout(function(){ATifExec(Test,fOk,fNok,poll,(tmout||30000)-poll);}, poll);
			}
		else {
			if (typeof fNok==='function') {fNok();} else {eval((fNok===true || fNok==='*')?fOk:fNok);}
			}
		}
}
//***********************************************
function GetCaseLangue(Msg0, Msg1) {
	return ((window.iLangue==2 && Msg1)?Msg1:Msg0);
}
function GetCaseLangueExt(Msg, lngDef, iLng) {
/*	Msg: "fr=xxx¤en=yyy¤es=zzz" ou "1=xxx¤2=yyy¤3=zzz...." ou \r\n en sep.
	lngDef: default_lng / '*'-0-undef: uses first
	iLng: force current lang (otherwise global iLangue)
*/
	if (!window.ATtabLng) ATtabLng=['','fr','en','de','es','it','nl','pt'];
	if (Msg==''||Msg==null) return '';
	if (Msg.indexOf('¤')<0 && Msg.indexOf('\r\n')>0) Msg=Msg.replace(/\r\n/g,'¤').replace(/\^/g,'\r\n');
	var i=iLng || window.iLangue || 1,
		st=GetParamsX(Msg,i,'','¤');
	if (st) return st;
	return GetParamsX(Msg,ATtabLng[i],'','¤')
		|| ((lngDef==='*' || lngDef===0 || lngDef==null)? Msg.substr(Msg.indexOf('=')+1).replace(/^¤+/,'').replace(/¤.*/,'')
			: (lngDef? GetCaseLangueExt(Msg,'*',(+lngDef || ATtabLng.indexOf(lngDef.toLowerCase()))) : '')
			);
}
function SetiLangue(ix,vDef) {
//	Defines iLangue, based on Url/Content/Browser
	if (!window.ATtabLng)GetCaseLangueExt();
	if (ix===undefined || ix==='*') {
		ix=ATQueryParam('*','Lng');
		if (isNaN(ix)) {
			var x=document.createElement('A');
			ix = ($Xqs('html')||x).getAttribute('lang') || ($Xqs('meta[http-equiv="content-Language"]')||x).getAttribute('content')||
				navigator.language||navigator.browserLanguage||'fr-FR';
			}
		}
	if (+ix>=0) {window.iLangue=+ix; return;}
	window.iLangue=ix?ATtabLng.indexOf(ix.replace(/-.*/,'').toLowerCase()):-1;
	if (iLangue<0) iLangue=vDef||0;
}

function DoSelLanguage(xParam,DoSep,NOHRefLang) {
/* DoSelLanguage.xx:
	.Def='FR'
	.UkEn='uk'
	.Sep='_' (if DoSep. DoSep='-'->Remove)
	.Key='Lng'
	.Home='Default.asp'
*/
	xParam=xParam.toUpperCase(); if (xParam==='F') xParam='FR';
	if ($Xqsa('link[hreflang]').length && !NOHRefLang) {
		if (+xParam>=0) {if(!window.ATtabLng){GetCaseLangueExt();}xParam=ATtabLng[+xParam];}
		var o=$Xqs('link[hreflang^='+(xParam==='UK'?'en':xParam)+']');
		if (o && o.href) {
			loadHttpX(o.href,function(){document.location=o.href;},!0,'GET',function(){DoSelLanguage(xParam,DoSep,!0);});
			return;
			}
		}
	var stx, stk, j,
		D=DoSelLanguage.Def||'FR',
		S=DoSelLanguage.Sep||'_',
		K=DoSelLanguage.Key||'Lng',
		st=document.location.href,
		i=st.indexOf('#'), E=i<0?'':st.substr(i);
	if (i>=0) st=st.substr(0,i-1);
	if (st.charAt(st.length-1)=='/') {
		st+=(DoSelLanguage.Home||'Default.asp')+'?'+K+'='+xParam;
		}
	else {
		st=st.search(new RegExp('[?&]'+K+'=','i'))<0? (st+(st.indexOf('?')<0?'?':'&')+K+'='+xParam) : st.replace(new RegExp('([?&]'+K+'=)[^&]*','gi'),'$1'+xParam);
		}
	i=st.indexOf('?');
	stx=st.substr(0,i);
	st=st.substr(i);
	i=stx.lastIndexOf('/')+1;
	if (i) {stk=stx.substr(i); stx=stx.substr(0,i);} else {stk=stx; stx='';}
	if (DoSep==null||DoSep) {
	 i=stk.lastIndexOf('.');
	 if (i<0||i<stk.length-5)i=stk.length;
	 j=(i>2 && stk.substr(i-3,3).search(new RegExp(S+'(fr|uk|en|de|es|it|nl|pt)','i'))===0)? i-3 : i;
	 if (DoSep=='-') {
		stk=stk.substr(0,j)+stk.substr(i);
		}
	 else {
		switch (xParam) {
		case 'UK': case 'EN' :
			stk=stk.substr(0,j)+(D==xParam?'':(S+(DoSelLanguage.UkEn||'uk')))+stk.substr(i);
			break;
		default:
			stk=stk.substr(0,j)+(D==xParam?'':(S+xParam.toLowerCase()))+stk.substr(i);
		}
	 }
	}
	document.location = stx+stk+st+E;
}

function ATparseQuery(query, KeyLcase) {
	if (!query) return []; // return empty array
	if (ATparseQuery.PrevQParam && ATparseQuery.PrevQParam[0] === query) {
		return ATparseQuery.PrevQParam[1];
		}
	if (query === '*' || query ==='*p') {// Retourne Query de l'URL de la page en cours
		ATparseQuery.PrevQParam=[query];
		if (window.location.search.length < 2) return [];
		query = window.location.search.substr(1);
		if (KeyLcase===undefined) KeyLcase=true;
		}
	else if (query === '*s') { // Retourne Query de l'URL du script en cours (Danger avec presence asynchrones)
		var Xscripts = $Xtag('script'),
			XmyScript = Xscripts[Xscripts.length-1];
		if (XmyScript.src.indexOf('?')<0) return [];
		if (ATparseQuery.PrevQParam && ATparseQuery.PrevQParam[0]===XmyScript.src) return ATparseQuery.PrevQParam[1];
		ATparseQuery.PrevQParam=[XmyScript.src];
		query = XmyScript.src.replace(/^[^?]+\??/,'');
		}
	else if (query === '*S') { // Retourne Query des URLs de tous les scripts (Cool si appels asynchrones presents)
		for (var Xscripts = $Xtag('script'), i=Xscripts.length-1, s, k; i>=0; i--) {
			s=Xscripts[i].src; k=s.indexOf('?');
			if (k>=0) query += '&'+s.substr(k+1);
			}
		if (ATparseQuery.PrevQParam && ATparseQuery.PrevQParam[0]===query) return ATparseQuery.PrevQParam[1];
		ATparseQuery.PrevQParam=[query];
		}
	else {
		ATparseQuery.PrevQParam=[query];
		}
	ATparseQuery.PrevQParam[1]=[];
	if (query !== '') {
		for (var i=0, KV=query.split('&'), keyl, K; i < KV.length; i++ ) {
			if(i===0&&KV[i].indexOf('?')>0)KV[i]=KV[i].split('?')[1];
			var KeyVal = KV[i].split('=');
			if ((KeyVal) && (KeyVal.length===2)) {
				try {
					var key = decodeURIComponent( KeyVal[0] );
					} catch(e){try {key = decodeURIComponent8859( KeyVal[0] );}catch(e){}}
				K=ATparseQuery.PrevQParam[1][keyl=(KeyLcase?key.toLowerCase():key)];
				K= K==null ? '' : (K+','); // Gestion des X=1&X=2..
				try {
					ATparseQuery.PrevQParam[1][keyl] = K + decodeURIComponent( KeyVal[1] ).replace(/\+/g, ' ');
					}catch(e){
					try {ATparseQuery.PrevQParam[1][keyl] = K + decodeURIComponent8859( KeyVal[1] ).replace(/\+/g, ' ');}catch(e){}
					}
				}
			}
		}
	return ATparseQuery.PrevQParam[1];
}

function ATQueryParam(query,key,KeyLcase) {
	if (!query)return;
	if (query.toLowerCase()==='*sp') {
		var st=ATQueryParam(query.substr(0,2),key,KeyLcase);
		return (st===undefined? ATQueryParam('*',key,KeyLcase) : st);
		}
	var Tbx=ATparseQuery(query,KeyLcase);
	return (Tbx?Tbx[KeyLcase?key.toLowerCase():key]:Tbx);
}

//***********************************************
function AT2Date(X,sep,ord) {//Return date object at current TZ
	if (window.iLangueDate===undefined) iLangueDate=window.iLangue||0;
	try{
	if (!X) return new Date();
	switch (typeof X) {
		case 'string':
			var Y=$Xelt(X);
			if (Y) X=Y.value;
			break;
		case 'object':
			if (X.getDay) return X;
			if (X.tagName) X=X.value;
		}
	if (sep===undefined) sep=X.indexOf('/')<0?'-':'/';
	if (ord===undefined) ord=iLangueDate==2?'mdy':'dmy';
	var D=(XTrim(X).replace(new RegExp('['+sep+' ]+','g'),':')).split(':'),
		stx=D[ord.indexOf('y')]+'-'+XFormat(D[ord.indexOf('m')],2)+'-'+XFormat(D[ord.indexOf('d')],2)+(ord.indexOf('h')<0?'':'T'+XFormat(D[ord.indexOf('h')],2)+':'+XFormat(D[ord.indexOf('i')]||0,2)+':'+XFormat(D[ord.indexOf('s')]||0,2) ),
		d=new Date((stx.indexOf('-')<3?'20':'')+stx);
	return new Date(d.setMinutes(d.getMinutes()+d.getTimezoneOffset()));
	}catch(e){}
}

function ATDate(d) {//Return date string at current TZ
	try{
	d=AT2Date(d);
	return new Date(d.setMinutes(d.getMinutes()-d.getTimezoneOffset())).toISOString().replace(/\..*/,'').replace(/T/,' ');
	}catch(e){}
}

function ATchrono(x) {
	switch ((x||'').toString().toLowerCase()) {
		case 'start':
			ATchrono.t=new Date(); return 0;
		case 'get':	if (!ATchrono.t) return ATchrono('start');
			var dx=new Date()-ATchrono.t,
				m=Math.floor(dx/60000),
				s=Math.floor((dx-m*60000)/1000),
				ms=dx-m*60000-s*1000;
			return (m?m+'min ':'')+(s?s+'s':'')+(ms<10?'00':(ms<100?'0':''))+ms+'ms';
		case 'stop':	var r=ATchrono('get');
			ATchrono.t=0;
			return r;
		case 'restart':
			var r=ATchrono('stop'); ATchrono('start'); return r;
	}
}

function ATmsStamp(d,Fmt) {
	return (Fmt?+ATDateFmt(d,'yymmddhhmnssms'):AT2Date(d).getTime());
}
function ATTimeStamp(d) {
	try{
	d=AT2Date(d);
	return XFormat(d.getHours(),2)+':'+XFormat(d.getMinutes(),2)+':'+XFormat(d.getSeconds(),2)+'.'+XFormat(d.getMilliseconds(),3);
	}catch(e){}
}
function ATDateFmt(d,Fmt) {// Fmt: yyyy,yy,mm,dd,hh,mn,ss,ms
	try{
	d=AT2Date(d);
	return (Fmt || (iLangueDate==2?'mm-dd-yyyy':'dd-mm-yyyy')).replace(/yyyy/gi,d.getFullYear()).replace(/yy/gi,d.getFullYear().toString().substr(2)).replace(/mm/gi,XFormat(d.getMonth()+1,2)).replace(/dd/gi,XFormat(d.getDate(),2)).replace(/hh/gi,XFormat(d.getHours(),2)).replace(/(mi|ii|mn)/gi,XFormat(d.getMinutes(),2)).replace(/ss/gi,XFormat(d.getSeconds(),2)).replace(/ms/gi,XFormat(d.getMilliseconds(),3));
	}catch(e){}
}
function ATDateAdd(NbDays,Date0) {
	try{
	Date0=AT2Date(Date0).getTime() + (typeof NbDays==='string'?NbDays>>>0:NbDays)*86400000;
	return new Date(Date0);
	}catch(e){}
}
function ATDateDiff(d2,d1,dhms,sep,ord) {
	d2=AT2Date(d2,sep,ord); d1=AT2Date(d1,sep,ord);
	switch (dhms || 'd') {
		case 'd' : return Math.floor((d2-d1)/86400000);
		case 'h' : return Math.floor((d2-d1)/3600000);
		case 'm' : return Math.floor((d2-d1)/60000);
		case 's' : return Math.floor((d2-d1)/1000);
		}
}
function ATDateMonthEnd(d,fmt) {
	d=AT2Date(d);
	var m=d.getMonth();
	return ATDateFmt(ATDateAdd(-1,AT2Date('1/'+((m>10? 0 : (m+1))+1)+'/'+(d.getFullYear()+(m>10?1:0)),'/','dmy')),fmt);
}
function ATDateXMonthStart(NbMonths,d,fmt) {
	d=AT2Date(d);
	var m=d.getMonth()+(+NbMonths||0), y=d.getFullYear();
	if (m<0) {
		y=y-Math.floor((11-m)/12);
		m=(12+(m%12))%12;
		}
	else if (m>11) {
		y=y+Math.floor(m/12);
		m=m%12;
		}
	return ATDateFmt(AT2Date('1/'+(m+1)+'/'+y),fmt);
}
function ATDateXYearStart(NbYears,d,fmt) {
	return ATDateFmt(AT2Date('1/1/'+(AT2Date(d).getFullYear()+(NbYears||0))),fmt);
}
function ATDateCountWeekDays(d2,d1,stWD,sep,ord) { // stWD:'0123456'
	d2=AT2Date(d2,sep,ord); d1=AT2Date(d1,sep,ord);
	if (d1>d2) {var d=d1; d1=d2; d2=d;}
	if (!stWD) stWD='12345';
	for (var d=d1, n=0; d<=d2; d=new Date(d.getTime()+86400000)) {
		if (stWD.indexOf(d.getDay())>=0) n++;
		}
	return n;
}
function ATDateSwapDM(X,sep) {
	if (typeof X==='string'){var Y=$Xelt(X); X=XTrim(Y?Y.value:X);}
	else if (X && typeof X==='object'){X=X.tagName?X.value:ATDate(X);}
	if (!X || typeof X!=='string') return '';
	if (sep===undefined) sep=X.indexOf('/')>=0?'/':'-';
	var t=X.split(sep);
	return (t.length?XTrim(t[1]+sep+t[0]+sep+t[2]+' '+t.slice(3).join(':')):X);
}

//***********************************************
function DblEval(X,vDef) {
//	Ne fait pas isNaN a cause string '1,2'
	if (typeof X==='string') {
		if (X.charCodeAt(0)>57) {var Y=$Xelt(X); if (Y) X=Y.value===undefined?Y.innerText:Y.value;}
		}
	else if (X && typeof X==='object' && X.tagName) X=X.value===undefined?X.innerText:X.value;
	return (X==0?0:(
	(!X)?(vDef||0) : (parseFloat((''+X).replace(/\s/g,'').replace(/&nbsp;/g,'').replace(',','.')) || vDef || 0)
	));
}

function XRound2(x,nbDec) {
//	return 0.01*Math.round(100*x+0.1); // PB AVEC ARRONDIS: 69.615 DONNE 69.61 AU LIEU DE 69.62. cf "doubles" Ieee. Dangers: 6982*0.01...
	return (nbDec===undefined||nbDec==2) ?
		(0.01*Math.floor(100*(typeof x!=='number'? DblEval(x):x)+0.5001))
		:(nbDec==0? Math.round(typeof x!=='number'? DblEval(x):x)
			:(Math.pow(10,-(nbDec||2))*Math.floor(Math.pow(10,nbDec||2)*(typeof x!=='number'? DblEval(x):x)+0.5001)));
}

function XFormat(x,vLength) {
	for (x=''+XRound2(x);x.length < vLength;x='0'+x);
	return x;
}

function stDblX(x,nbDec,NoMilles,CharDec) {
	if (nbDec==null) {nbDec=2;}
	var stx = '' + XRound2(x||0,nbDec);
	if (!CharDec) {
		if (window.CharDblLoc) {CharDec=window.CharDblLoc;}
		else if (window.iLangue) {CharDec=iLangue<2?',':'.';}
		else {// rechercher meta "content-Language" ou Cf le iso ds ATalert
			CharDec=',';
			}
		}
	var ix=stx.indexOf('.');
	if (ix<=0) {
		if (nbDec) {stx += CharDec+Math.pow(10,nbDec).toString().substr(1);} // 00 si 2
		}
	else {
		if (CharDec!=='.') stx=stx.replace(/\./,CharDec);
		if (ix >= stx.length-nbDec) {stx += Math.pow(10,ix - stx.length + nbDec + 1).toString().substr(1);}
		else {
			try {
				var sty=stx.substr(ix,1+nbDec);
				stx=stx.substr(0,ix)+sty;
				} catch(e) {}
			}
		}
	var st=NoMilles===false?'':'&nbsp;';
	if (NoMilles) {
		if (typeof NoMilles!=='string') return stx;
		st=NoMilles;
		}
	ix=stx.indexOf(CharDec)-3; if (ix===-4) ix=stx.length-3;
	while (ix>0) {stx=stx.substring(0,ix)+st+stx.substring(ix);ix-=3;}
	if (stx[stx.length-1]==CharDec) stx=stx.substring(0,stx.length-1);
	return stx;
}

function stDbl2(x,NoMilles,CharDec) {
	return stDblX(x,2,NoMilles,CharDec);
}

//***********************************************
function ATaddEvent(ObXs, evType, fn, OpCap){
/*	window OR document: Load/DomContentLoaded/DomReady : EXECUTE si pret !
	Exemple: ATaddEvent(window, 'load', AddIdx ); ou 'DOMContentLoaded'
	Set passive if needed and no OpCap
*/
	if (!ObXs) return false;
	if(typeof ObXs==='string') return ATaddEvent($Xelts(ObXs), evType, fn, OpCap);
	if (ATisArray(ObXs)) {
		for (var i=0, k=0; i<ObXs.length; i++) {if(ATaddEvent(ObXs[i], evType, fn, OpCap))k++;}
		return k;
		}
	try {
		var d=document, opc=OpCap||false;
		if (evType.search(/^(load|domcontentloaded|domready)$/i)===0 && (ObXs===window||ObXs===d)){
			if (d.readyState==='complete'||(d.readyState==='interactive' && evType.toLowerCase()!=='load')) return ATfnExec(fn);
			if (ObXs.addEventListener){
				if (evType.toLowerCase()==='load') {ObXs.addEventListener(evType, fn, opc);}
				else {d.addEventListener('DOMContentLoaded', fn, opc);}
			} else {window.attachEvent("onload", fn);}
			return !0;
		}
		if (evType.toLowerCase()==='domsubtreemodified' && ATobserveObject(ObXs,'*',fn)!==false) return !0;
		if (ObXs.addEventListener){
			ObXs.addEventListener(evType, fn,
				(ATiNav.PassiveEvents && evType.search(/^(touchstart|touchmove|touchcancel|touchend|wheel|mousewheel)$/)===0?
					(typeof opc==='object' ? ATextend({passive:true,capture:false},opc) : {passive:true,capture:opc})
					: opc));
			return !0;
		} else if (ObXs.attachEvent){
			return ObXs.attachEvent("on"+evType, fn);
		}
	} catch(e) {ATLog(['Install Handler PB !',e]);}
	return false;
}

function ATremoveEvent(ObXs, evType, fn, OpCap){
	if (!ObXs) return false;
	if(typeof ObXs==='string') return ATremoveEvent(($Xelts(ObXs)), evType, fn, OpCap);
	if (ATisArray(ObXs)){
		for (var i=0,k=0; i<ObXs.length; i++) {if(ATremoveEvent(ObXs[i], evType, fn, OpCap))k++;}
		return k;
		}
	try {
		var opc=OpCap || false;
		if (evType.toLowerCase()==='domsubtreemodified' && ATstopObserve(ObXs,fn,'*','M')!==false) return !0;
		if (ObXs.removeEventListener){
			ObXs.removeEventListener(evType, fn,
				(ATiNav.PassiveEvents && evType.search(/^(touchstart|touchmove|touchcancel|touchend|wheel|mousewheel)$/)===0?
					(typeof opc==='object' ? ATextend({passive:true,capture:false},opc) : {passive:true,capture:opc})
					: opc));
			return !0;
		} else if (ObXs.detachEvent){
			return ObXs.detachEvent("on"+evType, fn);
		}
	} catch(e) {ATLog(['Remove Handler PB !',e]);}
	return false;
}

function ATcancelEvent(e) {
	if (!e) e=window.event;
	if(e.preventDefault) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();
	e.cancelBubble = true;
	e.cancel = true;
	e.returnValue = false;
	return false;
}

function ATfireEvent(ObXs, evType, evParams){
	if (!ObXs) return false;
	if(typeof ObXs==='string') return ATfireEvent(($Xelts(ObXs)), evType, evParams);
	if (ATisArray(ObXs)){
		for (var i=0; i<ObXs.length; i++) {ATfireEvent(ObXs[i], evType, evParams);}
		return;
		}
	if (ObXs.dispatchEvent) {
		var e, t=evType.search(/click|mouse|context/i)>=0?'MouseEvent':
					(evType.search(/touch/i)>=0?'TouchEvent':
					(evType.search(/key/i)>=0?'KeyboardEvent':
					(evType.search(/drag/i)>=0?'DragEvent':
					(evType.search(/focus|blur/i)>=0?'FocusEvent':'Event' ))));
		if (window[t]) {
			e= t=='Event'? new Event(evType, ATextend({bubbles:true, cancelable:true},evParams)) : new window[t](evType,ATextend({bubbles:true, cancelable:true},evParams));
			}
		else {
			e=document.createEvent(t);
			e.initEvent(evType, true, true);
			}
		ObXs.dispatchEvent(e);
		}
	else if (ObXs.fireEvent) { // IE
		var pb=!0;
		if (evType.toLowerCase()=='click') {
			try{ ObXs.click(); pb=!1;}catch(e){}
			}
		if (pb) {
			var clickEvent = document.createEventObject();
			if (evType.search(/click|mouse|context/i)>=0) clickEvent.button = 1;
			ObXs.fireEvent('on'+evType.toLowerCase(),clickEvent);
			}
	}
}

function ATaddHover(Ox,fin,fout) {
	if(typeof Ox==='string')Ox=$Xelts(Ox);
	if(fin)ATaddEvent(Ox,'mouseenter',fin);
	if(fout)ATaddEvent(Ox,'mouseleave',fout);
}
function ATremoveHover(Ox,fin,fout) {
	if(typeof Ox==='string')Ox=$Xelts(Ox);
	if(fin)ATremoveEvent(Ox,'mouseenter',fin);
	if(fout)ATremoveEvent(Ox,'mouseleave',fout);
}


function ATdoObserve(o, fn, p, Tp){
// Tp=R:Resize, I=Intersection, P=Performance, (M=Mutation)
	if (!o || !fn) return;
	var OV=new (Tp==='R'?ResizeObserver:(Tp==='I'?IntersectionObserver:(Tp==='P'?PerformanceObserver:MutationObserver)))(fn);
	OV.observe(o,p||undefined);
	if (!ATdoObserve.T) ATdoObserve.T=[];
	ATdoObserve.T.push({o:o,p:p,Observer:OV,Tp:(Tp||'M'),callback:fn});
}

function ATstopObserve(ObXs, fn, p, Tp){ // '*' = all
	var T=ATdoObserve.T;
	if (!T) return !1;
	if (typeof ObXs==='string' && ObXs!=='*') return ATstopObserve($Xelts(ObXs), fn, p, Tp);
	if (ATisArray(ObXs)){
		for (var i=0; i<ObXs.length; i++) {ATstopObserve(ObXs[i], fn, p, Tp);}
		return;
		}
	for (var o=ObXs, i=T.length-1; i>=0; i--) {
		var t=T[i];
		if ((Tp==='*' || Tp===t.Tp) && (p==='*' || p===t.p)) {
			if (o==='*' && (fn==='*' || fn===t.callback || fn.toString()==t.callback)) {
				t.Observer.disconnect();
				T.splice(i,1);
				}
			if (o===t.o && (fn==='*' || fn===t.callback || fn.toString()==t.callback)) {
				if (t.Tp==='R' || t.Tp==='I') {
					t.Observer.unobserve(o);
					T.splice(i,1);
					}
				else {
					for (var j=T.length-1, n=0; j>=0; j--) {
						if (T[j].Observer===t.Observer) n++;
						}
					if (n<=1) {
						t.Observer.disconnect();
						T.splice(i,1);
						}
					else if (Tp==='M') {
						var p={attributes:true,attributeFilter:['NothingRien']};
						t.Observer.observe(o, p);
						t.p=p;
						}
					}
				}
			}
		}
}

function ATobserveObject(ObXs, What, Fn) {
	if (!ObXs || !window.MutationObserver) return false;
	if (typeof ObXs==='string') return ATobserveObject($Xelts(ObXs),What,Fn);
	if (ATisArray(ObXs)){
		for (var i=0; i<ObXs.length; i++) {ATobserveObject(ObXs[i],What,Fn);}
		return;
		}
	ATdoObserve(ObXs,
		typeof Fn==='function' ? Fn : function(){ATfnExec(Fn);},
		ATextend({subtree:true,childList:true,characterData:true,attributes:true}, (What==='*'?{}:What))
		);
}

function ATwatchStyleAttribut(ObXs,sa,saDo) {
/*	Ex: ATwatchStyleAttribut(o,'width','widthChange') -> Genere Event 'widthChange' when style 'width' changes
	Special case if sa=='size' -> width & height, sa==='position' -> left & top, sa==='rect'-> sz+pos
*/
	var bS=(sa=='width'||sa=='height'||sa=='size'||sa==='rect'),
		bP=(sa=='left'||sa=='top'||sa=='position'||sa==='rect');
	if (!ObXs || !window.MutationObserver) {
		if (ObXs && ATiNav.isIE789 && (bS||bP)) {
			return ATaddEvent(ObXs,'resize',function(){ATfireEvent(ObXs,saDo)});
			}
		return false;
		}
	if (typeof ObXs==='string') return ATwatchStyleAttribut(($Xelts(ObXs)),sa,saDo);
	if (ATisArray(ObXs)){
		for (var i=0; i<ObXs.length; i++) {ATwatchStyleAttribut(ObXs[i],sa,saDo);}
		return;
		}
	var o=ObXs;
	if (bS && window.ResizeObserver) {
		ATdoObserve(o,
			function(e) {
				if (typeof saDo==='function') {saDo(e[0]);}
				else {e[0].target.dispatchEvent(new Event(saDo));}
				}
			,'','R');
		if (!bP) return;
		}
	if (bS||bP) {
		var bL='leftpositionrect'.indexOf(sa)>=0, bT='topositionrect'.indexOf(sa)>=0,
			bW=(sa==='width'||sa==='size'||(sa==='rect'&&!window.ResizeObserver)),
			bH=(sa==='height'||sa==='size'||(sa==='rect'&&!window.ResizeObserver));
		if (!ATwatchStyleAttribut.Ox) {
			ATwatchStyleAttribut.Ox=[];
			}
		else {
			for (var T=ATwatchStyleAttribut.Ox, i=0; i<T.length; i++) {
				if (T[i].o===o) {
					if(bL)T[i].bL=bL;
					if(bT)T[i].bT=bT;
					if(bW)T[i].bW=bW;
					if(bH)T[i].bH=bH;
					return;
					}
				}
			}
		ATwatchStyleAttribut.Ox.push({o:o,R:o.getBoundingClientRect(),F:saDo, bL:bL,bT:bT,bW:bW,bH:bH});
		if (!ATwatchStyleAttribut.itr) {
			ATwatchStyleAttribut.itr=function(){
				for (var T=ATwatchStyleAttribut.Ox, i=0; i<T.length; i++) {
					var t=T[i], B=t.o.getBoundingClientRect();
					if ( (B.x!==t.R.x && t.bL) || (B.y!==t.R.y && t.bT)
						|| (B.width!==t.R.width && t.bW) || (B.height!==t.R.height && t.bH) ){
						if (typeof t.F==='function') {t.F(t.o);}
						else {t.o.dispatchEvent(new Event(t.F));}
						t.R=B;
						}
					}
				};
			setInterval(function(){ATwatchStyleAttribut.itr()},100);
			}
		return;
		}
	var oldSa = o.style[sa];
	ATdoObserve(o,
		function(mutations) {
		 mutations.forEach(function(mutation) {
			if (mutation.target===o && mutation.attributeName==='style' && oldSa!==o.style[sa]) {
				oldSa = o.style[sa];
				if (typeof saDo==='function') {saDo(o);}
				else {o.dispatchEvent(new Event(saDo));}
				}
			});
		 },
		{attributes: true}
		);
}

function ATtrapKey(e,key,f) {
	var keycode;
	if (window.event){keycode=event.keyCode;}
	else if (e){keycode=e.which;} // ou e.keyCode pour certaines valeurs ?
	else {return false;}
	if (!key)key=13;
	if (f) {
		if (keycode==key) {
			if(typeof f==='string'){ATfnExec(f);}else{f(e,key);}
			return false;
			}
		return keycode;
		}
	return (keycode != key);
}

/************
	callback: string/function qui a (req) en 1er param ou: loadHttpX('url', function(req){XX(req,1)} , ...)
	ensuite appeler req.responseText !
*/
function loadHttpX(url,callback,CursorWait,method,callbackerror,responseType,contentType) {
	if (loadHttpX.PendingRequests===undefined) loadHttpX.PendingRequests=0; // Nb de requetes en cours de traitement. Pour qui veut
	if (!url)return;
	var req;
	if (window.XMLHttpRequest) { // Native
		try {
			req=new XMLHttpRequest();
		} catch(e) {req=0;}
	} else if (window.ActiveXObject) { // IE
		try {
			req=new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e) {
			try {
				req=new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e) {req=0;}
		}
	}
	if (req) {
		var t=this;
		req.onreadystatechange=function() {
			if (t===window) t=this;
			if (req.readyState == 4) {
				if (CursorWait){if (typeof CursorWait==='function') {try{CursorWait(false);}catch(e){}} else {document.body.style.cursor='default';}}
				if (req.status == 200) { // only if "OK".. Offline->0: use callbackerror !
					//ATfnExec(t,callback,(typeof callback==='string'?{req:req}:req));
					if (typeof callback==='string'){try{eval(callback);}catch(e){}}
					else {ATfnExec(t,callback,req);}
					}
				else {
					if (callbackerror) {
						if (callbackerror===true || callbackerror==='*') {
							ATfnExec(t,callback,(typeof callback==='string'?{req:req}:req));
							}
						else {
							ATfnExec(t,callbackerror,(typeof callbackerror==='string'?{req:req}:req));
							}
						}
					else {
						if (CursorWait) alert("Problem with XML data retrieving: " + req.status + "\n" + req.statusText);
						}
					}
				req=null; // Liberation ?
				if (--loadHttpX.PendingRequests < 0) loadHttpX.PendingRequests=0;
				}
			};
		try{
		if (!method) {if (url.indexOf('&?')>=0) {method='POST';if(!contentType)contentType='application/x-www-form-urlencoded';}}
		else {if (method=='multipart/form-data') {method='POST';if(!contentType)contentType='multipart/form-data';}}
		if (method=='POST') {
			var U=url.split(url.indexOf('&?')>=0?'&?':'?',2);
			req.open('POST', U[0], true);
			if (responseType) req.responseType=responseType;
			if ((contentType||'').search(/multipart\/form-data/i)>=0) {
				// Pb utf/8859 => Binaire!
				var sB='---------------------------'+ATshortUID(10), S=[];
				for (var i=0, g, FDe=U[1].split('&'), l=FDe.length; i<l; i++) {
					g=FDe[i].split('=');
					if (g[0]) {
						S.push('Content-Disposition: form-data; name="' + g[0] + '"\r\n\r\n' + decodeURIComponent((g[1]||'')) + "\r\n");
						}
					}
				req.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + sB);
				req.sendAsBinary('--' + sB + '\r\n' + S.join('--' + sB + '\r\n') + '\r\n--' + sB + '--\r\n');
				}
			else {
				req.setRequestHeader('Content-Type', contentType||'application/x-www-form-urlencoded');
				req.send(U[1]);
				}
			}
		else {
			req.open("GET", url, true);
			if (responseType) req.responseType=responseType;
			req.send(null);
			}
		}catch(e){
			ATLog(['XMLHTTP Problem !',e]);
			return;
			}
		loadHttpX.PendingRequests++;
		if (CursorWait){if (typeof CursorWait==='function') {try{CursorWait(true);}catch(e){}} else {document.body.style.cursor='wait';}}
		}
	else {
		alert('Pb XMLHTTP');
		}
}
//
if (!XMLHttpRequest.prototype.sendAsBinary) {
	XMLHttpRequest.prototype.sendAsBinary=function(sData) {
		var nBytes=sData.length, ui8Data=new Uint8Array(nBytes);
		for (var i=0; i<nBytes; i++) {
			ui8Data[i]=sData.charCodeAt(i) & 0xff;
			}
		this.send(ui8Data);
	};
}

/***********************************************
	"Vars": Load and manipulates datas from Server(XmlHttpRequest)
*/
function ATpopLoadVar(ix){
	return ATgetLoadVar(ix,1);
}
function ATgetLoadVar(ix,doPop){
//	Return null if not exist, Infinity if not loaded
	if (!ATloadVar.V) return null;
	if (ix===undefined || ix < 0) {ix=ATloadVar.V.length-1;}
	else {
		if (ix >= ATloadVar.V.length || ATloadVar.V[ix].free) return null;
		}
	if (!ATloadVar.V[ix].loaded) {
		return Infinity;
		}
	if (doPop) {
		ATloadVar.V[ix].free=1;
		clearTimeout(ATloadVar.cto);
		ATloadVar.cto=setTimeout(ATcleanLoadVar,20000);
		}
	return ATloadVar.V[ix].value;
}
//***********************************************
function ATloadVar(url,setVname,timeout){
//	Load url, return index to use et eventuellement setVname and clean (delayed)
	if (!url) return;
	var ix=0;
	if (!ATloadVar.V) { ATloadVar.V=[{}]; ATloadVar.trt=1;}
	else {
		ix=ATloadVar.V.length; ATloadVar.V[ix]={}; ATloadVar.trt++;
		}
	if (url=='*') {
		var i=(setVname||'').indexOf('=');
		if (i<=0) {ATloadVar.V[ix].value=(setVname||'').substr(i+1);}
		else {eval(setVname); ATloadVar.V[ix].value=window[setVname.substr(0,i)]; ATpopLoadVar(ix);}
		ATloadVar.V[ix].loaded=1;
		ATloadVar.trt--;
		}
	else {
		var T='if(ATloadVar.V['+ix+'] && !ATloadVar.V['+ix+'].loaded){ATloadVar.V['+ix+'].loaded=',
			F=(setVname?(setVname+'=ATgetLoadVar('+ix+',1);'):'')+'ATloadVar.trt--;}';
		loadHttpX(url,T+'1;ATloadVar.V['+ix+'].value=req.responseText;'+F,0,0,T+'2;'+F);
		setTimeout(T+'-1;'+F,timeout || 5000);
		}
	return ix;
}
function ATcleanLoadVar() {
//	Carrefull with delayed loadings
	if (!ATloadVar.V || ATloadVar.trt) return;
	ATloadVar.trt++;
	ATloadVar.cto=clearTimeout(ATloadVar.cto);
	for (var i=ATloadVar.V.length-1;i>=0;i--) {
		if (ATloadVar.V[i].free) {ATloadVar.V.splice(i,1);}
		}
	ATloadVar.trt--;
}

//***********************************************
function ATloadScript(urlsOrJs,callbacks,docs){
//	if URL: don't load twice, Case/Path not relevant..
	if (!urlsOrJs) return;
	if (ATisArray(urlsOrJs)) {
		for (var i=0, b=ATisArray(callbacks), d=ATisArray(docs); i<urlsOrJs.length; i++) {
			ATloadScript(urlsOrJs[i], (b?callbacks[i]:callbacks), (d?docs[i]:docs));
			}
		return;
		}
	var k,Sx, d=docs||document, S = d.createElement('script');
	S.type = 'text/javascript';
	S.async=true;
	if (urlsOrJs.indexOf('\n')<0 && urlsOrJs.search(/\([^)]*\)[^{]*\{[^}]*\}/)<0) {
		var U=urlsOrJs.substr(urlsOrJs.lastIndexOf('/')+1).toLowerCase();
		// Is it here ?
		if ((Sx=ATloadScript.Sx) && (i=Sx.U.indexOf(U))>=0 && Sx.d[i]===d) {
			if (Sx.l[i]) ATfnExec(callbacks); // loaded
			else {
				if (Sx.E[i]) Sx.E[i].push(callbacks);
				else Sx.E[i]=[callbacks];
				}
			return;
			}
		if (Sx) {k=Sx.U.length; Sx.U.push(U); Sx.d.push(d);}
		else {k=0; Sx=(ATloadScript.Sx={U:[U],d:[d],l:[],E:[]});}
		// in <scripts> ?
		for (var i=0, Ss=$Xtag('script',d), src; i<Ss.length; i++) {
			if ((src=Ss[i].src) && src.substr(src.length-U.length).toLowerCase()===U) {
				Sx.l[k]=!0;
				ATfnExec(callbacks);
				return;
				}
			}
		var F=function(){
			ATfnExec(callbacks);
			$Xtag('head',d)[0].removeChild(S);
			ATloadScript.Sx.l[k]=!0;
			ATfnExec(ATloadScript.Sx.E[k]);
		}
		S.src = urlsOrJs;
		if (S.readyState){ //IE
			S.onreadystatechange=function(){
				if (S.readyState==='loaded' || S.readyState==='complete'){
					S.onreadystatechange = null;
					F();
					}
				};
			}
		else { //Not Ie
			S.onload=F;
			}
		$Xtag('head',d)[0].appendChild(S);
		}
	else {
		S.innerHTML=urlsOrJs;
		$Xtag('head',d)[0].appendChild(S);
		ATfnExec(callbacks);
		ATdelObj(S);
		}
}
//***********************************************
function ATloadCss(urlsOrCss,Force,doc){ // '{..}' return new classname
	if(!urlsOrCss) return;
	if (ATisArray(urlsOrCss)==='Array') {
		for (var i=0; i<urlsOrCss.length; i++) {
			ATloadCss(urlsOrCss[i],Force,doc);
			}
		return;
		}
	var css, d=doc||document;
	if (urlsOrCss.search(/\{[^:]+:[^}]*\}/)>=0){
		if (!Force && (i=(css=$Xtag('head',d)[0].innerHTML).lastIndexOf(urlsOrCss))>=0) {
			return ((css||'').substr(0,i).match(/\.(Css[a-z0-9]+)/g)||[''])[0].substr(1)||true;
			}
		var cssName;
		if (urlsOrCss.search(/^\s*\{/)===0) {
			cssName='Css'+ ATshortUID(16);
			urlsOrCss='.'+cssName+urlsOrCss;
			}
		css=d.createElement("style");
		css.setAttribute('type','text/css');
		css.setAttribute('rel','stylesheet');
		if (ATiNav.isIE789===100) {
			$Xtag('head',d)[0].appendChild(css);
			css.appendChild(d.createTextNode(urlsOrCss));
			}
		else {
			if (css.styleSheet){
				css.styleSheet.cssText=urlsOrCss;
				}
			else {
				css.innerHTML=urlsOrCss;
				}
			$Xtag('head',d)[0].appendChild(css);
			}
		if (cssName) return cssName;
		}
	else {
		if (!Force && $Xtag('head',d)[0].innerHTML.indexOf('href="'+urlsOrCss+'"')>=0) {
			return;
			}
		css=d.createElement('link');
		css.rel='stylesheet';
		css.type='text/css';
		css.href=urlsOrCss;
		$Xtag('head',d)[0].appendChild(css);
		}
	return css;
}
//***********************************************
function ATloadBuf(urls,loadDelayMs,Force) {
	if(!urls) return;
	if (loadDelayMs) {
		if (+loadDelayMs > 0) {
			ATaddEvent(window,'load',function(){setTimeout(function() {ATloadBuf(urls,0,Force);}, +loadDelayMs);});
			}
		else {
			ATaddEvent(window,'load',function(){ATloadBuf(urls,0,Force);});
			}
		return;
		}
	var u, st='', rI=/\.gif|\.jp|\.png|\.webp|\.svg/i, rD=/\.htm|\.asp|\.php|\.txt|\.xml|\.js|\.css/i,
		c='<img width="1px" height="1px" onload="var o=this.parentNode;ATdelObj(this);if(!ATfirstChildObject(o)){ATdelObj(o);}" onerror="this.onload();" src="';
	if (ATisArray(urls)) {
		for (var i=0; i<urls.length; i++) {
			if (!(u=urls[i])) continue;
			if (typeof u==='object') u=u.src||($Xqs('source',u)||{}).src||'';
			ATloadAs(u);
			if (u.search(rI)>0) st += c+u+'" />';
			else if (u.search(rD)>0) loadHttpX(u);
			}
		}
	else {
		u=urls; if (typeof u==='object') u=u.src||($Xqs('source',u)||{}).src||'';
		ATloadAs(u);
		if (u.search(rI)>0) st = c+u+'" />';
		else if (u.search(rD)>0) loadHttpX(u);
		}
	if (st) {
		st='<div style="position:absolute;left:-9999px;top:0;z-index:-1;visibility:hidden;">'+st+'</div>';
		if (!Force && document.body.innerHTML.indexOf(st)>=0) return;
		SetInnerHtmlObj(document.body,st,true);
		}
}
//***********************************************
function ATloadAs(urls,d,rel,as,xor) {
	if(!urls) return;
	if (ATisArray(urls)) {
		for (var i=0; i<urls.length; i++) {
			if (!ATloadAs(urls[i],d,rel,as,xor)) return !1;
			}
		return !0;
		}
	if(!d)d=document;
	if (typeof urls==='object') urls=urls.src||($Xqs('source',urls)||{}).src||'';
	var l=d.createElement('link'), e=urls.substr(urls.lastIndexOf('.')+1).toLowerCase();
	if (l.as===undefined) return !1;
	l.rel=rel || 'preload';
	l.as=as || (e==='js'?'script':(e==='css'?'style':
		('woff.ttf.otf'.indexOf(e)>=0?'font':
		('gif.jpeg.jpg.png.webp.svg'.indexOf(e)>=0?'image':
		('mpg.mpeg.mp4.webm.wmv.3gp.mov'.indexOf(e)>=0?'video':
		('mp3.wav.wma'.indexOf(e)>=0?'audio':
		('html.aspx.php.txt.xml'.indexOf(e)>=0?'document':
		'fetch')))))));
	l.href=urls;
	l.crossorigin=xor || 'anonymous';
	$Xtag('head',d)[0].appendChild(l);
	return !0;
}

//***********************************************
function ATasyncFormSubmit(XForm,submitKeyVal,callback,CursorWait,callbackerror,me) {
	XForm=ATformObject(XForm);
	if (!XForm || (!me && XForm.onsubmit && XForm.onsubmit()===false)) return;
	// Methode avec FormData a 3 pbs: utf8 pas reglable, datas rajoutees non lisibles IIS/ASP, ie<10
	var mfd=!!((XForm.method||'').search(/POST/i)>=0 && (XForm.enctype||'').search(/multipart\/form-data/i)>=0),
		ec=((mfd||me)?function(st){
			for(var i=0,l=st.length,stx='',c; i<l; i++) {
				c=st.charCodeAt(i); stx+=c>255?'&#'+c+';':st.charAt(i);
			} return encodeURIComponent(stx);}
			:(document.characterSet||document.charset).search(/windows|8859/i)>=0?encodeURIComponent8859:encodeURIComponent);
	var XK=['INPUT','SELECT','TEXTAREA'], fData='';
	for (var k=0; k < 3; k++) {
		for (var i=0,os=$Xtag(XK[k],XForm); i<os.length; i++) {
			if (k || 'buttonimageresetsubmit'.indexOf(os[i].type)<0 && os[i].name){
				if (k===1 && os[i].multiple) {
					var eon=ec(os[i].name);
					for (var o=0, l=os[i].options.length; o<l; o++) {
						if (os[i].options[o].selected) fData+='&'+eon+'='+ec(os[i].options[o].value);
						}
					}
				else { // Textarea: normalize \n (cf w3c)
					if (k!==0 || (os[i].type!=='checkbox' && os[i].type!=='radio') || os[i].checked) {
						if (os[i].value!=undefined) fData+='&'+ec(os[i].name)+'='+ec(k==2?os[i].value.replace(/([^\r])\n/g,'$1\r\n'):os[i].value);
						}
					}
				}
			}
		}
	if (submitKeyVal) {
		if (typeof submitKeyVal!=='string') submitKeyVal=submitKeyVal.name||submitKeyVal.id;
		if (submitKeyVal.indexOf('=')<0) {
			submitKeyVal=submitKeyVal==='*'?$Xqs('input[type=submit]',XForm):$Xelt(submitKeyVal,XForm);
			if (submitKeyVal && (submitKeyVal.name||submitKeyVal.id)) fData+='&'+submitKeyVal.name+'='+ec(submitKeyVal.value||submitKeyVal.name||submitKeyVal.id);
			}
		else {
			fData+='&'+submitKeyVal;
			}
		}
	if (me) return fData;
	var a=XForm.action;
	if ((XForm.method||'').search(/POST/i)>=0) {
		loadHttpX(a+(a.indexOf('?')<0?'?'+fData.substr(1).replace('%20','+'):'&?'+fData.substr(1)),callback,CursorWait,'POST',callbackerror,'',(mfd?(XForm.enctype):''));
		}
	else {
		var i=a.indexOf('#'),E=i<0?'':a.substr(i);
		if (i>=0) a=a.substr(0,i);
		loadHttpX((a.indexOf('?')<0?a+'?':'&')+fData.substr(1).replace('%20','+')+E,callback,CursorWait,XForm.method.toUpperCase(),callbackerror);
		}
}
//***********************************************
function LocationPost(url) {
	if (!url) return;
	var F='AT~0';
	while ($Xname(F)[0]) {F+='x';}
	var U=url.split('#',2),
		st=U[0].split((U[0].indexOf('&?')>0?'&?':'?'),2),
		stx='<form name="'+F+'" method=POST action="'+st[0]+(U[1]?'#'+U[1]:'')+'" style="display:none;">';
	if (st[1]) {
		for (var i=0, stw=st[1].split('&'); i<stw.length; i++) {
			stx += '<input type=hidden name="'+stw[i].replace(/"/g,'%22').replace(/=/,'" value="')+'" />';
			}
		}
	SetInnerHtmlObj(document.body,stx+'</form>',true);
	try{
		document.forms[F].submit();
		}catch(e){ATLog(['Pb Submit !',e]);}
	ATdelObj(document.forms[F]);
}


//***********************************************
function SetInnerHtmlObj(O, xH, doAppend) {
	if(O===null || typeof O!=='object') return false;
	if(xH==null) {xH='';}
	else if (typeof xH==='object') {
		xH=xH.tagName?xH.outerHTML:JSON.stringify(xH);
		}
	else if (typeof xH!=='string') {xH=''+xH;}
	if (O.tagName==='TEXTAREA') {
		if (doAppend) O.value += xH; else O.value=xH;
		return;
		}
	if (!document.createRange) { // IE < 9
		// Rajouter "Defer" sur les balises scripts, et <br/> cache devant <style ou autres <link ?!
		// xH=xH.replace(/[<]/g,'\r\n<');
		xH=xH.replace(/<style/gi,'\r\n<div style="display:none"><br/></div><style').replace(/<link\s/gi,'\r\n<div style="display:none"><br/></div><link ').replace(/<script\s/gi,'<div style="display:none"><br/></div><'+'script defer="defer" ')+'\r\n';
		try {// PB innerHTML avec table,tbody,thead,tfoot..
			if (doAppend) xH=O.innerHTML+'\r\n'+xH;
			if (' SELECT TABLE TBODY THEAD TFOOT '.indexOf(' '+O.tagName+' ')>=0) {
				var sti=O.innerHTML, sto=O.outerHTML.replace(sti,'');
				if (O.tagName==='SELECT') O.outerHTML=sto.replace(/<\/select/i,xH+'</select');
				else if (O.tagName==='TABLE') O.outerHTML=sto.replace(/<\/table/i,xH+'</table');
				else { // tbody, thead(?!), tfoot
					xH=O.tagName==='TBODY'?sto.replace(/<\/tbody/i,xH+'</tbody'):
						(O.tagName==='THEAD'?sto.replace(/<\/thead/i,xH+'</thead'):
						sto.replace(/<\/tfoot/i,xH+'</tfoot')
						);
					for (var oP=O.parentNode;oP&&oP.tagName!=='TABLE';oP=oP.parentNode){}
					ATdelObj(O);
					oP.outerHTML=oP.outerHTML.replace(/<\/table/i,xH+'</table');
					}
				}
			else {
				if (O.tagName!=='TR') O.innerHTML='';
				O.innerHTML=xH;
				}
		}catch(e) { // Erreur IE -> innerText ? (textarea par ex.)
			if (doAppend) O.innerText += xH;
			else O.innerText=xH;
			}
		// O.innerHTML=O.innerHTML;
		return;
		}
	// IE>=9 et autres
	var TScript=[];
	if (ATiNav.isIE789===100) { // Verification des balises script !!! BUG WEBKIT Chrome+Safari et PB UL/LI
		if (doAppend && ' UL OL DL '.indexOf(' '+O.tagName+' ')>=0) {
			return SetInnerHtmlObj(O,O.innerHTML+xH,false);
			}
		for (;;) {
			var i=xH.search(/<script/i);
			if (i<0) break;
			var i1=xH.indexOf('>',i),
			j=xH.search(/<\/script/i),
			j1=xH.indexOf('>',j);
			TScript.push([xH.substring(i1+1,j),
						(xH.substring(i,i1).match(/type=['"]?([^'"]*)/i)||{})[1],
						(xH.substring(i,i1).match(/id=['"]?([^'"]*)/i)||{})[1]]);
			xH = xH.substring(0,i) + xH.substring(j1+1);
			}
		}
	if (O.tagName==='TR' && !doAppend) {
		O.innerHTML=xH;
		}
	else {
		if (!doAppend) {
			while (O.hasChildNodes())
				O.removeChild(O.lastChild);
			}
		if (' TABLE TBODY THEAD TFOOT '.indexOf(' '+O.tagName+' ')>=0) {
			try{O.innerHTML += xH;}catch(e){
				// Pb IE9: faire avec outerHTML du table
				xH = O.innerHTML + '\r\n'+ xH;
				var sti=O.innerHTML, sto=O.outerHTML.replace(sti,'');
				if (O.tagName==='TABLE') {
					O.outerHTML=sto.replace(/<\/table/i,xH+'</table');
					}
				else { // beurk thead
					xH=O.tagName==='TBODY'? sto.replace(/<\/tbody/i,xH+'</tbody') :
						(O.tagName==='THEAD'? sto.replace(/<\/thead/i,xH+'</thead') :
						sto.replace(/<\/tfoot/i,xH+'</tfoot')
						);
					for (var oP=O.parentNode;oP&&oP.tagName!=='TABLE';oP=oP.parentNode){}
					ATdelObj(O);
					oP.outerHTML=oP.outerHTML.replace(/<\/table/i,xH+'</table');
					}
				}
			}
		else {
			var rng = O.ownerDocument? O.ownerDocument.createRange() : document.createRange();
			if (rng.createContextualFragment) { // Tout sauf IE9
				try{rng.setStartBefore(O);}catch(e){}
				var htmlFrag = rng.createContextualFragment(xH);
				O.appendChild(htmlFrag);
				}
			else { // IE9
				if (O.tagName==='SELECT') { // TOUJOURS LE PB AVEC IE 9 !!!
					var sto=O.outerHTML;
					O.outerHTML=sto.replace(/<\/select/i,xH+'</select');
					}
				else {
					O.insertAdjacentHTML("beforeend", xH);
					}
				}
			}
		}
	for (var i=0; i<TScript.length; i++) {
		var stS = document.createElement('script');
		stS.type=TScript[i][1]||'text/javascript';
		if (TScript[i][2]) stS.id=TScript[i][2];
		if (stS.type.search(/javascript/i)>=0) {
			stS.async=true;
			stS.innerHTML='//<!--\r\n'+TScript[i][0]+'\r\n//-->';
			}
		else {stS.innerHTML=TScript[i][0];}
		O.appendChild(stS);
		}
}

//***********************************************
function SetInnerHtml(ObXs, xH, doAppend) {
	if (!ObXs) return;
	if(typeof ObXs==='string') {
		var o=$Xid(ObXs);
		if (o) return SetInnerHtmlObj(o, xH, doAppend);
		o=$Xname(ObXs);
		ObXs=(o&&o.length)?o:$Xqsa(ObXs);
		}
	if (ObXs){
		if (ATisArray(ObXs)) {
			for (var i=0; i<ObXs.length; i++) {
				if (typeof ObXs[i]==='string') {SetInnerHtml(ObXs[i], xH, doAppend);}
				else {SetInnerHtmlObj(ObXs[i], xH, doAppend);}
				}
			return;
			}
		else {
			SetInnerHtmlObj(ObXs, xH, doAppend);
			}
		}
}

//***********************************************
function LoadInnerHtml(ObXs, url, callAfter, CursorWait, doAppend) {
	if(typeof ObXs==='string' && !$Xelts(ObXs)) return;
	loadHttpX(url,function(req){
				SetInnerHtml(ObXs,req.responseText,doAppend);
				ATfnExec(callAfter);
				},CursorWait);
}

//***********************************************
function LoadDivSrc(Tagsname, CursorWait, obxSrc, iLevel) {
	iLevel = (iLevel || 0) +1;
	if (iLevel > 10) return; // Secu sur profondeur
	if (!obxSrc) obxSrc=document;
	var XTags = ((!Tagsname || Tagsname==='*')?'IDIV DIV SPAN' : Tagsname).split(' ');
	for (var k=0; k < XTags.length; k++) {
		if (XTags[k]) {
			var ox=$Xtag(XTags[k]);
			if (ox.length) {
				for (var i=0; i<ox.length;i++) {
					var st=ox[i].getAttribute('src')||ox[i].getAttribute('data-src');
					if (st) {LoadInnerHtml(ox[i],st,function(){LoadDivSrc(Tagsname,CursorWait,ox[i],iLevel);},CursorWait,false);}
					}
				}
			}
		}
}

//***********************************************
function InsertHtmlBefore(ObXs, xH, xHsel) {
/*	Insert xH before all ObXs.
	IF xHsel: xHsel=selector for xH (id recommended)
	Table, Select, UL !OK!: xHsel MUST be id of xH IF ALREADY present
	Return object(s)
*/
	if (!ObXs || xH==null) return;
	if(typeof ObXs==='string') return InsertHtmlBefore($Xelts(ObXs),xH);
	if (ATisArray(ObXs)) {
		for (var i=0, R=[]; i<ObXs.length; i++) {R.push(InsertHtmlBefore(ObXs[i],xH));}
		return R;
		}
	var p=ObXs.parentNode;
	if (!p) return;
	var o, bs=!!xHsel;
	if (!bs) {
		for (var i=0, nx='xIHB_'; $Xid(nx+i);i++);
		xHsel=nx+i;
		}
	switch(typeof xH) {
		case'number':case'bigint':xH=''+sH; break;
		case'object':if(!xH.tagName){xH=JSON.stringify(xH);}break;
		}
	if (' TABLE THEAD TBODY TFOOT UL OL DL SELECT '.indexOf(' '+p.tagName+' ')>=0) {
		for (var i=0, k=-1, cx=p.childNodes, l=cx.length; i<l; i++) {
			if (cx[i]===ObXs) {k=i; break;}
			}
		var T=p.tagName;
		if (T.charAt(0)!=='T') {
			T=(T==='UL'||T==='OL')?'LI':(T==='DL'?'DT':'OPTION');
			if (typeof xH==='object') {
				if (xH.tagName!==T) {xH='<'+T+' id="'+xHsel+'">'+xH.outerHTML+'</'+T+'>';}
				else if (!xH.id) xH.setAttribute('id',xHsel); // else xHsel=xH.id !
				}
			else {
				if (xH.substr(0,T.length+1).toUpperCase()!=='<'+T) {
					xH='<'+T+' id="'+xHsel+'">'+xH+'</'+T+'>';
					}
				else {
					i=xH.indexOf('>');
					if (xH.substr(0,i).search(/\sid\s*=/i)<0) xH=xH.substr(0,i)+' id="'+xHsel+'"'+xH.substr(i);
					}
				}
			}
		else {
			if (typeof xH==='object' && xH.tagName!=='TR') {
				i=0; ATforEach(ObXs.children,function(e){i+=e.colSpan||0;});
				xH='<TR id="'+xHsel+'"><TD colspan='+(i||1)+'>'+xH.outerHTML+'</TD></TR>';
				}
			else {
				if (typeof xH==='string') {
					if (xH.substr(0,3).toUpperCase()!=='<TR') {
						i=0; ATforEach(ObXs.children,function(e){i+=e.colSpan||0;});
						xH='<TR id="'+xHsel+'"><TD colspan='+(i||1)+'>'+xH+'</TD></TR>';
						}
					else {
						i=xH.indexOf('>');
						if (xH.substr(0,i).search(/\sid\s*=/i)<0) xH=xH.substr(0,i)+' id="'+xHsel+'"'+xH.substr(i);
						}
					}
				else {
					if (!xH.id) xH.setAttribute('id',xHsel); // else xHsel=xH.id !
					}
				}
			}
		p.insertAdjacentHTML('beforeend',xH);
		// SetInnerHtmlObj(p,xH,true);
		o=$Xelt(xHsel);
		cx=p.childNodes; l=cx.length;
		if (k<0) {
			for (var i=0, h=ObXs.innerHTML; i<l; i++) {
				if (h===cx[i].innerHTML) {ObXs=cx[i]; break;}
				}
			}
		else {
			ObXs=cx[k];
			}
		try {var r=p.insertBefore(o,ObXs);}catch(e){ATLog(['Pb Insert !',e]);}
		if (r && o!==r) ATdelObj(o);
		return r;
		}
	else {
		if (typeof xH !== 'object') {
			//if (!bs) xHsel=xHsel.replace(/[.,;:!*^#'"\[\]\s]/g,'_');
			SetInnerHtmlObj(p, (bs? xH : ('<div id="'+xHsel+'" style="display:none;">'+xH+'</div>')), true);
			o=$Xelt(xHsel);
			if (o) {
				try {var r=p.insertBefore(o,ObXs);}catch(e){ATLog(['Pb Insert !',e]);}
				if (r && !bs) r.style.display='inline';
				return r;
				}
			else {ATdelObj(xHsel);}
			}
		else {
			if (xH.tagName) { // xHsel don't care
				try {return p.insertBefore(xH,ObXs);}catch(e){return InsertHtmlBefore(ObXs,xH.outerHTML);};
				}
			}
		}
}

//***********************************************
function getViewportHeight(NoScrollBars) {
	return NoScrollBars ? document.documentElement.clientHeight:
	(window.innerHeight!==undefined ? innerHeight: // IE retourne ascenseurs !
	(document.compatMode=='CSS1Compat' ? document.documentElement.clientHeight:
	(document.body ? document.body.clientHeight : 0)));
}
function getViewportWidth(NoScrollBars) {
	return NoScrollBars ? document.documentElement.clientWidth:
	(window.innerWidth!==undefined ? innerWidth: // IE retourne ascenseurs !
	(document.compatMode=='CSS1Compat' ? document.documentElement.clientWidth:
	(document.body ? document.body.clientWidth : 0)));
}
function getScrollTop(o) {
	if (typeof o==='string')o=$Xelt(o);
	return o ? o.scrollTop:
	(self.pageYOffset ? self.pageYOffset:// all but IE
	(document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop:// IE
	(document.body ? document.body.scrollTop : 0)));// IEs
}
function getScrollLeft(o) {
	if (typeof o==='string')o=$Xelt(o);
	return o ? o.scrollLeft:
	(self.pageXOffset ? self.pageXOffset:// all but IE
	(document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft:// IE
	(document.body ? document.body.scrollLeft : 0)));// IEs
}
function getScrollWidth(o){
	return ((typeof o==='string' ? $Xelt(o):o) || document.body).scrollWidth;
}
function getScrollHeight(o){
	return ((typeof o==='string' ? $Xelt(o):o) || document.body).scrollHeight;
}
function getObjXPos(ObX,iWH,iScrl) {
//	Retourne tableau left,top[,width,height] si WHToo cas particulier avec -1
	var o=typeof ObX==='string'? $Xid(ObX)||$Xname(ObX)[0]||$Xqs(ObX):ObX;
	if (!o) return[];
	var curPos=[0,0,-1,-1];
	if (iWH) {
		curPos[2] = o.offsetWidth; curPos[3] = o.offsetHeight;
		if(iWH===-1) return curPos;
		}
	do {
		if (iScrl){
			curPos[0] += o.offsetLeft-o.scrollLeft;
			curPos[1] += o.offsetTop-o.scrollTop;
			}
		else{
			curPos[0] += o.offsetLeft;
			curPos[1] += o.offsetTop;
			}
		} while ((o = o.offsetParent));
	return curPos;
}

//***********************************************

// Tout ca peut etre redefini (ATalert par ex).
function CloseWindow() {
	try {
		(window.opener||top).focus();
		} catch(e) {}
	window.opener=window; window.close();
}

function OpenWindow(stW,stNameNew,W,H,x,y) {
// Idem ..Name Return void
	OpenWindowName(stW,stNameNew,W,H,x,y);
}

function OpenWindowName(stW,stNameNew,W,H,x,y) {
	try {
	var w,stN,P,i=stW.indexOf('#'),E=i<0?'':stW.substr(i);
	if (i>=0) stW=stW.substr(0,i);
	if (window.DoAffLoading) AffLoading();
	stN=(stNameNew===true?'':(stNameNew||'KSubWin'));
	P=ATiNav.localStorage?JSON.parse(localStorage.getItem(window.AppId+'_W_'+stN)):0;
	if (!P) P=[x>=0?x:(((window.screenLeft!=null?screenLeft:window.screenX)+16)||-1),y>=0?y:(((window.screenTop!=null?screenTop:window.screenY)+16)||-1),W||760,H||500];
	w=window.open(stW?(stW + (stW.search(/\?W=|&W=/i)>=0?'':(stW.indexOf('?')<0? '?W=1':'&W=1')) + E):'', stN,
	'resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar='+(stN?'yes':'no')+',menubar='+(window.ATnavMenuBar||'no')+',directories=no,location=no'+
	(P[0]<0?'':(',left='+P[0]))+(P[1]<0?'':(',top='+P[1]))+',width='+P[2]+',height='+P[3]);
	if (window.DoAffLoading) {if (w && stW) ATaddEvent(w,'load', HideLoading); else HideLoading();}
	// if (window.DoAffLoading) ATaddEvent(w,'load',function() {ATLog('Ok');});
	w.focus();
	} catch(e) {if (window.DoAffLoading)HideLoading();}
	return w;
}

function OpenWindowTab(stW,SubWindow,XReload){
	try {
	var w,st=(!SubWindow || stW.search(/\?W=|&W=/i)>=0)?'':(stW.indexOf('?')<0 ? '?W=1':'&W=1'),
		i=stW.indexOf('#'),E=i<0?'':stW.substr(i);
	if (i>=0) stW=stW.substr(0,i);
	// Pb WebViews
	try {w=window.open(stW+st+E,'_blank');} catch(e) {}
	if (!w && !XReload) return SetInnerHtml(document.body,'<div style="position:absolute;left:'+
			(getScrollLeft()+0.5*getViewportWidth()-100)+'px;top:'+
			(getScrollTop()+0.5*getViewportHeight()-75)+';width:200px;height:150px;z-index:99999;border:1px solid #444;background-color:white;opacity:0.8;"><center>(Popups !)</center><input type="button" class="inputSubmit" style="position:relative;left:70px;top:70px;" onclick="OpenWindowTab(\''+stW+st+E+'\',false,true);ATdelObj(this.parentNode);" value="Click..." /></div>',
			true);
	if (stW.search(/mailto:/i)===0)	setTimeout(function(){
			try {w.close();} catch(e) {
				ATLog('Pb w.close ! ('+w+') '+e);
				}
			},600);
	} catch(e) {}
	return w;
}

function ConfDel(stNomItem){
	return confirm(GetCaseLangue('Destruction irreversible de '+(stNomItem? stNomItem : 'l\'item'),'Delete '+(stNomItem? stNomItem : 'the item')+', no way back') + ' ?');
}

//***********************************************
function SendNotification(title,opts,fclick) {
	if (!window.Notification) {
		if (ATalert){ATalert(opts.body||title,title);}else{alert(title+'\r\n'+opts.body);}
		}
	else if (Notification.permission==='granted') {
		if (opts.actions && opts.actions.length) opts.actions=undefined; // Pb SW
		/*if (opts.actions && opts.actions.length && window.ServiceWorker && window.ATUtilsSWVersion) {
			Envoyer le message SendNotification(title,opts,fclick);
			}
		else {*/
			var notification = new Notification(title,opts);
			if (fclick) ATaddEvent(notification,'click',fclick);
		//	}
		}
	else if (Notification.permission!=='denied') {
		Notification.requestPermission(function (permission) {
			if(!('permission' in Notification)) {
				Notification.permission = permission;
				}
			if (permission==='granted') SendNotification(title,opts,fclick);
		});
	}
}
//***********************************************
if (window.Storage) {
	Storage.prototype.set=function(k,o){this.setItem(k,JSON.stringify(o));};
	Storage.prototype.get=function(k){try{return JSON.parse(this.getItem(k));}catch(e){return this.getItem(k);}};
	Storage.prototype.findKeys=function(pat,patIsString) {//patIsString:true, */^,=,$
		if (patIsString) {var p=''+patIsString; pat=new RegExp(((p==='^'||p==='*'||p==='=')?'^':'')+EscRegExp(pat)+((p==='='||p==='$')?'$':''));}
		for (var i=0, st=[]; i<this.length; i++) {
			if (!pat || pat==='*' || this.key(i).match(pat)) st.push(this.key(i));
			}
		return st;
		};
}
function setStorageCookieApp(name, value, App) {
	var a=(App==null?window.AppId||'':App)+name;
	if(ATiNav.localStorage){localStorage.setItem(a,value);return;}
	setCookie(a, value, 3652);
}
function getStorageCookieApp(name, vdef, App) {
	var a=(App==null?window.AppId||'':App)+name,
		l=ATiNav.localStorage,
		v=l?l.getItem(a):getCookie(a);
	if (v==null){
		if (l) v=getCookie(a);
		if (v===undefined) v=vdef;
		}
	return v;
}
function delStorageCookieApp(name, App) {
	var a=(App==null?window.AppId||'':App)+name;
	if(ATiNav.localStorage) localStorage.removeItem(a);
	deleteCookie(a);
}

function setCookie(name, value, expires, path, domain, Xsecure, SameSite) {
	if (expires) {
		if (expires==-1) {
			expires=new Date();
			expires.setDate(expires.getDate() + 365);
			}
		else if ((typeof expires==='string' && (expires.indexOf('+')>=0||expires[0]=='-')) || typeof expires==='number') {
			var exd=new Date();
			exd.setDate(exd.getDate() + (+expires));
			expires=exd;
			}
		}
	if (!SameSite && setCookie.BadSameSite===undefined) {
		var ua=navigator.userAgent;
		setCookie.BadSameSite=ua.indexOf('iPhone OS 12_')>=0 || ua.indexOf('iPad; CPU OS 12_')>=0 ||
			ua.indexOf('Chrome/5')>=0 || ua.indexOf('Chrome/6')>=0 ||
			(ua.indexOf(' OS X 10_14_')>=0 && ua.indexOf('Version/')>=0 && ua.indexOf('Safari')>=0);
		}
	document.cookie = name + '=' + encodeURIComponent(value) +
			(expires? '; expires=' + expires.toGMTString() : '') +
			(path? '; path=' + path : '') +
			(domain? '; domain=' + domain : '') +
			(SameSite? '; SameSite=' + SameSite : (setCookie.BadSameSite? '': '; SameSite=None' )) +
			(Xsecure? (typeof Xsecure==='string'? '; '+Xsecure : '; secure') : (document.location.protocol==='https:'? '; secure' :''));
}

function getCookie(name) {
	try {var c=(document.cookie.match(new RegExp('\\b'+EscRegExp(name)+'=([^;]*)'))||[])[1]; return (c===undefined?c:decodeURIComponent(c));}catch(e){}
}

function deleteCookie(name, path, domain) {
	if (getCookie(name)) {
		document.cookie = name + '=' +
			(path? '; path=' + path : '') +
			(domain? '; domain=' + domain : '') +
			'; expires=Thu, 01-Jan-70 00:00:01 GMT';
	}
}

//***********************************************
function setCookiePos() {
	var st=document.title?document.title+'_':'';
	if (st.indexOf('[127.0.0.1] ')===0) st=st.substring(st.indexOf(' ')+1);
	var i=st.indexOf('#'); if (i>0){st=st.substring(0,i);}
	st=XTrim(st.replace(/ /g,'_'));
	var w=window.outerWidth||window.innerWidth,
		h=window.outerHeight||window.innerHeight,
		x,y;
	if(window.screenTop!=null){x=screenLeft;y=screenTop;}
	else{w=window.screenX||0;y=window.screenY||0;}
	if (ATiNav.localStorage){
		var T='['+x+','+y+','+w+','+h+','+Math.floor((new Date()).getTime()/36e5)+']';
		localStorage.setItem(window.AppId+'_W-'+st, T);
		if (window.name) localStorage.setItem(window.AppId+'_W_'+window.name, T);
		}
	else {
		setCookie(st+'X',x||0,-1,'','','');setCookie(st+'Y',y||0,-1,'','','');
		setCookie(st+'W',w||0,-1,'','','');setCookie(st+'H',h||0,-1,'','','');
		}
}

function getCookiePos() {
	var T,w,h,x,y,st=document.title?document.title+'_':'';
	if (st.indexOf('[127.0.0.1] ')===0) st=st.substring(st.indexOf(' ')+1);
	var i=st.indexOf('#');if (i>0){st=st.substring(0,i);}
	st=XTrim(st.replace(/ /g,'_'));
	if (ATiNav.localStorage){
		T=ATjsonParse(localStorage.getItem(window.AppId+'_W-'+st));
		if(T&&T.length){x=T[0];y=T[1];w=T[2];h=T[3];}
		}
	if(!w)w=getCookie(st+'W')>>>0;
	if(!h)h=getCookie(st+'H')>>>0;
	if (w && h) window.resizeTo(w,h);

	if(x===undefined)x=getCookie(st+'X');
	if(y===undefined)y=getCookie(st+'Y');
	if (x!==undefined||y!==undefined) {
		x>>>=0;y>>>=0;
		if(window.screenTop!=null) {screenLeft=x;screenTop=y;}
		else{window.screenX=x;window.screenY=y;}
		}
}

//***********************************************
function XDoModField(xObjSrc, xObjDest, iVal, FormSubmit) {
	if (typeof xObjDest==='string') xObjDest=$Xelt(xObjDest);
	var i=(+xObjDest.value)||0;
	if (typeof xObjSrc==='string') xObjSrc=$Xelt(xObjSrc);
	if (iVal===undefined) iVal=+xObjSrc.value;
	if (typeof iVal==='string') {iVal=+iVal;}
	if (iVal===undefined || isNaN(iVal)) {iVal=+((xObjSrc.id||xObjSrc.name).replace(/[^0-9]*/g,''));}
	if (!iVal) return;
	if (xObjSrc.checked) {
		if ((i & iVal)===0) xObjDest.value = i+iVal;
		}
	else {
		if (i & iVal) xObjDest.value = i-iVal;
		}
	if (FormSubmit||FormSubmit===0) {document.forms[FormSubmit].submit();}
}

function MontreCache(Button_Ox, ObXs, UseVisibility, FuncVis, FuncHid, FuncsForEach) {
	if (!ObXs) return;
	if(typeof ObXs==='string') return MontreCache(Button_Ox, $Xelts(ObXs), UseVisibility, FuncVis, FuncHid, FuncsForEach);
	if (ATisArray(ObXs)) {
		for (var i=ObXs.length-1; i>=0; i--) {
			if (i!==0) {
				if (FuncsForEach) {MontreCache(null, ObXs[i],UseVisibility, FuncVis, FuncHid);}
				else {MontreCache(null, ObXs[i],UseVisibility);}
				}
			else {MontreCache(Button_Ox, ObXs[i], UseVisibility, FuncVis, FuncHid);}
			}
		return;
		}
	var Vis=0, XObjBut=typeof Button_Ox==='string'?$Xelt(Button_Ox):Button_Ox;
	if (UseVisibility) {
		if (ObXs.style.visibility=='hidden') {
			if (XObjBut) XObjBut.value='-';
			ObXs.style.visibility='visible';
			Vis=1;
			}
		else {
			if (XObjBut) XObjBut.value='+';
			ObXs.style.visibility='hidden';
			Vis=2;
			}
		}
	else {
		if (ObXs.style.display=='none') {
			if (XObjBut) XObjBut.value='-';
			ObXs.style.display=ObXs.getAttribute('data-display') || '';
			Vis=1;
			}
		else {
			if (XObjBut) XObjBut.value='+';
			ObXs.style.display='none';
			Vis=2;
			}
		}
	try {
		if (XObjBut.name && $Xname(XObjBut.name+'_val')[0]) $Xname(XObjBut.name+'_val')[0].value=(Vis==2?-1:(Vis==1?1:0));
		if (Vis==2 && FuncHid) {
			if (typeof FuncHid==='string') {
				if (FuncHid==='*') {Vis=1;}
				else {eval(FuncHid);}
				}
			else FuncHid();
			}
		if (Vis==1 && FuncVis) {
			if (typeof FuncVis==='string'){eval(FuncVis);} else {FuncVis();}
			}
	}catch(e){}
}


//***********************************************
function ATDelObj(ObXs) {ATdelObj(ObXs);}
function ATdelObject(ObXs) {ATdelObj(ObXs);}
function ATdelObj(ObXs) {
	if (!ObXs) return;
	if(typeof ObXs==='string') return ATdelObj($Xelts(ObXs));
	if (ATisArray(ObXs)) {
		for (var i=ObXs.length-1; i>=0; i--) {ATdelObj(ObXs[i]);}
		return;
		}
	var ob=ObXs.parentNode;
	if (ob) {
		ob.removeChild(ObXs);
		}
	else {
		if (ObXs.hasChildNodes) SetInnerHtmlObj(ObXs, '', false);
		}
	if (ObXs) {
		try {
			if (typeof ObXs.outerHTML!=='undefined' && ObXs.parentNode) ObXs.outerHTML='';
			} catch(e){}
		}
}
//***********************************************
function ATnextObject(n) {
	try{
		if (typeof n==='string') n=$Xelt(n);
		if (!n) return;
		do n = n.nextSibling;
		while (n && n.nodeType != 1);
		return n;
	}catch(e){return null;}
}
//***********************************************
function ATpreviousObject(p) {
	try{
		if (typeof p==='string') p=$Xelt(p);
		if (!p) return;
		do p = p.previousSibling;
		while (p && p.nodeType != 1);
		return p;
	}catch(e){return null;}
}
//***********************************************
function ATparentObject(o) {
	if (typeof o==='string') o=$Xelt(o);
	return (o?o.parentNode:null);
}
//***********************************************
function ATfirstChildObject(c) {
	try{
		if (typeof c==='string') c=$Xelt(c);
		if (!c) return;
		c=c.firstChild;
		while (c && c.nodeType != 1) {c=c.nextSibling;}
		return c;
	}catch(e){return null;}
}
//***********************************************
function ATchildrenObjects(c) {
	if (typeof c==='string') c=$Xelt(c);
	if (!c || !c.firstChild) return [];
	var Tc=[];
	for (c=ATfirstChildObject(c); c; c=c.nextSibling) {
		if(c.nodeType==1)Tc[Tc.length]=c;
	}
	return Tc;
}
//***********************************************
function ATformObject(o) {
	if (!document.forms) return;
	if (typeof o==='string') o=o==='*'?document.forms[0]:document.forms[o]||$Xelt(o);
	if (typeof o==='number') o=document.forms[o];
	if (!o) return;
	for(;o && o.tagName!=='FORM';o=o.parentNode){}
	return o;
}

//***********************************************
function AThasClass(ObX, Cname){
	var o=typeof ObX==='string'?$Xelt(ObX):ObX;
	if (o) { // classList :-(
		return new RegExp('(\\s|^)'+EscRegExp(Cname).replace(/\s/g,'|')+'(\\s|$)').test(o.className);
		}
}
//***********************************************
function ATaddClass(ObXs, Cname, delay, duration, repeat){
//	Ex: ATaddClass('ObjectId',ATloadCss('{opacity:0}'),-1000,1000,5)
	if (!ObXs) return;
	if (delay>0) {setTimeout2(ATaddClass,delay,ObXs,Cname,-delay,duration,repeat);return;}
	if(typeof ObXs==='string') return ATaddClass(ObXs.indexOf(' ')>0?ObXs.split(' '):$Xelts(ObXs), Cname, delay, duration, repeat);
	if (ATisArray(ObXs)) {
		for (var i=0; i<ObXs.length; i++) {ATaddClass(ObXs[i],Cname, delay, duration, repeat);}
		return;
		}
	if (!AThasClass(ObXs, Cname)) {
		ObXs.className += (ObXs.className ? ' ' : '') + Cname;
		}
	else if (Cname.indexOf(' ')>=0) {
		var Cnx=Cname.split(' ');
		for (var i=0; i<Cnx.length; i++) {
			if (Cnx[i]!=='') {
				if (!AThasClass(ObXs, Cnx[i])) ObXs.className += (ObXs.className ? ' ' : '') + Cnx[i];
				}
			}
		}
	if (duration) {
		ATremoveClass(ObXs,Cname,duration);
		if (repeat>1) setTimeout2(ATaddClass,duration,ObXs,Cname,Math.abs(delay),duration,repeat-1);
		}
}
//***********************************************
function ATremoveClass(ObXs, Cname, delay, duration){
	if (!ObXs || !Cname) return;
	if (delay) {setTimeout2(ATremoveClass,delay,ObXs,Cname,0,duration);return;}
	if(typeof ObXs==='string') return ATremoveClass(ObXs.indexOf(' ')>0?ObXs.split(' '):$Xelts(ObXs), Cname, 0, duration);
	if (ATisArray(ObXs)) {
		for (var i=0; i<ObXs.length; i++) {ATremoveClass(ObXs[i],Cname, 0, duration);}
		return;
		}
	if (!ObXs.className) return;
	ObXs.className = ObXs.className.replace(new RegExp('(\\s|^)'+EscRegExp(Cname).replace(/\s/g,'|')+'(\\s|$)','g'),' ').replace(/^\s+|\s+$/g, '');
	if (duration) ATaddClass(ObXs,Cname,duration);
}
//***********************************************
function ATaddremoveClass(ObXs, Cname, add, delay,duration){
	if (add===undefined) return ATtoggleClass(ObXs, Cname, delay,duration);
	return (add?ATaddClass(ObXs, Cname, delay, duration):ATremoveClass(ObXs, Cname, delay, duration));
}
//***********************************************
function ATtoggleClass(ObXs, Cname, delay, duration){
	if (!ObXs) return;
	if (delay) {setTimeout2(ATtoggleClass,delay,ObXs,Cname,0,duration);return;}
	if(typeof ObXs==='string') return ATtoggleClass(ObXs.indexOf(' ')>0?ObXs.split(' '):$Xelts(ObXs), Cname, 0, duration);
	if (ATisArray(ObXs)) {
		for (var i=ObXs.length-1; i>=0; i--) {ATtoggleClass(ObXs[i],Cname, 0, duration);}
		return;
		}
	if (AThasClass(ObXs,Cname)) {
		if (Cname.indexOf(' ')>=0) {
			for (var i=0, Cnx=Cname.split(' '), l=Cnx.length; i<l; i++) {
				if (Cnx[i]!=='') ATtoggleClass(ObXs,Cnx[i], 0, duration);
				}
			}
		else {
			ATremoveClass(ObXs,Cname, 0, duration);
			}
		}
	else {ATaddClass(ObXs, Cname, 0, duration);}
}
//***********************************************

function ATgetStyle(ObX,s) {
	var o=typeof ObX==='string'?$Xelt(ObX):ObX;
	if (!o) return null;
	if (window.getComputedStyle) return getComputedStyle(o).getPropertyValue(s);
	try{return o.currentStyle[s];}catch(e){}
}
//***********************************************
function ATisVisible(ObX) {
	var o=typeof ObX==='string'?$Xelt(ObX):ObX;
	if (!o || !o.offsetHeight) return 0;
	if (window.getComputedStyle) {
		var s=getComputedStyle(o);
		if (s.getPropertyValue('display')=='none' || s.getPropertyValue('visibility')=='hidden') return false;
		while ((o=o.parentNode) && !o.documentElement) {
			s=getComputedStyle(o);
			if (s.getPropertyValue('display')=='none' || s.getPropertyValue('visibility')=='hidden') return false;
			}
		return true;
		}
	try{
		var d=o.currentStyle['display'], v=o.currentStyle['visibility'];
	}catch(e){return undefined;}
	if (d=='none' || v=='hidden') return false;
	if (o.parentNode && !o.parentNode.documentElement) return ATisVisible(o.parentNode);
	return true;
}
//***********************************************
function ATzIndexMax(ObX) {
	var o=typeof ObX==='string'?$Xelt(ObX):ObX, r=0;
	while (o && o.tagName) {
		var z=ATgetStyle(o,'z-index');
		if (z!=null && z!=='auto') if(r<z) r=+z;
		o=ATparentObject(o);
		}
	return r;
}
//***********************************************
function XTrim(st,nbsp) {
//	Deletes spaces \t \r \n codes<32 at start & end. Always return a string.
	return (st==null?'':
	(typeof st==='string'?st:st.toString()).replace(nbsp?/^([\s\x00-\x19]|&nbsp;)+|([\s\x00-\x19]|&nbsp;)+$/g : /^[\s\x00-\x19]+|[\s\x00-\x19]+$/g,''));
}
function XTrim1(st,nbsp) {
//	idem XTrim dans Toutes les lignes (garde lignes vides)
	return XTrim(st,nbsp).replace(/[\x00-\x09\x0b\x0c\x0e-\x20]*(\r*\n)[\x00-\x09\x0b\x0c\x0e-\x20]*/g,'$1');
}
function XTrim2(st,nbsp) {
//	idem XTrim1 + destruction lignes vides
	return XTrim1(st,nbsp).replace(/\n(?:\r*\n)+/g,'\n');
}

//***********************************************
function TriSelectValues(ObX,CursorWait,i0,UseDblTxt) {
/*	Trie une liste (select) suivant ses "valeurs" (le option value), sous forme numerique par def. ('012' > '2': ok)
	UseDblTxt===2: Float et Supprime tout formatage, 3: Mode Texte ! 1=Integer
*/
	var o=typeof ObX==='string'?$Xelt(ObX):ObX;
	if (!o) return;
	if (CursorWait) document.body.style.cursor='wait';
	if (!i0 || i0<0) i0=0;
	var l=o.length-1, obo=o.options, i, j, k, v, Tx=[];
	switch(UseDblTxt){
		case 2:
			for (i=i0; i<=l; i++) {Tx[i]=parseFloat(obo[i].value.replace(/ /g,'').replace(/,/,'.'));}
			break;
		case 3:
			for (i=i0; i<=l; i++) {Tx[i]=String(obo[i].value);}
			break;
		default :
			for (i=i0; i<=l; i++) {Tx[i]=parseInt(obo[i].value.replace(/ /g,''),10);}
		}
	for (i=i0; i<l; i++) {
		k=i;
		for (j=i+1; j<=l; j++) {
			if (Tx[j] < Tx[k]) k=j;
			}
		if (k!=i) {
			j=Tx[i];Tx[i]=Tx[k];Tx[k]=j;
			v=obo[i].value; obo[i].value=obo[k].value; obo[k].value=v;
			v=obo[i].text; obo[i].text=o.options[k].text; obo[k].text=v;
			if (obo[i].selected) {obo[i].selected=obo[k].selected; obo[k].selected=true;}
			else if (obo[k].selected) {obo[i].selected=true; obo[k].selected=false;}
			}
		}
	if (CursorWait) document.body.style.cursor='default';
}

//***********************************************
function TriSelectTexts(ObX,CursorWait,i0) {
//	Trie une liste (select) suivant ses "textes" visibles
	var o=typeof ObX==='string'?$Xelt(ObX):ObX;
	if (!o) return;
	if (CursorWait) document.body.style.cursor='wait';
	var lx=o.length-1, obo=o.options, i, j, k, ix, v;
	for (i=i0||0; i<lx; i++) {
		ix=0; k=obo[i].text;
		for (j=i+1; j <= lx; j++) {
			if (obo[j].text < k) {
				k = obo[j].text; ix=j;
				}
			}
		if (ix) {
			v=obo[i].value; obo[i].value=obo[ix].value; obo[ix].value=v;
			v=obo[i].text; obo[i].text=k; obo[ix].text=v;
			if (obo[i].selected) {obo[i].selected=obo[ix].selected; obo[ix].selected=true;}
			else if (obo[ix].selected) {obo[i].selected=true; obo[ix].selected=false;}
			}
		}
	if (CursorWait) document.body.style.cursor='default';
}

//***********************************************
function DoAddOption(ObX, iValue, txt, sel, check) {
//	Rajoute <option value='iValue'>txt</option>, en fin de liste. Sinon utiliser InsertHtmlBefore.
	var o=typeof ObX==='string'?$Xelt(ObX):ObX;
	if (!o) return;
	var i;
	try {
		if (typeof iValue!=='string') iValue=''+iValue;
		if (check) {
			for (i=o.options.length-1; i>=0; i--) {
				if (o.options[i].value==iValue) {
					if (sel) o.selectedIndex=i;
					if (txt!=undefined && txt!=='') o.options[i].innerHTML=txt;
					return i;
					}
				}
			}
		i=o.options.length;
		var oOpt=document.createElement('OPTION');
		oOpt.value=iValue;
		oOpt.text=txt;
		o.add(oOpt,i);
		o.options[i].innerHTML=txt;
		if (sel) o.selectedIndex=i;
		return i;
	} catch(e){}
}

function DoDelOption(ObX, iOption, iValue) {
//	Si on specifie une valeur >= 0 pour iOption, on detruit direct. Sinon on recherche iValue.
	try {
		var o=typeof ObX==='string'?$Xelt(ObX):ObX;
		if (!o) return;
		if (iOption >= 0) {
			o.options[iOption]=null;
			}
		else {
			for (var i=o.length-1, obo=o.options; i>=0; i--) {
				if (obo[i].value==iValue) {
					obo[i]=null;
					return;
					}
				}
			}
	} catch(e){}
}

function DoDelOptionListe(ObX, stValueList) {
//	Liste de valeurs separees par des virgules (PAS d'espaces involontaires)...
	try {
		var o=typeof ObX==='string'?$Xelt(ObX):ObX;
		if (!o) return;
		var st=','+stValueList+',';
		for (var i=o.length-1, obo=o.options; i>=0; i--) {
			if (st.indexOf(','+obo[i].value+',')>=0) {
				obo[i]=null;
				}
			}
	} catch(e){}
}


//***********************************************
function SelectSpaces(ObX,s) {
/*	Recherche un s= dans les options et rajoute le nombre de 's' voulu
	Traite TOUTE LA PAGE si pas de ObX
*/
	var O=ObX ? ($Xelt(ObX)||{}).options : $Xtag('OPTION');
	if (!O||!O[0]) return;
	if (s===undefined) s='&nbsp;';
	for (var i=0, l=O.length, j,k,w=s+s, Spx=['',s,w,w+s,w+w]; i<l; i++) {
		if ((k=+O[i].getAttribute('s'))>0) {
			if (!Spx[k]) {
				for (j=Spx.length; j<=k; j++) {Spx[j]=Spx[j-1]+s;}
				}
			O[i].innerHTML = Spx[k] + O[i].text;
			}
		}
}

//***********************************************
function SelXVal(ObX,ival,txt,add) {
	var o=$Xelt(ObX);
	if (!o) return;
	if (ival===undefined) ival='';
	if (window.NoGoToCat!==undefined) NoGoToCat=true;
	if (o.tagName!=='SELECT') {
		o.value=ival; return o.value;
		}
	var k;
	if (typeof txt==='number' || typeof txt==='bigint') txt=''+txt;
	try {
		if ((!add||add==-1) && txt!=undefined) txt=txt.toLowerCase();
		for (var i=o.options.length-1, obo=o.options; i>=0; i--) {
			if ((ival!=='' && obo[i].value==ival) || ((!add||add==-1) && txt==obo[i].text.toLowerCase()) || (ival==='' && txt==obo[i].text)) {
				o.selectedIndex=i;//obo[i].selected=true;
				k=i+1;
				break;
				}
			}
		if (!k && add) {
			DoAddOption(o, ival, txt || ival, 1);
			k=o.options.length;
			}
		} catch(e){}
	if (window.NoGoToCat!==undefined) NoGoToCat=false;
	return k;
}

//***********************************************
function CheckMaxLen(ObXs,MaxLen,doSilent) {
	if (!ObXs) return;
	if(typeof ObXs==='string')ObXs=$Xelt(ObXs);
	if (ATisArray(ObXs)) {
		for (var i=0; i<ObXs.length; i++) {CheckMaxLen(ObXs[i],MaxLen,doSilent);}
		return;
		}
	var i=MaxLen || 255;
	if (ObXs.value.length > i) {
		ObXs.value=ObXs.value.substr(0,i);
		if (!doSilent) alert('Texte raccourci :\r\n'+ObXs.value);
		}
}

//***********************************************
function GetParamsX(xParams,stTete,ValDef,vSep) {
	if (xParams==='' || xParams==null || typeof xParams!=='string') return ValDef;
	if (!vSep) vSep=';';
	return (xParams.match(new RegExp('(^|'+vSep+')'+EscRegExp(stTete)+'='+'([^'+vSep+']*)','i'))||[])[2] || ValDef;
}

function DelParamsX(xParams,stTete,vSep) {
	if (xParams==='' || xParams==null || typeof xParams!=='string') return;
	if (!vSep) vSep=';';
	var f=xParams.match(new RegExp('(^|'+vSep+')'+EscRegExp(stTete)+'='+'([^'+vSep+']*)','ig'));
	if (!f) return xParams;
	for (var i=f.length-1; i>=0; i--) {xParams=xParams.replace(f[i],'');}
	return xParams.replace(new RegExp(vSep+'{2,}','g'),vSep).replace(new RegExp('^'+vSep+'$'),'');
}

function SetParamsX(xParams,stTete,stVal,vSep) {
	if (!vSep) vSep=';';
	if (xParams==='' || xParams==null || typeof xParams!=='string') return vSep+stTete+'='+stVal+vSep;
	return (DelParamsX(xParams,stTete,vSep)+vSep+stTete+'='+stVal+vSep).replace(new RegExp(vSep+'{2,}','g'),vSep);
}

//***********************************************
function ATcheckMail(Mail,msg,w3C) {
	var R=w3C?	/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
			:	/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
	if (R.test(Mail)) return Mail;
	if (msg) {
		msg=typeof msg==='string'? msg.replace(/\$(e)?mail(\$)?/ig,Mail) : ('email "'+Mail+'" '+(Mail===''?GetCaseLangue('vide','empty'):GetCaseLangue('incorrect','invalid'))+'.');
		if (ATalert) {ATalert(msg,'!');}
		else {alert(msg);}
		}
	return '';
}

function ATDoMail(Obj,Mail,go) {
	var i='Mx'+ATshortUID(16);
	SetInnerHtml(Obj,'<a id="'+i+'" href="mailto:'+Mail+'">'+Mail+'</a>');
	if (go) ATfireEvent(i,'click');
	return i;
}
function ATDoTel(TelNum) {
	if (window.DoAffLoading) DoAffLoading=false;
	if (ATiNav.isOAx) {
		document.location='tel:'+TelNum;
		}
	else {
		try {
			document.location='callto:'+TelNum;
		} catch(e) {
			document.location='tel:'+TelNum;
			}
		}
	return false;
}

//***********************************************
function ATXBlockMove(e) {
	if (e && ((Math.abs(ATiNav())===2 && ATXBlockMove.Ok!==false) || ATXBlockMove.Ok)) e.preventDefault();
}

//***********************************************
function ATXTouch(o,evORfn){
	return !1;
/*	direct: <div ontouchstart="ATXTouch(this,event)" onclick=".."
	ATXTouch.delEvent: type de traitement current event
*/
	if (ATXTouch.Ok===undefined) {
		ATXTouch.Ok='ontouchstart' in window && ATiNav.isIE789!==99;//FF
		if (ATXTouch.Ok) {
			var v=$Xqs('meta[name="viewport"]'), vc=v?(v.getAttribute('content')||''):!1;
			if (vc.search(/user-scalable\s*=\s*(no|0)/gi)>=0 || parseFloat(vc.replace(/.*minimum-scale\s*=/i,''))==parseFloat(vc.replace(/.*maximum-scale\s*=/i,''))
				|| ATgetStyle('html','touch-action')=='manipulation' || ATgetStyle(document.body,'touch-action')=='manipulation'
				) ATXTouch.Ok=!1;
			}
		}
	if (!ATXTouch.Ok) return !1;
	if (ATisArray(o)) {
		for (var i=0; i<o.length; i++) {ATXTouch(o[i],evORfn);}
		return;
		}

	if (o && !evORfn){
		if ((o instanceof Event) || (o.type && (o.target||o.srcElement))) {evORfn=o; o=this;}
		else {if (o){evORfn=[];}}
		o=$Xelt(o);
		}

	if (!o || o.ontouchend || o.ontouchmove || o.ondblclick || ATgetStyle(o,'touch-action')=='manipulation') return !1;

	if (ATXTouch.delEvent===undefined) ATXTouch.delEvent=!1;
	if (ATXTouch.delEvent && evORfn.preventDefault) evORfn.preventDefault();
	var fx=(typeof evORfn==='object' && o.onclick)?o.onclick.toString().replace(/^[^{]+\{/,'{') : evORfn;

	o.onclick=null;

	o.ontouchstart=function(e){
		if (!e) return;
		if (ATXTouch.delEvent) e.preventDefault();
		var o=this;
		if (e.touches && e.touches.length===1) {
			o.ATXCStart=!0;
			o.ATXCx=o.ATXCx0=e.touches[0].pageX;
			o.ATXCy=o.ATXCy0=e.touches[0].pageY;
			}
		else {o.ATXCStart=!1;}
		};
	if ((evORfn instanceof Event) && evORfn.type==='touchstart') o.ontouchstart(evORfn);

	o.ontouchmove=function(e){
		if (!e) return;
		var o=this;
		if (o.ATXCStart){
			if (ATXTouch.delEvent) e.preventDefault();
			if (e.touches && e.touches.length===1) {
				o.ATXCx=e.touches[0].pageX;
				o.ATXCy=e.touches[0].pageY;
				}
			else {o.ATXCStart=!1;}
			}
		};
	o.ontouchend=function(e){
		if (!e) return;
		var o=this;
		if(o.ATXCStart){
			if (ATXTouch.delEvent) e.preventDefault();
			o.ATXCStart=!1;
			if (Math.abs(o.ATXCx-o.ATXCx0)<=24 && Math.abs(o.ATXCy-o.ATXCy0)<=24){
				if (!ATXTouch.delEvent) e.preventDefault();
				if(typeof fx==='string' && fx[0]==='*'){document.location=fx.substr(1);}
				else {ATfnExec(o,fx);}
				}
			else {
				var sw=(o.onswipe || document.onswipe);
				if(sw){
					if (!ATXTouch.delEvent) e.preventDefault();
					ATfnExec(o,sw);
					}
				}
			}
		return !1;
		};

	return !0;
}

//***********************************************
function ATHrefToLoc(a) {
	if (window.ATHrefToLocPause) {
		return setTimeout(function(){ATHrefToLoc(a);},150);
		}
	if (!window.ATHrefToLocPause) window.ATHrefToLocPause=0;
	if (typeof a==='string') return ATHrefToLoc($Xqsa(a));
	if (a && !(a instanceof Event)) {
		ATHrefToLocPause++;
		if (!ATisArray(a)) a=[a];
		for (var i=0, l=a.length, st; i<l; i++) {
			if ((st=a[i].getAttribute('href')) && st!=='#' && st.search(/javascript:/i)<0) {
				st=a[i].getAttribute('target')=='_blank'? 'OpenWindowTab(\''+st.replace(/'/g,'\'')+'\')' :('*'+st);
				if (!ATXTouch(a[i],st)) {
					a[i].setAttribute('data-athref',(ATiNav.standalone?
						a[i].getAttribute('href').replace(/([?&])W=/i,'$1WasW=') // cas particuliers
						:a[i].getAttribute('href')));
					ATaddEvent(a[i],'click',function(e) {
						var o=this;
						if (!o || o.tagName!=='A') {
							o=e.target;
							while (o.tagName!=='A'){o=o.parentNode; if (!o) return;}
							}
						if (o.getAttribute('target')=='_blank') {OpenWindowTab(o.getAttribute('data-athref'));}
						else {document.location = o.getAttribute('data-athref');}
						return false;
						});
					}
				a[i].href='javascript:void({});';
				}
			}
		ATHrefToLocPause--;
		}
	else if ((i=Math.abs(ATiNav.isOAx))===1 || i===2 || (ATiNav.standalone && (i===3 || i===4))) {
		ATHrefToLoc($Xqsa('a,area'));
		ATXTouch($Xqsa('*[onclick]:not(a):not(area):not([ontouchstart]):not([dblclick])'));
		}
}

/***********************************************
	Gestion du curseur d'attente.. Essaie d'eviter les blocages en mode attente !
*/
function ATKeepCursWait() {ATFinAtt.timo=clearTimeout(ATFinAtt.timo);}
function ATBackCursDef() {ATKeepCursWait(); document.body.style.cursor='default';}

function ATFinAtt() {
	document.body.style.cursor='wait';
	clearTimeout(ATFinAtt.timo);
	ATFinAtt.timo=setTimeout(ATBackCursDef,1000);
}


//***********************************************
ATiNav();

//***********************************************
if (window.ATUtilsInit!==false || (window.ATUtilsInit && window.ATUtilsInit.toString().search(/NoFinAtt/i))<0) {
/*	S'installe dans TOUS les cas SAUF si ATUtilsInit=false ou contient NoFinAtt
	au besoin, enlever avec ATremoveEvent(window, 'beforeunload', ATFinAtt,false);
*/
	ATaddEvent(window, 'beforeunload', ATFinAtt);
	ATaddEvent(window, 'unload', ATKeepCursWait);
	}

//*****************************************************************
if (window.ATUtilsInit) {
	ATXTouch();
	// ATUtilsInit=true ou combine 'XSrc' 'SelectSpaces' 'ATHrefToLoc, iWebApp(PresEtc), iPadApp'
	if (ATUtilsInit===true || ATUtilsInit.search(/XSrc/i)>=0) {ATaddEvent(window, ATiNav.Loaded, function () {LoadDivSrc();});}
	else {
		if (ATUtilsInit===true || ATUtilsInit.search(/iDiv/i)>=0) ATaddEvent(window, ATiNav.Loaded, function () {LoadDivSrc('IDIV');});
		if (ATUtilsInit===true || ATUtilsInit.search(/DivSrc/i)>=0) ATaddEvent(window, ATiNav.Loaded, function () {LoadDivSrc('DIV');});
		if (ATUtilsInit===true || ATUtilsInit.search(/SpanSrc/i)>=0) ATaddEvent(window, ATiNav.Loaded, function () {LoadDivSrc('SPAN');});
		}
	if (ATUtilsInit===true || ATUtilsInit.search(/SelectSpaces/i)>=0) ATaddEvent(window, ATiNav.Loaded, function () {SelectSpaces();});// ATaddEvent(window, ATiNav.Loaded, ATHrefToLoc);
	if (ATUtilsInit===true || ATUtilsInit.search(/iWebApp|iPadApp|ATHrefToLoc/i)>=0) {
		var i,V;
		if ((ATUtilsInit===true || ATUtilsInit.search(/iPadApp/i)>=0) && (i=Math.abs(ATiNav.isOAx))!==2) {
			// devrait etre soit 0,41666 (320/768) soit 0,46875 (480/1024)
			if ((V=$Xname('viewport')) && V[0]) V[0].setAttribute('content',
				'width=device-width,user-scalable=1,minimum-scale=0.25,maximum-scale=3.0,initial-scale='+
				(i===1? '0.42':'1'));
			}
		if (ATXBlockMove.Ok===undefined) ATXBlockMove.Ok=false;
		ATaddEvent(window,'DOMContentLoaded',function(){
			if (!document.body.ontouchmove) {document.body.ontouchmove='XPBlockMove(event);'}
			else {ATaddEvent(document.body,'touchmove',XPBlockMove);}
			// body.oncontextmenu="return false;"
			// User-select css:false;
			});
		ATaddEvent(window,'DOMContentLoaded', function(){setTimeout(ATHrefToLoc,1);});
		ATaddEvent(window,'load', function(){setTimeout(ATHrefToLoc,150);}); // after most ?
		}
}