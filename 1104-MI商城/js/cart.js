/**
 * Created by lglong519 on 2017-11-18.
 */

//删除商品
DM('.action').addEvent('click',function(){
	var src=DM.getEventSrc(1);
	if(src.nodeName=='I'){
		DM('.confirm').addClass('display');
		DM('.sure','.confirm')[0].onclick=function(){
			DM('.shopList')[0].removeChild(DM(src).sup(1)[0]);
			DM('.confirm').removeClass('display');
			checkTable();
			return false;
		}
	}
});

function checkTable(){
	if(DM('#myCart')[0].rows.length<2){
		DM('#myCart').removeClass('display');
		DM('.counter').removeClass('display');
		DM('.emptyCart').addClass('display');
	}
}

//切换结算栏的位置
window.onscroll=function(){
	var wTop=document.body.scrollTop+window.innerHeight;
	var h=DM('#myCart')[0].offsetTop+parseInt(window.getComputedStyle(DM('#myCart')[0]).height)+65;
	if(wTop<h){
		DM('.counter').addClass('hook');
	}else{
		DM('.counter').removeClass('hook');
	}
};

//退出模态框
DM('.cancel','.confirm')[0].onclick=DM('.mask','.confirm')[0].onclick=DM('.close','.confirm')[0].onclick=function(){
	DM('.confirm').removeClass('display');
	return false;
};

