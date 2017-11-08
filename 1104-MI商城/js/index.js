/**
 * Created by lglong on 2017-11-04.
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
function getElemByAttr(tagName,attrType,attr,parentId){
	parentId=parentId||"";
	attr=attr||"";
	var parent=document.getElementById(parentId),
			tags;
	if(parent){
		tags=parent.getElementsByTagName(tagName);
	}else{
		tags=document.getElementsByTagName(tagName);
	}
	var reg=new RegExp("^"+attr+"$|^"+attr+"\\s|\\s"+attr+"$|\\s"+attr+"\\s","g");
	var typeLis=[],attrLis=[];
	//console.log(reg);
	for(var i=0;i<tags.length;i++){
		var value=tags[i].getAttribute(attrType);
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

function addClass(elem,cls){
	elem.className=elem.className==""?cls:elem.className+" "+cls;
}
function removeClass(elem,cls){
	var reg=new RegExp("^"+cls+"$|^"+cls+"\\s|\\s"+cls+"$|\\s"+cls+"\\s","g");
	elem.className=elem.className.replace(/\s/g,"  ").replace(reg," ").replace(/^\s*|\s*$/g,"").replace(/\s{2,}/g," ");
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

navList.onmouseover=function(event){
	var src=event.srcElement||event.target;
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

//明星单品左右切换
//单对象方式
/*
var liSwitch={
	timer:null,
	interval:10,
	WIDTH:1226,
	ul:null,
	left:0,
	right:0,
	val:0,
	init:function(id,btnId,isAuto){
		this.ul=document.getElementById(id);
		this.right=this.WIDTH;
		var sliderSuperBtn=document.getElementById(btnId).children;
		var me=this;
		sliderSuperBtn[0].onclick=function(){
			me.moveL();
		};
		sliderSuperBtn[1].onclick=function(){
			me.incre=0;
			me.moveR();
		}

	},
	moveL:function(){
		//clearTimeout(this.timer);
		if(!this.left){
			return;
		}
		this.left=Math.floor(this.left/1.1);
		this.ul.style.marginLeft="-"+this.left+"px";
		if(this.left){
			this.timer=setTimeout(function(){
				this.moveL();
			}.bind(this),this.interval)
		}else {
			clearTimeout(this.timer);
			this.timer=null;
			this.right=this.WIDTH;
		}
	},
	moveR:function(){
		//clearTimeout(this.timer);
		if(!this.right){
			return;
		}
		var step=Math.ceil(this.right/11);
		this.incre+=step;
		this.right=this.right-step;
		//console.log("val: "+this.incre+" tem: "+this.right);
		this.ul.style.marginLeft="-"+this.incre+"px";
		if(this.right){
			this.timer=setTimeout(function(){
				this.moveR();
			}.bind(this),this.interval)
		}else {
			clearTimeout(this.timer);
			this.timer=null;
			this.left=this.WIDTH;
			this.incre=0;
		}
	}
};

liSwitch.init("sliderSuper","sliderSuperBtn",true);
liSwitch.init("sliderRec","recBtn");
*/

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
	this.isAuto=isAuto||false;
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
	},
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

var liSwitch={
	init:function(id,btnId,isAuto){
		var newSwitch=new SwitchLi(id,btnId,isAuto);
		newSwitch.autoMove();
		newSwitch.checkState();
		newSwitch.toggles[0].onclick=function(){
			if(newSwitch.direction){
				newSwitch.autoTimer&&(clearTimeout(newSwitch.autoTimer));
				newSwitch.move();
			}
		};
		newSwitch.toggles[1].onclick=function(){
			if(!newSwitch.direction){
				newSwitch.autoTimer&&(clearTimeout(newSwitch.autoTimer));
				newSwitch.move();
			}
		};
	}
};

liSwitch.init("sliderSuper","sliderSuperBtn",true);
liSwitch.init("sliderRec","recBtn");

function tabsOnAndOf(tabsId,optionsId){
	var tabs=document.getElementById(tabsId);
	var options=document.getElementById(optionsId);
	tabs.onmousemove=function(){
		var src=event.srcElement||event.target;
		var data=src.getAttribute("data-item-i");
		//console.log(src);
		if(data){
			removeClass(getElemByAttr("li","class","hover",tabsId)[0],"hover");
			removeClass(getElemByAttr("ul","class","display",optionsId)[0],"display");
			addClass(src,"hover");
			addClass(options.children[data],"display");
		}
	};
}
tabsOnAndOf("appTabs","appOptions");
tabsOnAndOf("intelTabs","intelOptions");

















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
