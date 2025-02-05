function g(i){
	return document.getElementById(i);
}
function q(i){
	return document.querySelectorAll(i);
}
function checkOverflow(el,stl)
{
	stl = stl || getComputedStyle(el)
    var curOverflow = stl.overflow;
    if(curOverflow == "auto" || curOverflow=="hidden" ){
   		return false;
    }
    return el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight;
}
function containFloatAndAbsolute(el){
	for(var i=0;i<el.children.length;i++){
		var stl = getComputedStyle(el.children[i]);
		if( stl.display=="absolute")return true;
	}
	return false;
}
function isIgnore(el){
	if(el.id=="surf-menubar" || el.id=="mainbar"){
		return true;
	}
	return false;
}
function textScaling(basetext,newtext){

}
function showBtn(){
	var btn=document.createElement("button");
	btn.setAttribute("style","display:block;position:fixed;bottom:20%;right:5px; width:40px;height:40px;background-color:#eaeaea80;border-radius:50%;font-size:12px;text-align:center;");
	btn.innerHTML = "Dịch";
	btn.onclick = function(){
		realtimeTranslate(true,true);
	}
	document.body.appendChild(btn);
}
var setting = {
	enable:true,
	heightauto:true,
	widthauto:false,
	scaleauto:true,
	enableajax:false,
	enablescript:true,
	strictarial:false,
	stvserver: "sangtacviet.com"
}
var namedata = "";
var namedatacache = null;
function replaceName(text){
	var t = text;
	if(namedatacache){
		for(var i=0;i<namedatacache.length;i++){
			t = t.replace(namedatacache[i][0], namedatacache[i][1]);
		}
		return t;
	}
	namedatacache = [];
	var n = namedata.split("\n");
	for(var i=0;i<n.length;i++){
		var m = n[i].trim().split("=");
		if(m[0] && m[1]){
			var r = new RegExp(m[0],"g");
			namedatacache.push([r,m[1]]);
			t = t.replace(r, m[1]);
		}
	}
	return t;
}
chrome.storage.sync.get([
		"enable",
		"heightauto",
		"widthauto",
		"scaleauto",
		"enableajax",
		"enablescript",
		"strictarial",
		"delaytrans",
		"delaymutation",
		"server",
		"showbtn",
		"namedata"
	], function(result) {
  	for(var settingName in result){
  		if(result[settingName] == "false"){
  			setting[settingName] = false;
  		}else{
  			setting[settingName] = true;
  		}
  		if(settingName == "delaytrans"){
  			translateDelay=parseInt(result[settingName]);
  		}
  		if(settingName == "delaymutation"){
  			deferDelay=parseInt(result[settingName]);
  		}
  		if(settingName == "server"){
  			setting.stvserver = result[settingName];
  		}
  		if(settingName == "showbtn"){
  			if(result[settingName] == "true"){
  				showBtn();
  			}
  		}
		if(settingName == "namedata"){
			namedata = result[settingName];
		}
  	}
  	
  	startScript();
});
function insertClearfix(node){
	var clearfix = document.createElement("div");
	clearfix.setAttribute("calculated", "true");
	clearfix.setAttribute("style", "clear:both");
	node.appendChild(clearfix);
}
function countChild(node) {
	var c=node.children.length;
	for(var i=0;i<node.children.length;i++){
		c += countChild(node.children[i]);
	}
	return c;
}

