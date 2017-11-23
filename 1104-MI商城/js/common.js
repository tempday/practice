/**
 * Created by lglong519 on 2017-11-24.
 */
var validFuns={
	//获取本地储存数据 或 获取cookie
	getStorage:function(n){
		//如果是0 获取本地数据,如果是1获取cookie
		n=n||0;
		var st=n?DM.cookie('mCart_userInfo'):
			localStorage.getItem('mCart_userInfo');
		//如果st内容不为空,则读取商品数据
		if(st) {
			try {
				st = eval(st);
			} catch (e) {
				st = [];
			}
		}else{
			st = [];
		}
		return st.length>0&&st[0].username?st:!1;
	},
	//判断登录状态函数
	isOnline:function(){
		var ck=this.getStorage(1);
		if(ck&&ck[0].username!='_temporaty'){
			DM('#user').html(ck[0].username);
			DM('.onLine').removeClass('offLine');
			DM('.nav-info').addClass('offLine');
			DM('#login').css('display','none');
			return !0;
		}else{
			DM('#user').html("");
			DM('.onLine').addClass('offLine');
			DM('.nav-info').removeClass('offLine');
			DM('#login').css('display','block');
			return !1;
		}
	}
};
