/**
 * Created by lglong on 2017-10-24.
 */
~function(){
	setBodyHeight();
	window.onresize=setBodyHeight;
	function setBodyHeight(){
		document.body.style.height=window.innerHeight+"px";
	}
	var imgBtn=document.getElementById("imgBtn");
	var loadimg=document.getElementById("loadimg");
	var close=document.getElementById("close");
	imgBtn.addEventListener('click', function (e) {
		loadimg.style.display="block";
		return true;
	}, false);
	close.addEventListener('click', function (e) {
		loadimg.style.display="none";
		return true;
	}, false);

}();