function removeOverflow(){
	if(setting.heightauto || setting.widthauto)
	q("div:not([calculated]), nav, main:not([calculated]), section:not([calculated])").forEach(function(e){
		e.setAttribute("calculated", "true");
		var stl = getComputedStyle(e);
		if(checkOverflow(e,stl) 
			&& !isIgnore(e)){
			if(setting.heightauto){
				if(stl.maxHeight == 'none'){
					e.style.maxHeight = (parseInt(stl.height) * 2)+"px";
				}
				if(parseInt(stl.height) + "px" == stl.height)
					e.style.minHeight=stl.height;
				if(stl.overflowY == 'auto' || stl.overflowY == 'scroll'){
					
				}else{
					e.style.height="auto";
				}
				
			}
			if(setting.widthauto){
				if(parseInt(stl.width) + "px" == stl.width)
					e.style.minWidth=stl.width;
				e.style.width="auto";
			}
		}
		if(e.tagName=="NAV"){
			e.style.fontSize = (parseInt(stl.fontSize) * 0.75) + "px";
			e.style.overflow = 'hidden';
		}
	});
	if(setting.heightauto || setting.widthauto)
	q("ul").forEach(function(e){
		if(checkOverflow(e) 
			&& !isIgnore(e)){
			var stl = getComputedStyle(e);
			if(setting.heightauto){
				if(parseInt(stl.height) + "px" == stl.height)
					e.style.minHeight=stl.height;
				e.style.height="auto";
			}
			if(setting.widthauto||stl.position == 'absolute'){
				if(parseInt(stl.width) + "px" == stl.width)
					e.style.minWidth=stl.width;
				e.style.width="auto";
			}
		}
		e=e.parentElement;
		if(e&&checkOverflow(e) 
			&& !isIgnore(e)){
			var stl = getComputedStyle(e);
			if(setting.heightauto){
				if(parseInt(stl.height) + "px" == stl.height)
					e.style.minHeight=stl.height;
				if(stl.overflowY == 'auto' || stl.overflowY == 'scroll'){
					
				}else{
					e.style.height="auto";
				}
			}
			if(stl.position == 'absolute'||setting.widthauto){
				if(parseInt(stl.width) + "px" == stl.width)
					e.style.minWidth=stl.width;
				e.style.width="auto";
			}
		}
	});
	if(setting.scaleauto)
	q("pp:not([calculated]),a:not([calculated]),label:not([calculated]),"+
		"button:not([calculated]), [type=\"submit\"]:not([calculated]),"+
		"li:not([calculated]), span:not([calculated]), i:not([calculated]),"+
		"h3:not([calculated]),h2:not([calculated]),h1:not([calculated]),h4:not([calculated])").forEach(function(e){
		e.setAttribute("calculated", "true");
		if(e.tagName=="A"){
			if(!(e.className.match(/btn|click|button/i))){
				if(e.children.length>1){
					return;
				}
			}
		}
		if(e.tagName=="LABEL"){
			if(e.children.length>1){
				return;
			}
		}
		if(e.tagName=="LI"){
			if(countChild(e)<3){
				e.style.whiteSpace = 'nowrap';
			}
			e.style.wordBreak = 'keep-all';
		}
		if(checkOverflow(e) 
			&& !isIgnore(e)){
			var stl = getComputedStyle(e);
			var fontsize = parseInt(stl.fontSize) ;
			var pd = parseInt(stl.paddingLeft) ;

			var multiply =1;
			var multiply2 =1;
			
			if(fontsize > 26){
				multiply = 5;
			}else
			if(fontsize > 22){
				multiply = 3;
			}else
			if(fontsize >= 16){
				multiply = 2;
			}else
			if(fontsize > 14){
				multiply = 2;
			}else
			if(fontsize > 12){
				multiply = 1;
			}
			if(fontsize - multiply < 10){
				e.style.fontSize="10px";
			}else
			e.style.fontSize=(fontsize- multiply) +"px";
			

			if(pd > 30){
				multiply2 = 20;
			}else
			if(pd > 20){
				multiply2 = 16;
			}else
			if(pd > 10){
				multiply2 = 7;
			}else
			if(pd > 5){
				multiply2 = 3;
			}

			if(fontsize - multiply < 10){
				e.style.fontSize="10px";
			}else
			e.style.fontSize=(fontsize - multiply) +"px";
			if(pd>0){
				if(pd - multiply2 < 0){
					e.style.paddingLeft="0px";
					e.style.paddingRight="0px";
				}else{
					e.style.paddingRight=(pd - multiply2) +"px";
					e.style.paddingLeft=(pd - multiply2) +"px";
				}	
			}
			if(checkOverflow(e)){
				if(fontsize - multiply*2 < 10){
					e.style.fontSize="10px";
					e.style.textOverflow = 'ellipsis';
				}else
				e.style.fontSize = (fontsize -  multiply*2) + "px";
				//e.clientHeight;
				if(checkOverflow(e)){
					if(fontsize - multiply*3< 10){
						e.style.fontSize="10px";
						e.style.textOverflow = 'ellipsis';
					}else
					e.style.fontSize = (fontsize -  multiply*3) + "px";
					//e.clientHeight;
					if(checkOverflow(e)){
						if(fontsize - multiply*5< 10){
							e.style.fontSize="10px";
							e.style.textOverflow = 'ellipsis';
						}else
						e.style.fontSize = (fontsize -  multiply*5) + "px";
					}
				}
			}
		}
	});
}

