/**
 * Created by lglong on 2017-10-24.
 */
~function(){
	setBodyHeight();
	window.onresize=setBodyHeight;
	function setBodyHeight(){
		var hei=window.innerHeight||document.documentElement.clientHeight;
		document.body.style.height=hei+"px";
	}
	var imgBtn=document.getElementById("imgBtn");
	var loadimg=document.getElementById("loadimg");
	var close=document.getElementById("close");
	var search=document.getElementById("search");
	var keywords=document.getElementById("keywords");
	var keyslist=document.getElementById("keyslist");
	var picMask=document.getElementById("picMask");
	var upload=document.getElementById("upload");
	keyslist.onclick=function(){
		//console.log(this);
		var src=event.srcElement||event.target;
		if(src.nodeName=="LI"){
			keywords.value=src.innerHTML;
		}
		this.style.display="none";
	}
	
	keywords.onfocus=keywords.onkeyup=keywords.onchange=getWords;
	function getWords(){
		var key=keywords.value.replace(/^\s*|\s*$/g,"");
		if(key){
			//创建script标签
			var oScript = document.createElement("script");
			oScript.src = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?wd="+key+"&cb=callback";
			document.body.appendChild(oScript);
			document.body.removeChild(oScript);
		}else{
			keyslist.innerHTML="";
			keyslist.style.display="none";
		}
    }
	function callback(data){
		var str="";
		if(data.s.length){
			for(var i=0;i<data.s.length;i++){
			str += "<li>"+data.s[i]+"</li>";
			}
			keyslist.innerHTML=str;
			keyslist.style.display="block";
		}else{
			keyslist.style.display="none";
		}
	}
	window.callback=callback;//global
	imgBtn.onclick=function () {
		loadimg.style.display="block";
		return true;
	}
	close.onclick=function () {
		loadimg.style.display="none";
		return true;
	}
	search.onclick=function () {
		var key=keywords.value.replace(/^\s*|\s*$/g,"");
		key&&(location.href="http://www.baidu.com/s?wd="+key);
	}
	document.body.onclick=hideFile;
	//imgBtn弹窗按钮,loadimg被隐藏对象
	//点击任意地方关闭keyslist
	function hideFile(){
		var src=event.srcElement||event.target;
		if(src==this){
			loadimg.style.display="none";
			keyslist.style.display="none";
			return;
		}else if(src!=imgBtn){
			var bool=true;
			var boolKw=true;
			do{
				src==keyslist||src==keywords&&(boolKw=false);
				src=src.parentNode;//无关先后,loadimg被撑大的实际无法被点击
				src==loadimg&&(bool=false);
			}while(src!=this);
			if(bool&&loadimg.style.display=="block"){
				loadimg.style.display="none";
			}
			if(boolKw&&keyslist.style.display=="block"){
				keyslist.style.display="none";
			}
		}else{
			keyslist.style.display="none";
		}
	}
	function getFileUrl(sourceId) {
		var url;
		if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
			url = document.getElementById(sourceId).value;
		} else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox 
			url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
		} else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome 
			url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
		}
		return url;
	}

	/** 
	* 将本地图片 显示到浏览器上 
	*/ 
	function preImg(sourceId, targetId) {
		var url =document.getElementById(sourceId).value;
		//console.log(url);
		var reg=new RegExp("\.","g"),
			result,
			index;
		while((result=reg.exec(url))!=null){
			result[0]=="."&&(index=result.index);
		}
		//console.log(index);
		if(!index){
			return false;
		}
		if(url.slice(index+1).match(/png|jpg|jpeg|bmp|gif|ico/i)==null){
			return false;
		}
		//验证url结束
		url = getFileUrl(sourceId);
		var imgPre = document.getElementById(targetId);
		imgPre.src = url;
		return true;
	}
	upload.onchange=function(){
		if(preImg(this.id, "uploadPic")){
			picMask.style.display="block";
		}else{
			picMask.style.display="none";
		}
	}
}();
