
function enforceStyle(){
	set_cookie("fontFamily","2",72,".faloo.com");
	set_cookie("vip_img_width","6",72,".faloo.com");
	set_cookie("fontsize","32",72,".faloo.com");
	set_cookie("bgcolor","FFFFFF",72,".faloo.com");
	set_cookie("font_Color","000000",72,".faloo.com");
}
function imgDownloaded(imgD,bookid,chapterid){
	var fun = function(imgData,book,chapter, calb){
	    var ajax = new XMLHttpRequest();
	    ajax.onreadystatechange = function() {
	        if (ajax.readyState == 4 && ajax.status == 200) {
	            calb(this.responseText);
	        }
	    };
	    ajax.open("POST", "https://sangtacviet.com/", true);
	    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    ajax.send("sajax=scanimagehp&key=asfuhiu23g5yfc2gi8ygf&bookid="+book+"&chapterid="+chapter+"&data="+encodeURIComponent(imgData));
	}
	fun(imgD,bookid,chapterid,function(txt){
		document.getElementById("maincontent").innerHTML=txt;
		document.getElementById("maincontent").style.backgroundImage = 'none';
		setTimeout(function(){
			try{
				document.getElementById("page_1").children[1].click();
			}catch(e) {
				document.getElementById("next_page").click();
			}
		}, 12*1000);
	});
}
function downloadImage(link,b,c){
    var a = new Image();
    a.setAttribute("crossOrigin", "*");
    a.src=link;
    a.onload=function(){
        var cv = document.createElement("canvas");
        cv.width = a.width;
        cv.height=a.height;
        cv.getContext("2d").drawImage(a,0,0);
        imgDownloaded(cv.toDataURL(),b,c); 
    }
}
function imgDownloadedMPart(imgD,bookid,chapterid,parts,partid,divid){
	var fun = function(imgData,book,chapter,pparts,ppartid, calb){
	    var ajax = new XMLHttpRequest();
	    ajax.onreadystatechange = function() {
	        if (ajax.readyState == 4 && ajax.status == 200) {
	            calb(this.responseText);
	        }
	    };
	    ajax.open("POST", "https://sangtacviet.com/", true);
	    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	    ajax.send("sajax=scanimagehp&key=asfuhiu23g5yfc2gi8ygf&partsize="+pparts+"&part="+ppartid+"&bookid="+book+"&chapterid="+chapter+"&data="+encodeURIComponent(imgData));
	}
	fun(imgD,bookid,chapterid,parts,partid,function(txt){
		setTimeout(function(){
			try{
				document.getElementById("page_1").children[1].click();
			}catch(e) {
				document.getElementById("next_page").click();
			}
		}, 30*1000);
		document.getElementById(divid).innerHTML=txt;
		document.getElementById(divid).style.backgroundImage = 'none';
		
	});
}
function downloadImageMPart(link,b,c,ps,p,d){
    var a = new Image();
    a.setAttribute("crossOrigin", "*");
    a.src=link;
    a.onload=function(){
        var cv = document.createElement("canvas");
        cv.width = a.width;
        cv.height=a.height;
        cv.getContext("2d").drawImage(a,0,0);
        imgDownloadedMPart(cv.toDataURL(),b,c,ps,p,d); 
    }
}
window.isMobileFaloo = false;
function checkToScan(){
	if(location.href.indexOf("wap")>=0){
		window.isMobileFaloo=true;
		checkToScanMobile();
	}
	if(q("[id*=\"img_src_cok\"]").length>0){
		if(q("[id*=\"img_src_cok\"]").length>1){
			var imgList = q("[id*=\"img_src_cok\"]");
			for (var i = imgList.length - 1; i >= 0; i--) {
				var imgDiv = imgList[i];
				var imgLink = imgDiv.style.backgroundImage||imgDiv.style.background;
				imgLink = imgLink.replace(/url\(\"(.*?)\"\)/, "$1");
				if(imgLink==""){
					return;
				}
				var bid = imgLink.replace(/.*?\&id=(\d+).*/,"$1");
				var cid = imgLink.replace(/.*?\&n=(\d+).*/,"$1");
				runOnMainContext(
					downloadImageMPart.toString()
					+imgDownloadedMPart.toString()
					+"downloadImageMPart('"+imgLink+"',"+bid+","+cid+","+imgList.length+","+i+",'"+"maincontent_"+i+"');"
					+enforceStyle.toString()
					+"enforceStyle();"
				);
				imgDiv.id="maincontent_"+i;
				var btn = document.createElement("button");
				btn.innerHTML='<a href="'+imgLink+'" download="faloo_'+bid+'_'+cid+'.txt" id="downloader">Tải ảnh</a>';
				btn.setAttribute("style", "position:fixed;right:10px;top:10px;font-size:20px;padding:6px;z-index:10");	
			}
		}else {
			var imgDiv = q("[id*=\"img_src_cok\"]")[0];
			var imgLink = imgDiv.style.backgroundImage||imgDiv.style.background;
			imgLink = imgLink.replace(/url\(\"(.*?)\"\)/, "$1");
			if(imgLink==""){
				return;
			}
			var bid = imgLink.replace(/.*?\&id=(\d+).*/,"$1");
			var cid = imgLink.replace(/.*?\&n=(\d+).*/,"$1");
			runOnMainContext(
				downloadImage.toString()
				+imgDownloaded.toString()
				+"downloadImage('"+imgLink+"',"+bid+","+cid+");"
				+enforceStyle.toString()
				+"enforceStyle();"
			);
			imgDiv.id="maincontent";
			var btn = document.createElement("button");
			btn.innerHTML='<a href="'+imgLink+'" download="faloo_'+bid+'_'+cid+'.txt" id="downloader">Tải ảnh</a>';
			btn.setAttribute("style", "position:fixed;right:10px;top:10px;font-size:20px;padding:6px;z-index:10");			
		}
		document.body.appendChild(btn);
	}
}
function checkToScanMobile(){
	if(q("[id*=\"vip_node_img\"]").length>0){
		if(q("[id*=\"vip_node_img\"]").length>1){
			var imgList = q("[id*=\"vip_node_img\"]");
			for (var i = imgList.length - 1; i >= 0; i--) {
				var imgDiv = imgList[i];
				var imgLink = imgDiv.src;
				imgLink = imgLink.replace(/url\(\"(.*?)\"\)/, "$1");
				if(imgLink==""){
					return;
				}
				var bid = imgLink.replace(/.*?\&id=(\d+).*/,"$1");
				var cid = imgLink.replace(/.*?\&n=(\d+).*/,"$1");
				runOnMainContext(
					downloadImageMPart.toString()
					+imgDownloadedMPart.toString()
					+"downloadImageMPart('"+imgLink+"',"+bid+","+cid+","+imgList.length+","+i+",'"+"maincontent_"+i+"');"
					+enforceStyle.toString()
					+"enforceStyle();"
				);
				imgDiv.parentElement.id="maincontent_"+i;
				imgDiv.id="";
				var btn = document.createElement("button");
				btn.innerHTML='<a href="'+imgLink+'" download="faloo_'+bid+'_'+cid+'.txt" id="downloader">Tải ảnh</a>';
				btn.setAttribute("style", "position:fixed;right:10px;top:10px;font-size:20px;padding:6px;z-index:10");	
			}
		}else {
			var imgDiv = q("[id*=\"vip_node_img\"]")[0];
			var imgLink = imgDiv.src;
			imgLink = imgLink.replace(/url\(\"(.*?)\"\)/, "$1");
			if(imgLink==""){
				return;
			}
			var bid = imgLink.replace(/.*?\&id=(\d+).*/,"$1");
			var cid = imgLink.replace(/.*?\&n=(\d+).*/,"$1");
			runOnMainContext(
				downloadImage.toString()
				+imgDownloaded.toString()
				+"downloadImage('"+imgLink+"',"+bid+","+cid+");"
				+enforceStyle.toString()
				+"enforceStyle();"
			);
			imgDiv.parentElement.id="maincontent";
			imgDiv.id="";
			var btn = document.createElement("button");
			btn.innerHTML='<a href="'+imgLink+'" download="faloo_'+bid+'_'+cid+'.txt" id="downloader">Tải ảnh</a>';
			btn.setAttribute("style", "position:fixed;right:10px;top:10px;font-size:20px;padding:6px;z-index:10");			
		}
		document.body.appendChild(btn);
	}
}
window.addEventListener("load", function() {
	setInterval(checkToScan, 700);
});