var realtimeTranslateLock = false;
var chineseRegex = /[\u3400-\u9FBF]/;
function recurTraver(node,arr,tarr){
	if(!node)return;
	for(var i=0;i<node.childNodes.length;i++){
		if(node.childNodes[i].nodeType == 3){
			if(chineseRegex.test(node.childNodes[i].textContent)){
				arr.push( node.childNodes[i] );
				tarr.push( node.childNodes[i].textContent );
			}
		}else{
			if(node.childNodes[i].tagName!="SCRIPT")
			recurTraver(node.childNodes[i],arr,tarr);
		}
	}
}
function translatePlaceholder(arr,tarr){
	var listNode = q("input[type=\"submit\"], [placeholder], [title]");
	for(var i=0;i<listNode.length;i++){
		var flag=false;
		var nodeid=0;
		if(listNode[i].type=="submit" && listNode[i].value.match(/[\u3400-\u9FBF]/)){
			if(!flag){
				flag=true;
				arr.push(listNode[i]);
				nodeid=arr.length-1;
			}
			tarr.push(nodeid+"<obj>btnval<obj>"+listNode[i].value);
		}
		if(listNode[i].placeholder && listNode[i].placeholder.match(/[\u3400-\u9FBF]/)){
			if(!flag){
				flag=true;
				arr.push(listNode[i]);
				nodeid=arr.length-1;
			}
			tarr.push(nodeid+"<obj>plchd<obj>"+listNode[i].placeholder);
		}
		if(listNode[i].title && listNode[i].title.match(/[\u3400-\u9FBF]/)){
			if(!flag){
				flag=true;
				arr.push(listNode[i]);
				nodeid=arr.length-1;
			}
			tarr.push(nodeid+"<obj>title<obj>"+listNode[i].title);
		}
	}
}
var isChinese = document.title.match(/[\u3400-\u9FBF]/);
var oldSend = XMLHttpRequest.prototype.send;
var translateDelay = 120;
var deferDelay = 200;
var enableRemoveOverflow=true;
if(setting.heightauto == false && setting.widthauto==false && setting.scaleauto==false){
	enableRemoveOverflow=false;
}
function poporgn(){
	var t = "";
	for(var i=0;i<this.childNodes.length;i++){
		if(this.childNodes[i].nodeType==3){
			t+=this.childNodes[i].orgn||"";
		}
	}
	this.setAttribute("title", t);
}
async function isJK(text){
	var pm = await new Promise(function(rs,rj){
		console.log(text);
		chrome.i18n.detectLanguage(text,rs);
	});
	console.log(pm.languages);
	return pm.languages[0].language == "ja";
}
async function realtimeTranslate(defered,btn){
	if(!btn)
	if(realtimeTranslateLock || !setting.enable){
		return;
	}
	//console.log(setting);
	realtimeTranslateLock = true;
	setTimeout(function(){
		realtimeTranslateLock = false;
	}, translateDelay);
	if(isChinese){
		attachAjaxRoot();
	}
	//console.log('Checking for realtimeTranslate');
	var totranslist =[];
	var transtext =[];
	var currnode = document.body;
	recurTraver(q("title")[0],totranslist,transtext);
	recurTraver(currnode,totranslist,transtext);
	if(totranslist.length > 0){
		var transtext2 = transtext.join("=|==|=");
		var isjk = await isJK(transtext2);
		if(isjk && !defered){
			console.log("defer");
			setTimeout(function(){
				console.log("defered");
				realtimeTranslate(true);
			},2000);
			return;
		}
		if(!isChinese){
			var newlen = transtext2.replace(/[\u3400-\u9FBF]+/g,"").length;
			if(transtext2.length - newlen > 200){
				isChinese=true;
			}
		}
		var ajax = new XMLHttpRequest();
		ajax.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var translateds = this.responseText.split("=|==|=");
				for(var i=0;i<totranslist.length;i++){
					totranslist[i].textContent = translateds[i];
					totranslist[i].orgn = transtext[i];
					if(totranslist[i].parentElement && !totranslist[i].parentElement.popable){
						totranslist[i].parentElement.addEventListener("mouseenter", poporgn);
						totranslist[i].parentElement.popable = true;
					}
				}
				if(isChinese){
					if(enableRemoveOverflow)
						removeOverflow();
					invokeOnChinesePage();
				}
			}
		};
		ajax.open("POST", "//"+setting.stvserver+"/", true);
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		oldSend.apply(ajax,[ "sajax=trans&content="+encodeURIComponent( replaceName(transtext2) ) ]);
	}
	var totranslist2 =[];
	var transtext3 =[];
	translatePlaceholder( totranslist2,transtext3 );	
	if(totranslist2.length > 0){
		var transtext4 = transtext3.join("=|==|=");
		var ajax2 = new XMLHttpRequest();
		ajax2.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var translateds = this.responseText.split("=|==|=");
				for(var i=0;i<translateds.length;i++){
					var obj=translateds[i].split("<obj>");
					if(obj[1]=="title"){
						totranslist2[obj[0]].title = obj[2];
					}else
					if(obj[1]=="btnval"){
						totranslist2[obj[0]].value = obj[2];
					}else
					if(obj[1]=="plchd"){
						totranslist2[obj[0]].placeholder = obj[2];
					}
				}
			}
		};
		ajax2.open("POST", "//"+setting.stvserver+"/", true);
		ajax2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		oldSend.apply(ajax2,[ "sajax=trans&content="+encodeURIComponent( replaceName(transtext4) ) ]);
	}
}


