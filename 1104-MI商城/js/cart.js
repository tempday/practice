/**
 * Created by lglong519 on 2017-11-18.
 */

//获取模板
var templet={};
getTemplet();
//设置登录状态
isOnline();
//获取模板函数
function getTemplet(){
	DM.ajax({
		url:'rec-tpl.html',
		success:function(data){
			templet.li=data.match(/<li(\s|\S)*?<\/li>/g)[0];
			templet.tr=data.match(/<tr(\s|\S)*?<\/tr>/g)[0];
			//成功获取立即设置推荐列表
			setRecList();
			//初始化购物车
			initCart();
		}
	});
}
//设置推荐列表函数
function setRecList() {
	//推荐列表
	DM.ajax({
		url: 'data/getRec.php',
		dataType:'json',
		success:function(data){
			for(var i= 0,oneLi,lis='',reg;i<data.length;i++){
				oneLi=templet.li;
				//遍历获取商品信息,并将信息写入li模板中
				for (var k in data[i]){
					reg=new RegExp('\\$\\{'+k+'\\}','gm');
					oneLi=oneLi.replace(reg,data[i][k]);
				}
				lis+=oneLi;
			}
			DM('.recShops','.section').html(lis);
			//生成推荐列表后设置 加入购物车 按钮的点击事件
			addToCart();
		}
	});

}
//购物车操作-----------------------------------------------
//点击事件
function attachEvents(){

	//全选和全不选
	DM('#selectAll')[0].onclick=function(){
		if(/check/i.test(this.className)){
			DM('.select').all('b').removeClass('check');
		}else{
			DM('.select').all('b').addClass('check');
		}
		account();
	};
	//单选
	DM('#shopList').all('b').each(function(){
		this.onclick=function(){
			if(/check/i.test(this.className)){
				this.className='';
			}else{
				this.className='check';
			}
			checkIsAll();
			account();
		}
	});

	//数量+1和-1
	DM('.num','#shopList').each(function(i){
		this.onclick=function(){
			var src=DM.getEventSrc(1);
			if(src.nodeName=='A'){
				var ipt=DM('#shopList').sub(DM.index(this.parentNode)).all('input'),
						i=ipt.val();
				src.className=='left'?
				i>1&&ipt.val(--i):
						ipt.val(++i);
				account();
			}
		};
		DM('input',this)[0].onchange=account;
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
}

//合计总价
function account(){
	var n=0,sum=0,trNum=0,data='',p;
	DM('.shopList').all('tr').each(function(i,tr){
		trNum++;
		//小计=单价x数量
		var price=parseFloat(DM('.price',tr).html()),
			pnum=DM('input',tr).val();
		//小计
		p=price*pnum;
		DM('.count',tr).html(p+'元');
		//判断当前商品是否勾选
		if(/check/i.test(DM('b',tr)[0].className)){
			n++;
			sum+=p;
		}
		data+='{"pid":"'+tr.getAttribute('data-pid')+'","pic":"'+DM('img',tr)[0].src+'","pname":"'+DM('.shopName',tr).html()+'","price":"'+price+'","pnum":"'+pnum+'"},';
	});

	//商品数量
	DM('#cNum').html(trNum);
	//已选
	DM('#sNum').html(n);
	//总价
	DM('#amount').html(sum);
	n>0?DM('#checkout').addClass('active'):DM('#checkout').removeClass('active');

	//商品变动后更新用户的数据库
	data=data.replace(/},$/,"}");
	var user=DM('#user').html()||'_temporaty';
	data='[{"username":"'+user+'"},'+data+']';
	DM.cookie('mCart_userInfo',data);
	if(DM('#user').html()){
		Docms.ajax({
			type:'post',
			url:'data/upDateInfo.php',
			data:{'json':data},
			success:function(data){
				console.log(data);
			}
		});
	}else{
		localStorage.setItem('mCart_userInfo',data);
	}
}
//检测是否全选
function checkIsAll(){
	var bs=DM('.shopList').all('b').elems,isAll=true;
	for(var i=0;i<bs.length;bs[i++].className!='check'&&(isAll=false));
	isAll?DM('#selectAll').addClass('check'): DM('#selectAll').removeClass('check');
}
//判断购物车的状态
function checkTable(){
	if(DM('#myCart')[0].rows.length<2){
		DM('#myCart').addClass('hide');
		DM('.counter').removeClass('display');
		DM('.emptyCart').addClass('display');
		return !1;
	}else{
		DM('#myCart').removeClass('hide');
		DM('.counter').addClass('display');
		DM('.emptyCart').removeClass('display');
		return !0;
	}
}
//推荐列表点击事件,添加购物车
function addToCart(){
	DM('#recShops').all('li').addEvent('click',function(){
		var data={}, src=DM.getEventSrc(1),li=src;
		while(li.nodeName!='LI'){
			li=li.parentNode;
		}
		//console.log(li);
		data.pid=li.getAttribute('data-pid');
		data.pic=li.children[0].src;
		data.pname=DM('h4',li).html();
		data.price=parseFloat(DM('span',li).html());
		data.pnum=1;
		var trs=DM('#shopList').html();
		if(/addToCart/.test(src.className)){
			var tr=templet.tr,
					str='data-pid="'+data.pid+'"';
			console.log(str);
			if(trs.indexOf(str)!=-1){//ie7判断失败
				var ipt=DM('#shopList').getByAttr('data-pid',data.pid).all('input');
				console.log(ipt.val());
				ipt.val(ipt.val()*1+1);
			}else{
				for(var k in data){
					reg=new RegExp('\\$\\{'+k+'\\}','gm');
					tr=tr.replace(reg,data[k]);
				}
				DM('#shopList').html(trs+tr);
			}
			//提示添加成功,并在1秒后自动隐藏
			DM('.tips',li).addClass('display');
			setTimeout(function(){
				DM('.tips',li).removeClass('display');
			}.bind(li),1300);

			//添加购物车后重新计算商品总价
			account();
			//设置购物的显示状态
			checkTable();
			//给新列表设置点击事件
			attachEvents();
		}
		//?刷新购物车列表,将信息发送后台,将信息写入cookie
	});
}

//fetchInfo();
//根据cookie初始化购物车函数
function initCart(){
	//读取cookie
	var ck=getCookie()||getSession();
	if(ck){
		//购物车列表
		for(var i=1,reg,trs='',tr;i<ck.length;i++){
			tr=templet.tr;
			//遍历获取商品信息,并将信息写入tr模板中
			for (var k in ck[i]){
				reg=new RegExp('\\$\\{'+k+'\\}','gm');
				tr=tr.replace(reg,ck[i][k]);
			}
			trs+=tr;
		}
		DM('#shopList').html(trs);
	}else{
		DM('#shopList').html("");
	}
	//初始化购物车后设置显示状态
	checkTable();
	//计算商品总价
	account();
	//给新列表设置点击事件
	attachEvents();
	//ss=sessionStorage.getItem(user),
	//ls=localStorage.getItem('temporaryUser'),
}

//判断登录状态函数
function isOnline(){
	var ck=getCookie();
	if(ck&&ck[0].username!='_temporaty'){
		DM('#user').html(ck[0].username);
		DM('.onLine').removeClass('offLine');
		DM('.nav-info').addClass('offLine');
		DM('#login').css('display','none');

	}else{
		DM('#user').html("");
		DM('.onLine').addClass('offLine');
		DM('.nav-info').removeClass('offLine');
		DM('#login').css('display','block')
	}
}
//获取cookie函数
function getCookie(){
	//读取cookie
	var ck=DM.cookie('mCart_userInfo');
	//如果ck内容不为空,则读取用户名
	if(ck) {
		try {
			ck = eval(ck);
		} catch (e) {
			ck = [];
		}
	}else{
		ck = [];
	}
	//只返回用户名有效的数组,否则返回空数组
	return ck.length>0&&ck[0].username?ck:!1;
}
//获取本地储存数据
function getSession(){
	var ls=localStorage.getItem('mCart_userInfo');
	//如果ls内容不为空,则读取商品数据
	if(ls) {
		try {
			ls = eval(ls);
		} catch (e) {
			ls = [];
		}
	}else{
		ls = [];
	}
	return ls.length>0&&ls[0].username?ls:!1;
}
//其他----------------------------------------------------------------
DM('#logout').addEvent('click',function(){
	//清除cookie
	DM.cookie('mCart_userInfo','','s1');
	//设置登录的状态(根据cookie判断)
	isOnline();
	//清除localStorage
	localStorage.setItem('mCart_userInfo','');
	//再次初始化购物车
	initCart();
	//重新判断购物车的状态(显示购物车 或 显示空提示)
	checkTable();
});
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
