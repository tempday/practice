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
	imgBtn.onclick=function () {
		loadimg.style.display="block";
		return true;
	}
	close.onclick=function () {
		loadimg.style.display="none";
		return true;
	}
}();
