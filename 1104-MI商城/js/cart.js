/**
 * Created by lglong519 on 2017-11-18.
 */

//购物车操作-----------------------------------------------
//全选和全不选
DM('#selectAll').addEvent('click',function(){
	if(/check/i.test(this.className)){
		DM('.select').all('b').removeClass('check');
	}else{
		DM('.select').all('b').addClass('check');
	}
	account();
});
//单选
DM('.shopList').all('b').addEvent('click',function(){
	if(/check/i.test(this.className)){
		this.className='';
	}else{
		this.className='check';
	}
	checkIsAll();
	account();
});

account();
//检测是否全选
function checkIsAll(){
	var bs=DM('.shopList').all('b').elems,isAll=true;
	for(var i=0;i<bs.length;bs[i++].className!='check'&&(isAll=false));
	isAll?DM('#selectAll').addClass('check'): DM('#selectAll').removeClass('check');
}
//数量+1和-1
DM('.num','.shopList').addEvent('click',function(){
	var src=DM.getEventSrc(1);
	if(src.nodeName=='A'){
		var tr=DM(src).sup(2)[0];
		var p=parseFloat(DM('.price',tr).html());
		var i=DM('input',tr).val();
		if(src.className=='left'){
			if(i>1){
				DM('input',tr).val(--i);
				DM('.count',tr).html(p*DM('input',tr).val()+'元');
			}
		}else{
			DM('input',tr).val(++i);
			DM('.count',tr).html(p*DM('input',tr).val()+'元');
		}
		account();
	}
});
//删除商品
DM('.action').addEvent('click',function(){
	var src=DM.getEventSrc(1);
	if(src.nodeName=='I'){
		DM('.confirm').addClass('display');
		DM('.sure','.confirm')[0].onclick=function(){
			DM('.shopList')[0].removeChild(DM(src).sup(1)[0]);
			DM('.confirm').removeClass('display');
			account();
			checkTable();
			return !1;
		}
	}
});

//合计总价
function account(){
	var n=0,p=0,c=0;
	DM('.shopList').all('tr').each(function(i,tr){
		c++;
		if(/check/i.test(DM('b',tr)[0].className)){
			n++;
			p+=parseFloat(DM('.count',tr).html());
		}
	});
	//商品数量
	DM('#cNum').html(c);
	//已选
	DM('#sNum').html(n);
	//总价
	DM('#amount').html(p);
	n>0?DM('#checkout').addClass('active'):DM('#checkout').removeClass('active');
}
function checkTable(){
	if(DM('#myCart')[0].rows.length<2){
		DM('#myCart').addClass('hide');
		DM('.counter').removeClass('display');
		DM('.emptyCart').addClass('display');
	}else{
		DM('#myCart').removeClass('hide');
		DM('.counter').addClass('display');
		DM('.emptyCart').removeClass('display');
	}
}


//其他----------------------------------------------------------------
//切换结算栏的位置
window.onresize=window.onscroll=function(){
	var wTop=DM.wTop()+DM.wHeight();
	var h=DM('#myCart')[0].offsetTop+DM('#myCart').height()+65;
	if(wTop<h){
		DM('.counter').addClass('hook');
	}else{
		DM('.counter').removeClass('hook');
	}
};

//退出模态框
DM('.cancel','.confirm')[0].onclick=DM('.mask','.confirm')[0].onclick=DM('.close','.confirm')[0].onclick=function(){
	DM('.confirm').removeClass('display');
	return !1;
};

