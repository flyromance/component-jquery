// zxx.albumshow.js by zhangxinxu welcome to visit my personal website http://www.zhangxinxu.com/
// 2010-05-05 v1.0
// 多图片幻灯片显示，无图片无CSS，纯粹CSS
var ID = function(id){
	return document.getElementById(id);
};
var cache = {};
var fnPicShow = function(urlArr,curId){
	var id = curId, l = urlArr.length;
	//alert(id);
	var prev, next;
	if(id === 0){
		prev = "";	
	}else{
		prev = id-1;	
	}
	if(id === l-1){
		next = "";	
	}else{
		next = id+1;	
	}
	//滚动高度
	var sTop = function() {   
		var scrollPos = 0;   
		var d = document.documentElement, b = document.body, w = window;
		if (typeof w.pageYOffset !== "undefined") {   
		 scrollPos = w.pageYOffset;   
		}   
		else if (typeof document.compatMode !== "undefined" && document.compatMode !== "BackCompat") {   
		 scrollPos = d.scrollTop;   
		}   
		else if (typeof b !== "undefined") {   
		 scrollPos = b.scrollTop;   
		}   
		return scrollPos; 
	}();
	//显示区域的高度和宽度
	var cHeight = function(){
		if(document.all){
			return document.compatMode == "CSS1Compat"? document.documentElement.clientHeight : document.body.clientHeight;
		}else{
			return self.innerHeight;
		}
	}();
	var cWidth = function(){
		if(document.all){
			return document.compatMode == "CSS1Compat"? document.documentElement.clientWidth : document.body.clientWidth;
		}else{
			return self.innerWidth;
		}
	}();
	
	var blankHeight = cHeight > document.body.scrollHeight? cHeight : document.body.scrollHeight;
	
	//创建空div
	var boxdiv = document.createElement("div");
	boxdiv.id = "appendBox";
	if(!ID("appendBox")){
		document.getElementsByTagName("body")[0].appendChild(boxdiv);
	}else{
		ID("appendBox").style.display = "block";
	}
	//图片预加载
	ID("appendBox").innerHTML = '<div id="blank" style="width:100%; height:'+blankHeight+'px; background:black; position:absolute; left:0; top:0; opacity:0.4; filter:alpha(opacity=40); z-index:799;"></div><div style="position:absolute; z-index:800; padding:18px; background:white; left:'+((cWidth-100)/2 - 18)+'px; top:'+(sTop + (cHeight-100)/2 - 18)+'px;" id="appendPicBox"><div style="line-height:20px; padding:40px 0; text-align:center;">图片加载中……</div></div>';
	
	var preloader = new Image();
	preloader.src = urlArr[id];
	//图片的高宽
	var w = preloader.width, h = preloader.height;
	if(!w){
		preloader.onload = function() {
			//获取图片的宽度
			w = preloader.width;
			h = preloader.height;
			cache["cache_"+id] = true;
			callback();
		};
	}
	var callback = function(){
		var scale = w/h;
		if(w > cWidth){
			w = cWidth - 40;
			h = w/scale;
		}
		if(h > cHeight){
			h = cHeight - 40;
			w = h * scale;
		}
		ID("appendBox").innerHTML = '<div id="blank" style="width:100%; height:'+blankHeight+'px; background:black; position:absolute; left:0; top:0; opacity:0.4; filter:alpha(opacity=40); z-index:799;"></div><div style="position:absolute; z-index:800; padding:18px; background:white;" id="appendPicBox"><img id="theShowPic" src="'+urlArr[id]+'" /><span id="closePicBtn" style="position:absolute; right:-3px; top:-2px; z-index:800; cursor:pointer; font-size:12px; background:black; color:white; opacity:0.8; padding:1px 2px;-moz-border-radius:2px;-webkit-border-radius:2px;border-radius:2px;">关闭</span><a title="查看上一张图片" id="picPrev" hidefocus="true" href="javascript:void(0);" rel="'+prev+'" style="width:50%; height:100%; background:url(xx.jpg); left:0; top:0; position:absolute; outline:0;"></a><a title="查看下一张图片" id="picNext" href="javascript:void(0);" rel="'+next+'" hidefocus="true" style="width:50%; height:100%; background:url(xx.jpg); right:0; top:0; position:absolute; outline:0;"></a><div id="picPrevRemind" style="position:absolute; width:56px; left:18px; top:-8000px;"><div style="border-bottom:3px solid; border-top-color:#fff; border-bottom-color:#fff; border-right:3px dotted transparent; border-left:none;"></div><div style="padding-left:5px; background:white; line-height:24px; font-size:14px; color:#666666;">上一张</div><div style="border-top:3px solid; border-top-color:#fff; border-bottom-color:#fff; border-right:3px dotted transparent; border-left:none;"></div></div><div id="picNextRemind" style="position:absolute; width:56px; right:18px; top:-8000px;"><div style="border-bottom:3px solid; border-top-color:#fff; border-bottom-color:#fff; border-left:3px dotted transparent; border-right:none;"></div><div style="padding-right:5px; text-align:right; background:white; line-height:24px; font-size:14px; color:#666666;">下一张</div><div style="border-top:3px solid; border-top-color:#fff; border-bottom-color:#fff; border-left:3px dotted transparent; border-right:none;"></div></div></div>';	
		
		//给左右切换区域定宽
		ID("picPrev").style.height = ID("picNext").style.height = h + 18 + "px";
		ID("picPrev").style.width = ID("picNext").style.width = w/2 + 18 + "px";
		//居中定位
		var t = sTop + (cHeight-h)/2 - 18, l = (cWidth-w)/2 - 18;
		ID("appendPicBox").style.left = l + "px";
		ID("appendPicBox").style.top = t + "px";
		
		//显示左右箭头
		ID("picPrev").onmouseover = function(){
			if(this.rel){
				ID(this.id + "Remind").style.top = h/3 + "px";	
				this.title = "查看上一张图片";
			}else{
				this.title = "这是第一张图片";
			}
		};
		ID("picNext").onmouseover = function(){
			if(this.rel){
				ID(this.id + "Remind").style.top = h/3 + "px";	
				this.title = "查看下一张图片";	
			}else{
				this.title = "这是最后一张图片";	
			}
		};
		ID("picPrev").onmouseout = function(){
			ID(this.id + "Remind").style.top = "-8000px";	
		};
		ID("picNext").onmouseout = function(){
			ID(this.id + "Remind").style.top = "-8000px";	
		};
		ID("picPrev").onclick = function(){
			var rel = this.rel;
			if(rel !== ""){
				rel = parseInt(rel);
				fnPicShow(urlArr,rel);	
			}
			return false;
		};
		ID("picNext").onclick = function(){
			var rel = parseInt(this.rel);
			if(rel){
				fnPicShow(urlArr,rel);	
			}
			return false;
		};
		//关闭
		ID("blank").onclick = function(){
			ID("appendBox").style.display = "none";
		};
		ID("closePicBtn").onclick = function(){
			ID("appendBox").style.display = "none";
		};
	}
	if(cache["cache_"+id] || w){
		callback();
	}
};
