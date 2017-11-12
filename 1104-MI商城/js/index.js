/**
 * Created by lglong519 on 2017-11-04.
 */

if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== "function") {
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function() {},
				fBound = function() {
					return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
							aArgs.concat(Array.prototype.slice.call(arguments)));
				};
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}
//按属性获取元素
function getElemsByAttr(tagName,attrType,attr,parentId){
	parentId=parentId||"";
	attr=attr||"";
	var parent=document.getElementById(parentId), tags;
	if(parent){
		tags=parent.getElementsByTagName(tagName);
	}else{
		tags=document.getElementsByTagName(tagName);
	}
	var reg=new RegExp("^"+attr+"$|^"+attr+"(?=\\s)|\\s"+attr+"(?=\\s+)|\\s"+attr+"$","g");
	var value,typeLis=[],attrLis=[];
	//console.log(reg);
	for(var i=0;i<tags.length;i++){
		value=attrType=="class"?tags[i].className:tags[i].getAttribute(attrType);
		if(value){//判断属性是否有效
			value=value.replace(/^\s*|\s*$/g,"");
			value&&(typeLis.push(tags[i]));
			if(attrType=="class"){
				//console.log(value);
				attr&&reg.test(value)&&(attrLis.push(tags[i]));
			}else {
				value==attr&&(attrLis.push(tags[i]));
			}
		}
	}
	if(attr){
		return attrLis;
	}else{
		return typeLis;
	}
}
//添加class,elem是dom,cls是class属性值
function addClass(elem,cls){
	if(!elem){
		return false;
	}else{
		elem.className=elem.className==""?cls:elem.className+" "+cls;
	}
}
//移除class
function removeClass(elem,cls){
	//var reg=new RegExp("^"+cls+"$|^"+cls+"\\s|\\s"+cls+"$|\\s"+cls+"\\s|^\\s*|\\s*$","g");
	var reg=new RegExp("^"+cls+"$|^"+cls+"(?=\\s)|\\s"+cls+"(?=\\s+)|\\s"+cls+"$","g");
	if(!elem){
		return false;
	}else{
		//elem.className=elem.className.replace(/\s/g,"  ").replace(reg,"").replace(/\s{2,}/g," ");
		elem.className=elem.className.replace(reg,"").replace(/^\s*|\s*$/g,"");
	}
}
//兼容:获取事件或事件目标,ev=0:返回事件[默认可不填],ev=1:返回目标
function getEventTarget(ev){
	ev=ev==1?ev:0;
	var e=window.event||arguments.callee.caller.arguments[0];
	var src= e.srcElement|| e.target;
	if(ev){
		return src;
	}else{
		return e;
	}
}

//输入框下拉
var search=document.getElementById("search");
search.onfocus=function(){
	//this.parentNode.className+=" hover";
	addClass(this.parentNode,"hover");
};
search.onblur=function(){
	//this.parentNode.className=this.parentNode.className.replace(/\s+hover/g,"");
	removeClass(this.parentNode,"hover");
};
//导航栏下拉
var navList=document.getElementById("navList");
var navDropdown=document.getElementById("navDropdown");

navList.onmouseover=function(){
	var src=getEventTarget(1);
	var data=src.getAttribute("data-item-i")||src.parentNode.getAttribute("data-item-i");
	//console.log(src);
	if(data){
		navDropdown.className+=" display";
		navDropdown.children[0].children[data-1].className+=" current";
	}
};
navList.onmouseout=function(){
	navDropdown.className="nav-dropdown";
	var childs=navDropdown.children[0].children;
	for(var i=0;i<childs.length;childs[i++].className="nav-item");
};


