/**
 * Created by lglong519 on 2017.
 */
//表单验证
;!function(){
	//验证用户名和密码
	DM('.userInfo input').addEvent('blur',function(){
		validPwd(this);
	});
	//向服务器发送请求验证用户名是否已存在
	DM('#username').addEvent('blur',function(){
		validUser(this);
	});
	//注册按钮
	DM('#register').addEvent('click',function(){
		var a=validUser(DM('#username')[0]),
				b=validPwd(DM('#password')[0]),
				c=validPwd(DM('#reconfirm')[0]);
		if(b&&c){
			//先等待验证用户名返回的结果,再向服务器提交注册信息
			!function(){
				var arg=arguments;
				if(!a.length){
					setTimeout(function(){
						//console.log(a.length);
						arg.callee();
					},100);
				}else{
					if(a[0]){
						var user=DM('#username').val();
						Docms.ajax({
							type:'post',
							url:'data/register.php',
							data:{'user':user,
								'pwd':DM('#password').val()
							},
							success:function(data){
								if(data=='success'){
									if(validFuns.getStorage(0)){
										var data=localStorage.getItem('mCart_userInfo').replace('_temporaty',user);
										DM.cookie('mCart_userInfo',data);
										//_temporary
										Docms.ajax({
											type: 'post',
											url: 'data/upDateInfo.php',
											data:{'json':data},
											success:function(data){
												console.log(data);
											}
										});
										//如果本地储存没有数据,只写入用户名
									}else{
										DM.cookie('mCart_userInfo','[{"username":"'+user+'"}]');
									}
									localStorage.setItem('mCart_userInfo','');
									document.location='log_success.html#register';
								}else{
									alert('注册失败,请稍后重试');
								}
							}
						});
					}
				}
			}();
		}
	});
	//登录按钮
	DM('#login').addEvent('click',function(){
		var a=validUser(DM('#username')[0]),
				b=validPwd(DM('#password')[0]);
		if(a&&b){
			var user=DM('#username').val(),data='';
			if(validFuns.getStorage(0)){
				data=localStorage.getItem('mCart_userInfo').replace('_temporaty',user);
			}
			Docms.ajax({
				type:'post',
				url:'data/login.php',
				data:{'user':DM('#username').val(),
					'pwd':DM('#password').val(),
					'json':data
				},
				success:function(data){
					if(data){
						var str='[{"username":"'+user+'"},';
						(/pid/i.test(data))?
							str+=data.slice(1):
							str+=']';
						DM.cookie('mCart_userInfo',str);
						DM('#error').removeClass('display');
						localStorage.setItem('mCart_userInfo','');
						document.location='log_success.html#login';
					}else{
						DM('#error').addClass('display');
					}
				}
			});
		}
	});
	//验证用户名函数
	function validUser(obj){
		if(/^[^\s]{3,}$/.test(obj.value)){
			DM('.userInfo').sub(DM.index(obj)+1).removeClass('display');
			var a=[];
			Docms.ajax({
				type:'post',
				url:'data/validName.php',
				data:{'user':obj.value},
				success:function(data){
					//返回1:通过验证
					a.push(data);
					data?DM('.invalid').removeClass('display'):
							DM('.invalid').addClass('display');
				}
			});
			return a;
		}
		DM('.userInfo').sub(DM.index(obj)+1).addClass('display');
		return !1;
	}
	//验证密码函数
	function validPwd(obj){
		var reg=/^[\w]{6,}$/;
		if(obj.type=='password'){
			var result;
			if(obj.id=='reconfirm'){
				result=obj.value===DM('#password').val()&&reg.test(obj.value);
				return check(obj,result);
			}else{
				result=reg.test(obj.value);
				return check(obj,result);
			}
		}
		function check(obj,result){
			if(result){
				DM('.userInfo').sub(DM.index(obj)+1).removeClass('display');
				return !0;
			}else{
				DM('.userInfo').sub(DM.index(obj)+1).addClass('display');
				return !1;
			}
		}
	}

}()


//注册||登录成功
;!function(){
	if(!DM('.seconds')[0]){
		return;
	}
	var anchor=location.hash,url;
	switch (true){
		case /register/.test(anchor):
			DM('.identity>h1').html('注册成功!');
			url='cart.html';
			break;
		case /login/.test(anchor):
			url='cart.html';
			DM('.identity>h1').html('登录成功!');
			break;
		default:
			DM('.identity>h1').html('请先登录!');
			DM('.noAnchor').html('登录界面');
			url='login.html';
	}
	var i=parseInt(DM('.seconds').html());
	setTimeout(function(){
		counter();
	},1000);
	function counter(){
		i--;
		DM('.seconds').html(i);
		if(i>0){
			setTimeout(function(){
				counter();
			},1000);
		}else{
			setTimeout(function(){
				document.location.href=url;
			},1000);
		}
	}
}();