function attachAjax(){
	var oldSend2 = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(){
	 	this.onloadend=function(){
			if(this.responseText.length>10){
				document.dispatchEvent(new CustomEvent('CallTranslator',{}));
			}
		}
		oldSend2.apply(this, arguments);
	}
}
function attachAjaxRoot(fun){
	if(!setting.enableajax)return;
	var script = document.createElement('script');
	script.textContent = attachAjax.toString()+"attachAjax()";
	(document.head||document.documentElement).appendChild(script);
	script.remove();
	document.addEventListener('CallTranslator', function () {
	  	setTimeout(realtimeTranslate, 0);
	});

	attachAjaxRoot=function(){};
}	
function runOnMainContext(s){
	var script = document.createElement('script');
	script.textContent = s;
	(document.head||document.documentElement).appendChild(script);
	script.remove();
}
function invokeOnChinesePage(){
	if(isChinese && setting.enablescript){
		var MutationLock = false;
		var DeferedCheck = false;
		const observer = new MutationObserver(function(mutationsList){
			if(MutationLock){
				if(!DeferedCheck){
					DeferedCheck=true;
				}
				return;
			}
			setTimeout(function(){
				MutationLock = false;
				if(DeferedCheck){
					DeferedCheck=false;
					realtimeTranslate();
				}
			}, deferDelay);
			realtimeTranslate();
		});
		observer.observe(document.body, { childList: true, subtree: true, characterData: true } );
	}
	if(isChinese){
		var css = document.createElement("style");
		if(setting.strictarial){
			css.textContent=":not(i){font-family: arial !important;word-break:break-word;text-overflow:ellipsis;}";
		}
			css.textContent=":not(i){font-family: arial;word-break:break-word;text-overflow:ellipsis;}";
		document.head.appendChild(css);
	}

	window.invokeOnChinesePage=function() {}
}
function startScript(){
	if(!setting.enable){
		return;
	}
	setTimeout(realtimeTranslate, 500);
	//realtimeTranslate();
}
startScript();

