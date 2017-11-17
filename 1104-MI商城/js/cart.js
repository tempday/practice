/**
 * Created by lglong519 on 2017-11-18.
 */
DM('.action').addEvent('click',function(){
	var src=DM.getEventSrc(1);
	if(src.nodeName=='I'){
		DM('.shopList')[0].removeChild(DM(src).sup(1)[0]);
		checkTable();
	}
});
function checkTable(){
	if(DM('#myCart')[0].rows.length<2){
		DM('#myCart').removeClass('display');
		DM('.counter').removeClass('display');
		DM('.emptyCart').addClass('display');
	}
}

//显示/隐藏侧边栏
window.onscroll=function(){
	var wTop=document.body.scrollTop+window.innerHeight;
	var h=DM('#myCart')[0].offsetTop+parseInt(window.getComputedStyle(DM('#myCart')[0]).height)+65;
	if(wTop<h){
		DM('.counter').addClass('hook');
	}else{
		DM('.counter').removeClass('hook');
	}
};