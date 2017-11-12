/*Created by lglong519--2017/11/09*/

//document manipulation set ==Docms
~function(w,d){
	function Docms(selector,parentArg){
		return new Docms.fun.init(selector,parentArg);
	}
	Docms.fun={
		name:"Docms v1.0",
		init:function(selector,parentArg){
			this.elems=[];
			this.count=0;
			this.getElems(selector,parentArg);
		},
		//兼容ie7+,按("#id")|(".class")|("tagName") 获取元素,parentArg:[可选]值类型可以是3种,1.DM对象,2.dom对象,3.选择器字符串;最后获得的元素放入数组elems中
		//?多个选择器用逗号分隔("#id,.class")
		getElems:function(selector,parentArg){
			this.elems=[];
			//父元素暂时只支持单对象
			typeof(parentArg)=="string"&&(parentArg=this.getElems(parentArg).elems[0]);
			if(!parentArg || parentArg.nodeType!==1){
				//传入的父对象是非dom元素提示错误
				parentArg && parentArg.nodeType!==1&& parentArg.nodeType!==9&&console.error('getElems() error: invalid parentArg');
				parentArg=d;
			}
			if(selector==undefined||selector==""){
				console.info("getElems() info:selector is undefined");
				return this;
			}
			if(typeof(selector)==="object"&&selector.length!=0){
				this.elems=selector;
			}else if(selector.nodeType===1){
				this.elems[0]=selector;
			}else{
				if(typeof(selector)!="string"){
					console.warn("getElems() warning:selector is not a String");
					return this;
				}
				//按id获取元素
				/^#[^\s]*$/.test(selector)&&(
					this.elems[0]=d.getElementById(selector.replace("#",""))
				);
				//按标签名获取元素
				/^!?[A-z]*[1-6]?$|^\*$/.test(selector)&&(
					this.elems=parentArg.getElementsByTagName(selector)
				);
				//按class获取元素
				if(/^\.[^\s]*$/.test(selector)){
					var selector=selector.replace(".","");
					if(d.getElementsByClassName){
						this.elems=parentArg.getElementsByClassName(selector);
					}else{
						var tags=parentArg.getElementsByTagName("*"),
							reg=Docms.regOfIndStr(selector);
						for(var i=0;i<tags.length;i++){
							reg.test(tags[i].className)&&(this.elems.push(tags[i]));
						}
					}
				}
			}
			this.resetElems();
			return this;
		},
		//重置元素列表
		resetElems:function(doms){
			doms&&(this.elems=doms);
			//清除getByAttr后多余的this[n]
			if(this.count>this.elems.length){
				for(var i=0;i<this.count-this.elems.length;i++){
					delete this[this.count-1-i]
				}
			}
			this.count=this.elems.length;
			//兼容ie7/8,解决不支持类数组转换的问题
			try{
				this.elems=Array.prototype.slice.call(this.elems);
				//以elems下标作为属性名将获取的元素添加到当前对象
				for(var i=0;i<this.elems.length;this[i]=this.elems[i++]);
			}catch(e){
				console.warn("resetElems() error:"+e);
				for(var i=0,_temp=[];i<this.elems.length;i++){
					this[i]=this.elems[i];
					_temp.push(this.elems[i]);
				};
				this.elems=_temp;
				_temp=null;
			}
		},
		//兼容ie7+,按属性获取后代元素,1.attrType:属性类型;2.attr:属性值[可选],如果元素类型不为空则此参数必须设置可以为"";3.tagName:查找标签类型[可选],如果缺省则查找全部类型
		getByAttr:function(attrType,attr,tagName){
			//父元素时当前元素[0],如果当前元素是空则父元素是document
			var parentArg=this.elems[0]||d,
				doms=[],
				reg=Docms.regOfIndStr(attr),
				value,
				typeLis=[],
				attrLis=[];
			attr=attr||"";
			tagName=tagName||"*";
			doms=Docms.fun.getElems(tagName,parentArg).elems;
			for(var i=0;i<doms.length;i++){
				//ie7下用api获取class写法getAttribute("className")
				value=attrType=="class"?doms[i].className:doms[i].getAttribute(attrType);
				if(value){//判断属性是否有效,将带属性的元素放入数组
					value=value.replace(/^\s*|\s*$/g,"");
					value&&(typeLis.push(doms[i]));
					if(attrType=="class"){
						attr&&reg.test(value)&&(attrLis.push(doms[i]));
					}else {
						value==attr&&(attrLis.push(doms[i]));
					}
				}
			}
			attr?this.resetElems(attrLis):this.resetElems(typeLis);
			return this;
		},
		//添加class
		addClass:function(cls){
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					this.elems[i].className=this.elems[i].className==""?cls:this.elems[i].className+" "+cls;
				}
			}		
			return this;
		},
		//移除class
		removeClass:function(cls){
			var reg=Docms.regOfIndStr(cls,"g");
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					this.elems[i].className=this.elems[i].className.replace(reg,"").replace(/^\s*|\s*$/g,"");
				}
			}
			return this;
		},
		//为元素添加事件
		addEvent:function(type,fn,bool){
			bool=bool||false;
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					if (this.elems[i].addEventListener) {
						this.elems[i].addEventListener(type,fn,bool); 
					}else if (this.elems[i].attachEvent){
						this.elems[i].attachEvent('on'+type,fn);
					}
				}
			}	
		},
		isElems:function(){
			//return this[0].length?:this.isArray(this[0]);
		},
		find:function(){
		},
		on:function(){
		},
		each:function(){
		}
	}//end Docms
	//兼容ie7/8,firefox:获取事件或事件目标,ev=0:返回事件[默认可不填],ev=1:返回目标
	Docms.getEventSrc=function(ev){
		ev=ev==1?ev:0;
		var e=w.event||arguments.callee.caller.arguments[0],
			src= e.srcElement|| e.target;
		return ev?src:e;
	}
	//兼容ie7/8,判断是否数组类型
	Docms.isArray=function(arr){
		return Array.isArray ? Array.isArray(arr) : "[object Array]" === Object.prototype.toString.call(arr);
	}
	//完整且独立的字符串的正则表达式,无后瞻所以匹配到的字符左侧可能会带空格
	Docms.regOfIndStr=function(arg,attr){
		attr=attr||"";
		attr=attr.replace(/\s/g,"").toLowerCase();
		if(/[^gims]/ig.test(attr)){
			//抛出异常并退出
			throw new TypeError("regOfIndStr() SyntaxError: Invalid RegExp ["+attr+"]");
		}
		return new RegExp("^"+arg+"$|^"+arg+"(?=\\s)|(?:\\s)"+arg+"(?=\\s+)|(?:\\s)"+arg+"$",attr);
	}
	//暂时无法兼容ie7
	Docms.query=function(selector,parentArg,bool){
		//是否进行多选,默认true;
		bool=bool||true;
		if(!parentArg || parentArg.nodeType!==1){
			//传入的父对象是非dom元素提示错误
			parentArg && parentArg.nodeType!==1&& parentArg.nodeType!==9&&console.error('getElems() error: invalid parentArg');
			parentArg=d;
		}
		return bool?parentArg.querySelectorAll(selector):parentArg.querySelector(selector);
	}
	Docms.index=function(curr,p){
		for(var i=0;i<p.children.length;i++){
			if(curr==p.children[i]){
				return i;
			}
		}
	};
	Docms.prototype=Docms.fun;
	Docms.fun.init.prototype=Docms.prototype;
	// Docms.fun.init.prototype=Docms.fun;
	DM=w.Docms=Docms;
}(window,document);

//-------------------------------------------------------------------------------------------------------------

//兼容ie7/8,源自developer.mozilla.org
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