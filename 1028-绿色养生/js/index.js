/**
 * Created by lglong on 2017-10-29.
 */
//解决IE10以下不支持Function.bind
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



var slider={
	counter:0,
	imgs:null,
	btns:null,
	btnState:0,
	timer:null,
	inverval:4000,
	init:function(){
		var prev=document.getElementById("prev");
		var next=document.getElementById("next");
		var btngroup=document.getElementById("btngroup");
		this.btns=btngroup.children;
		var imgList=document.getElementById("imgList");
		this.imgs=imgList.children;
		var me=this;
		prev.onclick=function(){
			me.changeImg(-1);
		};
		next.onclick=function(){
			me.changeImg(1);
		};
		btngroup.onclick=function(){
			var src=event.srcElement||event.target;
			if(src.nodeName=="LI"){
				for (var i=0;i<this.children.length;i++){
					if(this.children[i]==src){
						me.changeImg(i-me.counter);
						break;
					}
				}
			}
		};
		this.autoMove();
		btngroup.onmouseover=imgList.onmouseover=prev.onmouseover=next.onmouseover=function(){
			clearTimeout(me.timer);
			me.timer=null;
		};
		btngroup.onmouseout=imgList.onmouseout=prev.onmouseout=next.onmouseout=function(){
			me.autoMove();
		}
	},
	setCouter:function(){
		this.counter<0&&(this.counter=this.imgs.length-1);
		this.counter==this.imgs.length&&(this.counter=0);
	},
	changeImg:function(n){
		this.clearState();
		this.counter+=n;
		this.setCouter();
		this.setState();
	},
	clearState:function(){
		this.imgs[this.counter].className="";
		this.btns[this.counter].className="";
	},
	setState:function(){
		this.imgs[this.counter].className="current";
		this.btns[this.counter].className="hover";
	},
	autoMove:function(){
		this.timer=setTimeout(function(){
			this.changeImg(1);
			this.autoMove();
		}.bind(this),this.inverval);
	}
};
slider.init();
//匀速
/*
var jumpTo={
	speed:1,
	interval:1,
	distance:null,
	step:0,//ceil(dist/speed)
	rate:null,//rate=dis/step
	timer:null,
	distSum:0,
	init:function(){
		var navbar=document.getElementById("navbar");
		navbar.onclick=function(){
			var src=event.srcElement||event.target;
			if(src.nodeName=="A"){
				var anchor=src.getAttribute('href').replace('#','');
				jumpTo.getData(anchor);
				jumpTo.jump();
				return false;
			}
		}
	},
	getData:function(anchor){
		var target=document.getElementById(anchor);
		this.distance=target.offsetTop;
		this.step=Math.ceil(this.distance/this.speed);
		this.rate=this.distance/this.step;
	},
	jump:function(){
		console.log(this.step);

		this.step==1?this.distSum=this.distance:this.distSum+=this.rate;
		console.log(this.distSum);

		window.scrollTo(0,this.distSum);
		this.step--;
		if(this.step){
			this.timer=setTimeout(function(){
				this.jump();
			}.bind(this),this.interval)
		}else {
			clearTimeout(this.timer);
			this.timer=null;
			this.distSum=0;
		}
	}
};
 jumpTo.init();
*/

//平滑加速跳转
var jumpToAnchor={
	speed:0,
	interval:10,
	distance:0,
	rate:1.1,//rate=dis/step
	timer:null,
	distSum:0,
	distCurr:0,
	wTop:0,
	direction:true,
	init:function(id){
		var btnElem=document.getElementById(id);
		btnElem.onclick=function(){
			var src=event.srcElement||event.target;
			if(src.nodeName=="A"){
				var href=src.getAttribute('href');
				if(href.match(/#/)){//^#  兼容ie7,ie7获得的是整个超链接
					jumpToAnchor.getScrollTop();
					(jumpToAnchor.getData(href.replace(/(.*?)#|\s/g,'')))&&(jumpToAnchor.jump());
				}
				return false;
			}
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
	getData:function(anchor) {
		var target = document.getElementById(anchor);
		if (!target) {
			return false;
		}
		this.distance = target.offsetTop;
		this.distSum = this.wTop;
		this.distCurr = this.distance - this.wTop;
		this.direction=this.distCurr>0||false;
		return this.distCurr;
	},
	jump:function(){
		//开始计算距离
		if(this.direction) {
			this.speed = this.distCurr - Math.floor(this.distCurr / this.rate);
			this.distCurr = Math.floor(this.distCurr / this.rate);//与目标距离不断减小直到等于0
		}else{
			this.speed = this.distCurr - Math.ceil(this.distCurr / this.rate);
			this.distCurr = Math.ceil(this.distCurr / this.rate);
		}
		this.distSum+=this.speed;
		window.scrollTo(0,this.distSum);
		//console.log("tar:"+this.distance+" Sum:"+this.distSum+" sp:"+this.speed+" dis:"+this.distCurr);
		if(this.distCurr!=0){
			this.timer=setTimeout(function(){
				this.jump();
			}.bind(this),this.interval)
		}else {
			clearTimeout(this.timer);
			this.timer=null;
		}

	}
};
jumpToAnchor.init("navbar");
jumpToAnchor.init("toTop");



