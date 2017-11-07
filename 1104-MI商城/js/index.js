/**
 * Created by lglong on 2017-11-04.
 */
function getByData(tagName,attrType,attr){
	var tags=document.getElementsByTagName(tagName);
	var typeLis=[],attrLis=[];
	for(var i=0;i<tags.length;i++){
		var value=tags[i].getAttribute(attrType);
		if(value){
			value=value.replace(/^\s*|\s*$/g,"");
			value&&(typeLis.push(tags[i]));
			value==attr&&(attrLis.push(tags[i]));
		}
	}
	if(attr){
		return attrLis;
	}else{
		return typeLis;
	}
}
//输入框下拉
var search=document.getElementById("search");
search.onfocus=function(){
	this.parentNode.className+=" hover";
};
search.onblur=function(){
	this.parentNode.className=this.parentNode.className.replace(/\s+hover/g,"");
};
//导航栏下拉
var navList=document.getElementById("navList");
var navDropdown=document.getElementById("navDropdown");

navList.onmouseover=function(){
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
	width:1226,
	ul:null,
	left:0,
	right:0,
	val:0,
	init:function(id,btnId,isAuto){
		this.ul=document.getElementById(id);
		this.right=this.width;
		var sliderSuperBtn=document.getElementById(btnId).children;
		var me=this;
		sliderSuperBtn[0].onclick=function(){
			me.moveL();
		};
		sliderSuperBtn[1].onclick=function(){
			me.val=0;
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
			this.right=this.width;
		}
	},
	moveR:function(){
		//clearTimeout(this.timer);
		if(!this.right){
			return;
		}
		var step=Math.ceil(this.right/11);
		this.val+=step;
		this.right=this.right-step;
		//console.log("val: "+this.val+" tem: "+this.right);
		this.ul.style.marginLeft="-"+this.val+"px";
		if(this.right){
			this.timer=setTimeout(function(){
				this.moveR();
			}.bind(this),this.interval)
		}else {
			clearTimeout(this.timer);
			this.timer=null;
			this.left=this.width;
			this.val=0;
		}
	}
};

liSwitch.init("sliderSuper","sliderSuperBtn",true);
liSwitch.init("sliderRec","recBtn");
*/

//多对象可复用
function SwitchLi(id,btnId){
	this.timer=null;
	this.interval=10;
	this.width=1226;
	this.left=0;
	this.right=0;
	this.val=0;
	this.ul=document.getElementById(id);
	this.toggles=document.getElementById(btnId).children;
}
SwitchLi.prototype={
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
			this.right=this.width;
		}
	},
	moveR:function(){
		//clearTimeout(this.timer);
		if(!this.right){
			return;
		}
		var step=Math.ceil(this.right/11);
		this.val+=step;
		this.right=this.right-step;
		//console.log("val: "+this.val+" tem: "+this.right);
		this.ul.style.marginLeft="-"+this.val+"px";
		if(this.right){
			this.timer=setTimeout(function(){
				this.moveR();
			}.bind(this),this.interval)
		}else {
			clearTimeout(this.timer);
			this.timer=null;
			this.left=this.width;
			this.val=0;
		}
	}
};

//var sliderSuper=new SwitchLi("sliderSuper","sliderSuperBtn");

var liSwitch={
	init:function(newSwitch,id,btnId){
		newSwitch=new SwitchLi(id,btnId);
		console.log(newSwitch.val);
		newSwitch.right=newSwitch.width;
		newSwitch.toggles[0].onclick=function(){
			newSwitch.moveL();
		};
		newSwitch.toggles[1].onclick=function(){
			newSwitch.val=0;
			newSwitch.moveR();
		};
	}
};

liSwitch.init(sliderSuper,"sliderSuper","sliderSuperBtn");
liSwitch.init(sliderRec,"sliderRec","recBtn");



















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
