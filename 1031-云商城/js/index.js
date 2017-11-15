/**
 * Created by lglong on 2017-11-03.
 */
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== "function") {
			throw new TypeError("Function.prototype.bind");
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

//显示/隐藏侧边栏
window.onscroll=function(){
	jumpToTop.getScrollTop();
	var aside=document.getElementById("aside");
	if(jumpToTop.wTop<140){
		aside.style.display="none";
	}else{
		aside.style.display!="block"&&(aside.style.display="block");
	}
};

//自动轮播
//思路:或者所有item 按顺序切换className,点击焦点图则立即切换
//调用对象slider,要更改的有:id,class,onmouseover停止动画,以及
var slider={
	counter:0,
	imgs:null,
	btns:null,
	btnState:0,
	timer:null,
	interval:4000,
	opacity:100,
	alpha:0,
	opaInter:30,
	step:1,
	init:function(){
		//没有左右切换按钮
		//var prev=document.getElementById("prev");
		//var next=document.getElementById("next");
		//焦点图
		var btngroup=document.getElementById("slideBtn");
		this.btns=btngroup.children;
		//大图列表
		var imgList=document.getElementById("slideBox");
		this.imgs=imgList.children;
		var me=this;
		btngroup.onclick=function(event){
			var src=event.srcElement||event.target;
			if(src.nodeName=="LI"){
				for (var i=0;i<this.children.length;i++){
					if(this.children[i]==src){
						me.step=i-me.counter;
						me.changeImg();
						//me.clearOpacity();
						me.step=1;
						break;
					}
				}
			}
		};
		this.autoMove();
		btngroup.onmouseover=function(){
			clearTimeout(me.timer);
			me.timer=null;
		};
		btngroup.onmouseout=function(){
			me.autoMove();
		}
	},
	setCounter:function(){
		//var bool=false;
		//this.counter<0||this.counter==this.imgs.length&&(bool=true);
		this.counter<0&&(this.counter=this.imgs.length-1);
		this.counter==this.imgs.length&&(this.counter=0);
		//bool==true&&(this.imgs[this.counter].style.filter="alpha(opacity=100)");
	},
	changeImg:function(){
		//this.clearOpacity();
		this.clearState();
		this.counter+=this.step;
		//this.setOpacity();
		this.setCounter();
		this.setState();

	},
	clearState:function(){
		this.imgs[this.counter].className=this.imgs[this.counter].className.replace("current","").replace(/(.*?)#|\s/g,'');
		this.btns[this.counter].className="";
	},
	setState:function(){
		this.imgs[this.counter].className+=" current";
		this.btns[this.counter].className="hover";
	},
	autoMove:function(){
		this.timer=setTimeout(function(){
			this.changeImg();
			this.autoMove();
		}.bind(this),this.interval);
	},
	clearOpacity:function(){
		this.counter<0&&(this.counter=this.imgs.length-1);
		this.counter==this.imgs.length&&(this.counter=0);
		console.log("counter"+this.counter);
		this.opacity=Math.floor(this.opacity/1.1);
		this.imgs[this.counter].style.filter="alpha(opacity="+this.opacity+")";
		if(this.opacity>0){
			setTimeout(function(){
				this.clearOpacity();
			}.bind(this),this.opaInter)
		}else{
			this.opacity=100;
		}
	},
	setOpacity:function(){
		this.counter==0&&(this.imgs[4].style.filter="alpha(opacity=0)");
		this.counter<0&&(this.counter=this.imgs.length-1);
		this.counter==this.imgs.length&&(this.counter=0);
		this.alpha+=100-this.alpha-Math.floor((100-this.alpha)/1.1);
		this.imgs[this.counter].style.filter="alpha(opacity="+this.alpha+")";
		console.log("setter"+this.counter+"alp:"+this.alpha);

		if(this.alpha<100){
			setTimeout(function(){
				this.setOpacity();
			}.bind(this),this.opaInter)
		}else{
			this.alpha=0;
			//this.setCounter();
			//this.setState();
		}
	}
};
slider.init();
//左右滚动切换--------------------------------------------------------------------
//实现思路:点击按钮,判定方向,开始移动,counter++/--,判断counter是否越界,重置lis容器位置
var leftAndRight={
	width:313,//单个li的宽度270+43
	liSum:null,//li实际总数
	counter:0,//计算次数
	slideBox:null,//装载滚动元素的容器
	step:0,
	space:null,
	timer:null,
	interval:10,
	direction:1,
	init:function(){//状态初始化,追加同数量li形成循环
		this.counter++;
		this.space=this.width;
		this.slideBox=document.getElementById("products");
		var liList=this.slideBox.children;
		this.liSum=liList.length;
		this.moveOnce();
		for(var i=0;i<this.liSum;i++){
			this.slideBox.appendChild(liList[i].cloneNode(true));
		}
		liList=this.slideBox.children;
		this.slideBox.insertBefore(liList[liList.length-1],liList[0]);
		this.slideBox.style.width=liList.length*this.width+"px";

		//左右按钮
		var btns=document.getElementById("products-arrow").children;
		btns[0].onclick=function(){
			this.direction=1;
			this.changeItems();
			//this.step==0&&(this.counter +=1);

		}.bind(this);
		btns[1].onclick=function(){
			this.direction=-1;
			//this.step==0&&(this.counter -=1);
			this.changeItems();
		}.bind(this);
	},
	changeItems:function() {
		this.step+=this.space-Math.floor(this.space/1.1);
		this.space=Math.floor(this.space/1.1);
		//console.log("step:"+this.step+"wid:"+this.space);
		this.moveOnce();
		if(this.space!=0){
			this.timer=setTimeout(function(){
				this.changeItems();
			}.bind(this),this.interval)
		}else{
			this.step=0;
			clearTimeout(this.timer);
			this.direction>0?this.counter++:this.counter--;
			this.checkState();
			this.timer=null;
			this.space=this.width;
		}
	},//判断counter是否越界,正常范围是[1,原始列表总数]
	checkState:function(){
		if(this.counter < 1){
			 this.counter = this.liSum;
			this.moveOnce()
		}
		if(this.counter > this.liSum){
			this.counter = 1;
			this.moveOnce()
		}
	},
	moveOnce:function(){
		this.slideBox.style.marginLeft=-(this.counter*this.width+this.step*this.direction)+"px";
	}
};
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
leftAndRight.init();
//选项点击切换
	//1.案例选项卡
document.getElementById("project").onclick=function(event){
	var src=event.srcElement||event.target;
	if(src.parentNode.className=="tabNav"){
		var caseToggle=document.getElementById("caseToggle");
		var childs=src.parentNode.children,i= 0,state;
		while (i<childs.length){
			childs[i]==src&&(state=i);
			caseToggle.children[i].className=caseToggle.children[i].className.replace("display","").replace(/^\s*|\s*$/g,"");
			childs[i++].className="";
		}
		src.className="on";
		caseToggle.children[state].className+=" display";
	}
};
	//2.案例小列表左右切换
var sliderCase={
	counter:0,
	imgs:null,
	btns:null,
	btnState:0,
	timer:null,
	inverval:4000,
	init:function(){
		//左右切换按钮
		var prev=document.getElementById("special-arrow").children[0];
		var next=document.getElementById("special-arrow").children[1];
		//焦点图
		var btngroup=document.getElementById("special-btn");
		this.btns=btngroup.children;
		//大图列表
		var imgList=document.getElementById("caseItems");
		this.imgs=imgList.children;
		var me=this;
		prev.onclick=function(){
			me.changeImg(-1);
		};
		next.onclick=function(){
			me.changeImg(1);
		};
		btngroup.onclick=function(event){
			var src=event.srcElement||event.target;
			src.nodeName=="IMG"&&(src=src.parentNode);
			if(src.nodeName=="LI"){
				for (var i=0;i<this.children.length;i++){
					if(this.children[i]==src){
						me.changeImg(i-me.counter);
						break;
					}
				}
			}
		};
	},
	setCounter:function(){
		this.counter<0&&(this.counter=this.imgs.length-1);
		this.counter==this.imgs.length&&(this.counter=0);
	},
	changeImg:function(n){
		this.clearState();
		this.counter+=n;
		this.setCounter();
		this.setState();
	},
	clearState:function(){
		this.imgs[this.counter].className=this.imgs[this.counter].className.replace("current","").replace(/(.*?)#|\s/g,'');
		this.btns[this.counter].className="";
	},
	setState:function(){
		this.imgs[this.counter].className+=" current";
		this.btns[this.counter].className="hover";
	}
};
sliderCase.init();
//地址选项卡
document.getElementById("tabs").onclick=function(event){
	var src=event.srcElement||event.target;
	if(src.nodeName=="LI"){
		var details=document.getElementById("details");
		var childs=this.children,i= 0,state;
		while (i<childs.length){
			childs[i]==src&&(state=i);
			details.children[i].className=details.children[i].className.replace("current","").replace(/^\s*|\s*$/g,"");
			childs[i++].className="";
		}
		src.className="hover";
		details.children[state].className+=" current";
	}
};