//商品列表左右切换构造函数
function SwitchLi(id,btnId,isAuto){
	this.timer=null;
	this.interval=10;
	this.wait=5000;
	this.WIDTH=1226;
	this.RATE=1.1;
	this.mgLeft=1226;
	this.direction=false;//判断左方向按钮状态
	this.ul=document.getElementById(id);
	this.toggles=document.getElementById(btnId).children;
	this.isAuto=isAuto||false;//是否开启自动移动
	this.autoTimer=null;
}
SwitchLi.prototype={
	move:function(){
		this.timer&&(clearTimeout(this.timer));
		this.mgLeft=Math.floor(this.mgLeft/this.RATE);
		this.direction?
				this.ul.style.marginLeft="-"+this.mgLeft+"px":
				this.ul.style.marginLeft="-"+(this.WIDTH-this.mgLeft)+"px";
		if(this.mgLeft){
			this.timer=setTimeout(function(){
				this.move();
			}.bind(this),this.interval)
		}else{
			clearTimeout(this.timer);
			this.timer=null;
			this.mgLeft=this.WIDTH;
			this.direction=!this.direction;
			this.checkState();
			this.autoMove();
		}
	},//判断是否自动移动
	autoMove:function(){
		if(this.isAuto){
			this.autoTimer=setTimeout(function(){
				this.move();
			}.bind(this),this.wait)
		}
	},//设置左右按钮的状态
	checkState:function(){
		if(this.direction){
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
		var newSwitch=new SwitchLi(id,btnId,isAuto);
		newSwitch.autoMove();
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
		if(Fun.direction==bool){
			Fun.autoTimer&&(clearTimeout(Fun.autoTimer));
			Fun.move();
		}
	}
};
//5.明星单品
liSwitch.init("sliderSuper","sliderSuperBtn",true);
//11.推荐
liSwitch.init("sliderRec","recBtn");

//商品主分类鼠标悬浮切换函数
// data是可选项数组["class1,"class2"],可以自定义class的值,第一个元素指向标签,第二个指向内容
function tabsOnAndOff(tabsId,optionsId,data){
	data=data||[];
	data[0]||(data[0]="hover");
	data[1]||(data[1]="display");
	var tabs=document.getElementById(tabsId);
	var options=document.getElementById(optionsId);
	tabs.onmousemove=function(){
		var src=getEventTarget(1);
		var attr=src.getAttribute("data-item-i");
		//console.log(src);
		if(attr){
			removeClass(getElemsByAttr("li","class",data[0],tabsId)[0],data[0]);
			removeClass(getElemsByAttr("ul","class",data[1],optionsId)[0],data[1]);
			addClass(src,data[0]);
			addClass(options.children[attr],data[1]);
		}
	};
}
//6.家电
tabsOnAndOff("appTabs","appOptions");
//7.智能
tabsOnAndOff("intelTabs","intelOptions");
//8.搭配
tabsOnAndOff("combiTabs","combiOptions");
//9.配件
tabsOnAndOff("pieTabs","pieOptions");
//10.周边
tabsOnAndOff("relatTabs","relatOptions");

//视频
DM("#videoBtns").addEvent('click',function(){
	var src=DM.getEventSrc(1),
			me=this;
	if(src.nodeName=='IMG'||src.nodeName=='A'){
		var i=Docms.index(src.parentNode.parentNode,this)+1;
		DM("#videosBox").addClass("show");
		var video=DM("video","#videosBox")[0];
		video.src=video.src.replace(/\d(?=(\.mp4))/,i);
	}
});
DM("b","#videosBox").addEvent('click',function(){
	DM("#videosBox").removeClass("show");
	var video=DM("#videosBox").removeClass("show").getByAttr("src")[0];
	video.pause();
	video.currentTime=0;
});















//跳转页面顶部
var jumpToTop={
	timer:null,
	wTop:0,
	interval:10,
	init:function(id){
		var me=this;
		var btnElem=document.getElementById(id);
		btnElem.onclick=function(){
			me.getScrollTop();
			me.jump();
			return false;
		}
	},
	getScrollTop:function(){
		var y=[];
		if (document.documentElement) {
			y[y.length] = document.documentElement.scrollTop || 0;
		}
		if (document.body) {
			y[y.length] = document.body.scrollTop || 0;
		}
		y[y.length] = window.scrollY || 0;
		this.wTop=Math.max.apply(this,y);
	},
	jump:function(){
		this.wTop=Math.floor(this.wTop/1.1);
		window.scrollTo(0,this.wTop);
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
