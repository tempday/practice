/**
 * Created by lglong519 on 2017-11-04.
 */
!function(){

//输入框下拉
DM('#search')[0].onfocus=function(){
	DM(this).sup().addClass("hover");
};
DM('#search')[0].onblur=function(){
	DM(this.parentNode).removeClass("hover");
};
//导航栏下拉
DM('#navList')[0].onmouseover=function(){
	var src=DM.getEventSrc(1);
	var data=src.getAttribute("data-item-i")||src.parentNode.getAttribute("data-item-i");
	if(data){
		DM('#navDropdown').addClass('display');
		DM('#navDropdown').all('ul.current').removeClass('current');
		DM('ul','#navDropdown').fetch(data-1).addClass('current');
	}
};
DM('#navDropdown')[0].onmouseout=DM('#navList')[0].onmouseout=function(){
	var e=DM.getEventSrc();
	var y1=140-DM.wTop(),y2=y1+230,ms=e.clientY;
	if(ms>y2||ms<y1){
		DM('#navDropdown').removeClass('display');
	}
};

//常用属性
function InitialArgs(dir,interval,rate,wait){
	this.dir=dir;//控制方向
	this.interval=interval;//控制渐变动画的速度
	this.rate=rate;//控制渐变动画的速度
	this.wait=wait;//动画等待时间
	this.timer=null;//定时器
	this.autoTimer=null;
	this.isAuto=false;//是否开启自动移动
	this.count=0;
}
//商品列表左右切换构造函数
function SwitchLi(id,btnId){
	InitialArgs.call(this,false,10,1.1,5000);
	this.WIDTH=1226;
	this.mgLeft=1226;
	this.ul=document.getElementById(id);
	this.toggles=document.getElementById(btnId).children;
}



SwitchLi.prototype={
	move:function(){
		this.timer&&(clearTimeout(this.timer));
		this.mgLeft=Math.floor(this.mgLeft/this.rate);
		this.dir?
				DM(this.ul).css({marginLeft:-this.mgLeft}):
				DM(this.ul).css({marginLeft:this.mgLeft-this.WIDTH});
		if(this.mgLeft){
			this.timer=setTimeout(function(){
				this.move();
			}.bind(this),this.interval)
		}else{
			clearTimeout(this.timer);
			this.timer=null;
			this.mgLeft=this.WIDTH;
			this.dir=!this.dir;
			this.checkState();
			this.autoMove(this.isAuto);
		}
	},//判断是否自动移动
	autoMove:function(isAuto){
		this.isAuto=isAuto||false;
		if(this.isAuto){
			this.autoTimer=setTimeout(function(){
				this.move();
			}.bind(this),this.wait)
		}
	},//设置左右按钮的状态
	checkState:function(){
		if(this.dir){
			this.toggles[0].className="on";
			this.toggles[1].className="off";
		}else{
			this.toggles[0].className="off";
			this.toggles[1].className="on"
		}
	}
};

//根据id实例化SwitchLi
var liSwitch={
	init:function(id,btnId,isAuto){
		var newSwitch=new SwitchLi(id,btnId);
		newSwitch.autoMove(isAuto);
		newSwitch.checkState();
		newSwitch.toggles[0].onclick=function(){
			liSwitch.moveByDir(newSwitch,true);
		};
		newSwitch.toggles[1].onclick=function(){
			liSwitch.moveByDir(newSwitch,false);
		};
		return newSwitch;
	},//根据按钮左右方向移动
	moveByDir:function(Fun,bool){
		if(Fun.dir==bool){
			Fun.autoTimer&&(clearTimeout(Fun.autoTimer));
			Fun.move();
		}
	}
};
//5.明星单品
liSwitch.init("sliderSuper","sliderSuperBtn",true);
//11.推荐
liSwitch.init("sliderRec","recBtn");



//3.主广告轮播
function SliderDatas(){
	InitialArgs.call(this,true,35,1.1,6000);
	this.last=null;//上一个位置
	this.imgs=null;//所有图片
	this.focusLis=null;//焦点图标
	this.isFoc=false;//是否点击焦点图
	this.focIn=0;//当前焦点图下标
	this.alpha=100;//透明度
	this.incre=null;//透明度增加
	this.desc=null;//透明度减少
	this.inChanging=false;//动画是否正在执行
	this.classes={'imgs':null,'focus':null,'btns':null};//控制 图片/焦点/按钮 的状态的class
}
SliderDatas.prototype={
	move:function(){
		this.inChanging=true;
		this.last=this.count;
		if(this.isFoc){
			this.count=this.focIn;
		}else{
			this.dir?this.count++:this.count--;
			this.checkState();
		}
		this.imgs[this.last].style.zIndex=30;
		DM(this.imgs[this.count]).addClass(this.classes.imgs);
		DM(this.focusLis[this.count]).addClass(this.classes.focus);
		DM(this.focusLis[this.last]).removeClass(this.classes.focus);
		this.turnTo();
	},
	checkState:function(){
		if(this.count<0){
			this.count=this.imgs.length-1;
		}else if(this.count==this.imgs.length){
			this.count=0;
		}
	},
	//兼容ie7+,切换渐变动画
	turnTo:function(){
		this.alpha=Math.floor(this.alpha/this.rate);
		this.desc=this.alpha;
		this.incre=100-this.alpha;
		DM(this.imgs[this.last]).css('opacity',this.desc/100);
		DM(this.imgs[this.count]).css('opacity',this.incre/100);
		if(this.alpha){
			this.timer=setTimeout(function(){
				this.turnTo();
			}.bind(this),this.interval);
		}else{
			this.alpha=100;
			this.inChanging=false;
			this.isFoc=false;
			this.imgs[this.last].style.zIndex=0;
			DM(this.imgs[this.last]).removeClass(this.classes.imgs);
			this.autoMove(this.isAuto);
		}
	},
	autoMove:function(isAuto){
		this.isAuto=isAuto||false;
		if(this.isAuto){
			this.autoTimer=setTimeout(function(){
				this.dir=true;
				this.move();
			}.bind(this),this.wait)
		}
	}
};
//轮播通用结构:图片区:ul+li
var bannerSlider={
	init:function(imgs,btnL,btnR,pic,arr,isAuto){
		var mySli=new SliderDatas();
		mySli.imgs=DM(imgs).children;
		mySli.focusLis=DM(pic).all('li');
		mySli.classes={imgs:arr[0],focus:arr[1]};
		mySli.autoMove(isAuto);
		DM(btnL).addEvent('click',function(){
			if(!mySli.inChanging){
				clearTimeout(mySli.autoTimer);
				mySli.dir=false;
				mySli.move();
			}
		});
		DM(btnR).addEvent('click',function(){
			if(!mySli.inChanging){
				clearTimeout(mySli.autoTimer);
				mySli.dir=true;
				mySli.move();
			}
		});
		DM(pic).addEvent('click',function(){
			var src=DM.getEventSrc(1);
			if(src.nodeName=='LI'){
				if(!mySli.inChanging){
					clearTimeout(mySli.autoTimer);
					mySli.isFoc=true;
					mySli.focIn=DM.index(src);
					mySli.move();
				}
			}
		});
		return mySli;
	}
};
//3.主广告轮播初始化
bannerSlider.init('ul.banner','#sliderLeft','#sliderRight','#focusPic',['display','hover'],true);




//13.内容
function AmuseFun(){
	SliderDatas.call(this);
	this.sBox=null;
	this.olBox=null;
	this.width=null;
	this.mgLeft=0;
	this.dist=0;
}
AmuseFun.prototype.move=function(){
	this.inChanging=true;
	this.last=this.count;
	if(this.isFoc){
		this.count=this.focIn;
	}else{
		this.dir?this.count++:this.count--;
		SliderDatas.prototype.checkState.call(this);
	}
	DM(this.focusLis[this.count]).addClass(this.classes.focus);
	DM(this.focusLis[this.last]).removeClass(this.classes.focus);
	this.desc=this.dist=Math.abs(this.count-this.last)*296;
	this.turnTo();
};
AmuseFun.prototype.turnTo=function(){
	this.desc=Math.floor(this.desc/this.rate);
	this.incre=this.dist-this.desc;
	if(this.count-this.last>0){
		this.mgLeft=this.last*296+this.incre;
	}else if(this.count-this.last<0){
		this.mgLeft=this.last*296-this.incre;
	}else{
		return;
	}
	this.olBox.style.marginLeft=-this.mgLeft+'px';
	if(this.desc){
		this.timer=setTimeout(function(){
			this.turnTo();
		}.bind(this),this.interval);
	}else{
		this.inChanging=false;
		this.isFoc=false;
	}
};
var amuseSlider={
	init:function(sBox,sn,cls){
		var mySli=new AmuseFun();
		mySli.interval=10;
		//获取单个外容器li
		mySli.sBox=DM(sBox).getByAttr('data-item-i',sn)[0];
		//获取内容器ol
		mySli.olBox=DM(mySli.sBox).sub('ol')[0];
		mySli.imgs=mySli.olBox.children;
		mySli.width=296*mySli.imgs.length+'px';
		//焦点图
		mySli.focusLis=DM(mySli.sBox).sub('.focusLis').children;
		mySli.classes.focus=cls;
		//左侧按钮
		DM(mySli.sBox).getByAttr('data-pos','left').addEvent('click',function(){
			if(!mySli.inChanging){
				clearTimeout(mySli.autoTimer);
				mySli.dir=false;
				mySli.move();
			}
		});
		//右侧侧按钮
		DM(mySli.sBox).getByAttr('data-pos','right').addEvent('click',function(){
			if(!mySli.inChanging){
				clearTimeout(mySli.autoTimer);
				mySli.dir=true;
				mySli.move();
			}
		});
		//焦点图点击事件
		DM(mySli.sBox).all('.focusLis').addEvent('click',function(){
			var src=DM.getEventSrc(1);
			if(src.nodeName=='LI'){
				if(!mySli.inChanging){
					clearTimeout(mySli.autoTimer);
					mySli.isFoc=true;
					mySli.focIn=DM.index(src);
					mySli.move();
				}
			}
		});
		return mySli;
	}
};
//图书
amuseSlider.init('#amuseBox','1','hover');
//主题
amuseSlider.init('#amuseBox','2','hover');
//游戏
amuseSlider.init('#amuseBox','3','hover');
//应用
amuseSlider.init('#amuseBox','4','hover');




//商品主分类鼠标悬浮切换函数
// data是可选项数组["class1,"class2"],可以自定义class的值,第一个元素指向标签,第二个指向内容
function tabsOnAndOff(tabsId,optionsId,data){
	data=data||[];
	data[0]||(data[0]="hover");
	data[1]||(data[1]="display");
	DM(tabsId)[0].onmousemove=function(){
		var src=DM.getEventSrc(1);
		var attr=src.getAttribute("data-item-i");
		if(attr){
			DM('li.'+data[0],tabsId).removeClass(data[0]).getElems(src).addClass(data[0]);
			DM('ul.'+data[1],optionsId).removeClass(data[1]).getElems("ul",optionsId).fetch(attr).addClass(data[1]);
		}
	};
}
//6.家电
tabsOnAndOff("#appTabs","#appOptions");
//7.智能
tabsOnAndOff("#intelTabs","#intelOptions");
//8.搭配
tabsOnAndOff("#combiTabs","#combiOptions");
//9.配件
tabsOnAndOff("#pieTabs","#pieOptions");
//10.周边
tabsOnAndOff("#relatTabs","#relatOptions");


//视频
DM("#videoBtns").addEvent('click',function(){
	var src=DM.getEventSrc(1);
	if(src.nodeName=='IMG'||src.nodeName=='A'){
		//console.log();
		var i=Docms.index(DM(src).sup(1))+1;
		DM("#videosBox").addClass("show");
		DM("h1","#videosBox")[0].innerHTML=DM(".title",DM(src).sup(1)[0])[0].innerHTML;
		var video=DM("video","#videosBox")[0];
		video.src=video.src.replace(/\d(?=(\.mp4))/,i);
		//var mvObj=getFlashObject("objMedia");
		//mvObj.SetVariable(video.src, document.getElementById("mvSource").value);
		DM("param","#objMedia")[3].value=video.src;
		//console.log(video.src);
	}
});
DM("b","#videosBox").addEvent('click',function(){
	DM("#videosBox").removeClass("show");
	var video=DM("#videosBox").removeClass("show").getByAttr("src")[0];
	try{
		video.pause();
		video.currentTime=0;
	}catch (e){
		getFlashObject("objMedia").stop();
	}

});
//获取object,兼容ie
function getFlashObject(movieName) {
	if (window.document[movieName]) {
		return window.document[movieName];
	}
	if (navigator.appName.indexOf("Microsoft Internet")==-1) {
		if (document.embeds && document.embeds[movieName])
			return document.embeds[movieName];
		}else{
		return document.getElementById(movieName);
	}
}


//跳转页面顶部
var jumpToTop={
	timer:null,
	wTop:0,
	interval:10,
	init:function(id){
		var me=this;
		DM('#'+id)[0].onclick=function(){
			me.wTop=DM.wTop();
			me.jump();
		}
	},
	jump:function(){
		this.wTop=Math.floor(this.wTop/1.1);
		DM.wTop(this.wTop);
		if(this.wTop>0){
			this.timer=setTimeout(function(){
				this.jump();
			}.bind(this),this.interval);
		}else {
			clearTimeout(this.timer);
			this.timer=null;
		}
	}
};
jumpToTop.init("toTop");
}();