var hostname;
var path;
var hostpath;
var hash;
var protocol;
var file;
var stv="//trans.sangtacviet.com/";
var step=0;
function readVar(){
	var url = decodeURIComponent(location.search.split("=")[1]);
	if(url.substring(0, 5)=="https"||url.substring(0,4)=="http"){
		var urlpart=url.split("/")
		protocol=urlpart[0]+"//";
		hostname=urlpart[2];
		urlpart.shift();
		urlpart.shift();
		urlpart.shift();
		file=urlpart.pop();
		path="/"+urlpart.join("/");
		hostpath=hostname+path;
	}
}

function lnk(a){
	if(step==0)
	return stv+encodeURIComponent(a);
	else {
		return a;
	}
}
function pureUrl(url){
	step=0;
	return makeUrl(url)
}
function makeUrl(url){
	if(url==null)return "";
	if(url.match(/^https?:\/\//)){
		if(url.indexOf("sangtacviet.com/")>0)return url;
		return lnk(url);
	}else
	if(url.substring(0,2)=="//")
	{
		if(url.indexOf("sangtacviet.com/")>0)return url;
		return lnk(protocol+url.substring(2));
	}else
	if(url.charAt(0)=="/"){
		return lnk(protocol+hostname+url);
	}else
	if(url.match(/^(javascript:|mailto:)/)||url.charAt(0)=="#")
	{
		return url;
	}else
	{
		return lnk(protocol+hostname+path+"/"+url);
	}
}
function attachAnchor(node) {
	if(location.search=="")return;
	step=0;
	var multab=getCookie("allowmultitab");
	if(node){
		node.querySelectorAll('a').forEach(function(e) {
			var newurl=makeUrl(e.getAttribute("href"));
			e.setAttribute("href", newurl);
			if(!multab){
				e.setAttribute("target", "_self");
			}
		});
	}else
	q(':not([id="mainbar"]) a').forEach(function(e) {
		var newurl=makeUrl(e.getAttribute("href"));
		e.setAttribute("href", newurl);
		if(!multab){
			e.setAttribute("target", "_self");
		}
	});
}
function attachImage() {
	step=1;
	q(':not([id="mainbar"]) img').forEach(function(e) {
		var newurl=makeUrl(e.getAttribute("src"));
		e.setAttribute("onerror", "");
		e.setAttribute("src", newurl);
	});
}
function attachForm(){
	step=0;
	q(':not([id="mainbar"]) form').forEach(function(e) {
		var newurl=makeUrl(e.getAttribute("action"));
		if(gbk!=null && gbk==true){
			var elem = document.createElement("input");
			elem.setAttribute("type", "hidden");
			elem.setAttribute("name", "stv_gbk");
			elem.setAttribute("value", "true");
			e.appendChild(elem);
		}
		e.setAttribute("baseorigin", e.getAttribute("action"));
		e.setAttribute("action", newurl);
		if(e.method && e.method.toLowerCase() =="get"){
			var oldsubmit = function(){};
			if(e.onsubmit){
				oldsubmit = e.onsubmit;
			}
			e.onsubmit = function(){
				event.preventDefault();
				var qrstring = $(this).serialize();
				var baseorigin = this.getAttribute("baseorigin");
				if(baseorigin.indexOf("?") < 0){
					baseorigin+="?";
				}
				baseorigin+=qrstring;
				step=0;
				baseorigin = makeUrl(baseorigin);
				if(this.target=="_blank"){
					window.open(baseorigin);
				}else{
					location = baseorigin;
				}
			}
		}
	});
}
function attachCss(){
	step=1;
	q('link[rel="stylesheet"]').forEach(function(e) {
		if(!e.getAttribute("href")){
			return;
		}
		var newurl=makeUrl(e.getAttribute("href"));
		e.setAttribute("href", newurl);
	});
}
function attachIframe(){
	step=1;
	q('iframe').forEach(function(e) {
		if(e.id=="navigatebar"){

		}else{
			var newurl=makeUrl(e.getAttribute("src"));
			e.setAttribute("src", newurl);
		}
	});
}
function attachSelect(){
	step=1;
	q('select').forEach(function(e) {
		if(e.getAttribute("onchange")!=null){
			if(e.getAttribute("onchange").match(/location(?:\.href)? *= *.*?/)){
				e.setAttribute("onchange", e.getAttribute("onchange").replace(/location(?:\.href)? *= *([^ ;]+);?/,function(match,p1){
					return "location=pureUrl("+p1.trim(';')+")";
				}));
			}
		}
	});
}
function attachOnclick(){
	step=1;
	q('[onclick]').forEach(function(e) {
		if(e.getAttribute("onclick")!=null){
			if(e.getAttribute("onclick").match(/location(?:\.href)? *= *.*?/)){
				e.setAttribute("onclick", e.getAttribute("onclick").replace(/location(?:\.href)? *= *([^ ;]+)(;)?/g,function(match,p1,p2){
					return "location=pureUrl("+p1.trim(';')+")"+(p2||"");
				}));
			}
		}
	});
}
function attachAll(){
	if(location.search=="")return;
	readVar();
	attachAnchor();
	attachImage();
	attachForm();
	attachCss();
	attachIframe();
	attachOnclick();
	attachSelect();
	if(detectContent()){
		if(window.loadStvConfig){
			if(!window.$){
				q("[surc]")[0].src="/jqr.js";
			}
		}
	}
}
function stripScripts(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerText;
}
function detectContent(){
	var dlist = document.querySelectorAll("div[class], div[id]");
	var ranking ={};
	var rankingarr = [];
	var dupli = {};
	for(var i=0;i<dlist.length;i++){
		var identity = "div" + (dlist[i].hasAttribute("class")?"."+dlist[i].getAttribute("class").replace(/ +/g, "."):"") + 
			(dlist[i].hasAttribute("id")?"#"+dlist[i].getAttribute("id"):"");
		if(identity in dupli){
			continue;
		}
		if(identity in ranking){
			delete ranking[identity];
			dupli[identity] = true;
		}else{
			var htmllen = dlist[i].innerHTML.replace(/>[^<]*?</g,"><").replace(/<i h=[^>]+><\/i>/g,"").length;
			var textlen = stripScripts(dlist[i].innerHTML).length;
			if(textlen > 7000 && textlen - htmllen > 5000){
				ranking[identity] = true;
				rankingarr.push({
					identity: identity,
					element: dlist[i]
				});
			}
		}
	}
	var contentdiv=false;
	for(var i=rankingarr.length - 1;i>=0 && !contentdiv;i--){
		if(rankingarr[i].identity in ranking){
			contentdiv=rankingarr[i].element;
		}
	}
	console.log(contentdiv);
	if(contentdiv){
		contentdiv.setAttribute("id", "maincontent");
		return true;
	}else{
		try {
			g("bigmaincontent").setAttribute("id", "maincontent");
		} catch(e) {
			console.log(e);
		}
		return false;
	}
}
var clickedEl;
document.addEventListener("contextmenu", function(event){
    clickedEl = event.target;
}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request == "copySelected") {
        
        var t = "";
		for(var i=0;i<clickedEl.childNodes.length;i++){
			if(clickedEl.childNodes[i].nodeType==3){
				t+=clickedEl.childNodes[i].orgn||"";
			}
		}
		sendResponse({value: t});
	}
	if(request == "copyName") {
        
        var t = "";
		var v = "";
		for(var i=0;i<clickedEl.childNodes.length;i++){
			if(clickedEl.childNodes[i].nodeType==3){
				t+=clickedEl.childNodes[i].orgn||"";
				v+=clickedEl.childNodes[i].textContent||"";
			}
		}
		sendResponse({chi: t,vi: v});
	}
});