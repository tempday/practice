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
	keyslist.onclick=function(){
		var src=event.srcElement||event.target;
		if(src.nodeName="LI"){
			keywords.value=src.innerHTML;
		}
	}
	keywords.onblur=function(){
		setTimeout(function(){
			keyslist.style.display="none";
		}, 200);
	}
	keywords.onfocus=keywords.onkeyup=getWords;
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
	function hideFile(){
		var src=event.srcElement||event.target;
		if(src!=this&&src!=imgBtn){
			var bool=true;
			do{
				src=src.parentNode;
				if(src==loadimg){
					bool=false;
					break;
				}
			}while(src!=this);
			if(bool&&loadimg.style.display=="block"){
				loadimg.style.display="none";
			}
		}
	}
}();
