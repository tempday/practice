/**
 * Created by lglong519 on 2017-11-18.
 */

//
//checkTable()
account();

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
	DM('.shopList').all('b').addEvent('click',function(){
		if(/check/i.test(this.className)){
			this.className='';
		}else{
			this.className='check';
		}
		checkIsAll();
		account();
	});

	//数量+1和-1
	DM('.num','.shopList').addEvent('click',function(){
		var src=DM.getEventSrc(1);
		if(src.nodeName=='A'){
			var tr=DM(src).sup(2)[0],
				i=DM('input',tr).val();
			src.className=='left'?
				i>1&&DM('input',tr).val(--i):
				DM('input',tr).val(++i);
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
}

//合计总价
function account(){
	var n=0,sum=0,trNum=0,p;
	DM('.shopList').all('tr').each(function(i,tr){
		trNum++;
		//小计=单价x数量
		p=parseFloat(DM('.price',tr).html())*DM('input',tr).val();
		//小计
		DM('.count',tr).html(p+'元');
		//判断当前商品是否勾选
		if(/check/i.test(DM('b',tr)[0].className)){
			n++;
			sum+=p;
		}
	});
	//商品数量
	DM('#cNum').html(trNum);
	//已选
	DM('#sNum').html(n);
	//总价
	DM('#amount').html(sum);
	n>0?DM('#checkout').addClass('active'):DM('#checkout').removeClass('active');
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
//添加购物车
function addToCart(){
	DM('.recShops').all('li').addEvent('click',function(){
		src=DM.getEventSrc(1);
		var data={};
		data.pid=this.getAttribute('data-pid');
		data.pic=this.children[0].src;
		data.pname=DM('h4',this).html();
		data.price=parseFloat(DM('span',this).html());
		data.pnum=1;
		var trs=DM('#shopList').html();
		if(/addToCart/.test(src.className)){
			var tr=templet[1];
			if(trs.indexOf(data.pname)!=-1){
				var ipt=DM('#shopList').getByAttr('data-pid',data.pid).all('input');
				ipt.val(ipt.val()*1+1);
			}else{
				for(var k in data){
					reg=new RegExp('\\$\\{'+k+'\\}','gm');
					tr=tr.replace(reg,data[k]);
				}
				DM('#shopList').html(trs+tr);
			}
			account();
			checkTable();
			attachEvents();
			DM('.tips',this).addClass('display');
			setTimeout(function(){
				DM('.tips',this).removeClass('display');
			}.bind(this),1300);
		}
		//?刷新购物车列表,将信息发送后台,将信息写入cookie
	});
}
//获取模板
var templet=[];

//验证个人信息----------------------------------------
fetchInfo();
function fetchInfo(){
	//读取cookie
	var ck=DM.cookie('userInfo');
	//如果ck内容不为空,则读取用户名和商品信息
	if(ck){
		try{
			ck=eval(ck);
		}catch (e){
			ck=[];
		}
		DM.ajax({
			url:'rec-tpl.html',
			success:function(data){
				var li=data.match(/<li(\s|\S)*?<\/li>/g)[0],
						tr=data.match(/<tr(\s|\S)*?<\/tr>/g)[0],
						lis='',
						trs='';
				templet[0]=li;
				templet[1]=tr;
				//购物车列表
				for(var i=1,reg;i<ck.length;i++){
					//遍历获取商品信息,并将信息写入tr模板中
					for (var k in ck[i]){
						reg=new RegExp('\\$\\{'+k+'\\}','gm');
						tr=tr.replace(reg,ck[i][k]);
					}
					trs+=tr;
				}
				DM.ajax({
					url: 'data/getRec.php',
					dataType:'json',
					success: function (data) {
						//推荐列表
						for(var i= 0,oneLi,reg;i<data.length;i++){
							oneLi=li;
							//遍历获取商品信息,并将信息写入li模板中
							for (var k in data[i]){
								reg=new RegExp('\\$\\{'+k+'\\}','gm');
								oneLi=oneLi.replace(reg,data[i][k]);
							}
							lis+=oneLi;
						}
						DM('.recShops','.section').html(lis);
						addToCart();
					}
				});

				DM('#shopList').html(trs);
				account();
				checkTable()&&attachEvents();
			}
		});

	}
	//ss=sessionStorage.getItem(user),
	//ls=localStorage.getItem('temporaryUser'),
}

function getRec(){
	DM.ajax({
		url: 'data/getRec.php',
		dataType:'json',
		success: function (data) {
			console.log(data);
		}
	});
}
//getRec();
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

