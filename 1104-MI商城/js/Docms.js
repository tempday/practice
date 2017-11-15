/*Created by lglong519--2017/11/09*/

//document manipulation set ==Docms
~function(w,d){
	function Docms(selector,origin){
		return new Docms.fun.init(selector,origin);
	}
	Docms.fun={
		name:"Docms v1.0",
		init:function(selector,origin){
			this.elems=[];//储存当前元素
			this.count=0;//当前元素的数量
			this.tempElems=[];//临时数组
			this.isChaining=false;//是否正在链式操作
			this.source=[];//Docms()对象首次获取的元素
			this.parent=null;//elems 第一个元素的父元素
			this.children=[];//elems 第一个元素的子元素
			this.getElems(selector,origin);//实例化时立即进行第一次元素获取
		},
		//兼容ie7+,按("#id")|(".class")|("tag.class")|("tag") 获取元素,
			//origin:[可选]值类型可以是3种,1.DM对象,2.dom对象,3.选择器字符串;最后获得的元素放入数组elems中
		//?多个选择器用逗号分隔("#id,.class")
		getElems:function(selector,origin){
			this.elems=[];
			//父元素暂时只支持单对象
			typeof(origin)=="string"&&(origin=this.getElems(origin).elems[0]);
			this.elems=[];
			if(!origin || origin.nodeType!==1){
				//传入的父对象是非dom元素提示错误
				origin && origin.nodeType!==1&& origin.nodeType!==9&&console.error('Docms tips:getElems() invalid origin');
				origin=d;
			}
			//判断selector的4个条件:1.未定义或是空字符;2.是对象且长度大于零;3.是对象且节点类型为1;4.字符串
			if(selector==undefined||selector==""){
				console.info("Docms tips:getElems() selector is undefined");
				return this;
			}else if(typeof(selector)==="object"&&selector.length>0&&selector.nodeType!=1&&selector.nodeType!=9){
				this.elems=selector;
			}else if(selector.nodeType===1){
				this.elems[0]=selector;
			}else{
				if(typeof(selector)!="string"){
					console.warn("Docms tips:getElems() selector is not a String");
					return this;
				}
				//按id获取元素
				/^#[^\s\.]+$/.test(selector)&&(
					this.elems[0]=d.getElementById(selector.replace("#",""))
				);
				//按标签名获取元素
				/^!?[A-z]+[1-6]?$|^\*$/.test(selector)&&(
					this.elems=origin.getElementsByTagName(selector)
				);
				//按class获取元素
				if(/^([A-z]+[1-6]?)?\.[^\s]+$/.test(selector)){
					var selArr=selector.match(/^([A-z]+[1-6]?)|\.|[^\s\.]+$/g);
					//var selector=selector.replace(".","");
					var tags,reg;
					if(selArr.length==3){
						tags=origin.getElementsByTagName(selArr[0]);
						reg=Docms.regOfIndStr(selArr[2]);
						for(var i=0;i<tags.length;i++){
							reg.test(tags[i].className)&&(this.elems.push(tags[i]));
						}
					}else if(selArr.length==2){
						if(d.getElementsByClassName){
							this.elems=origin.getElementsByClassName(selArr[1]);
						}else{
							tags=origin.getElementsByTagName("*"),
								reg=Docms.regOfIndStr(selArr[1]);
							for(var i=0;i<tags.length;i++){
								reg.test(tags[i].className)&&(this.elems.push(tags[i]));
							}
						}
					}
				}
			}
			this.resetElems();
			return this;
		},
		//内部api:重置元素列表
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
				//console.warn("Docms tips:resetElems() error");
				for(var i=0,_temp=[];i<this.elems.length;i++){
					this[i]=this.elems[i];
					_temp.push(this.elems[i]);
				}
				this.elems=_temp;
				_temp=null;
			}
			//两个默认属性
			if(this.elems[0]){
				this.parent=this.elems[0].parentNode;
				this.children=this.elems[0].children;
			}else{
				this.parent=null;
				this.children=[];
			}
		},
		//兼容ie7+,按属性获取后代元素,1.attrType:属性类型;2.attr:属性值[可选],如果元素类型不为空则此参数必须设置可以为"";3.tagName:查找标签类型[可选],如果缺省则查找全部类型
		getByAttr:function(attrType,attr,tagName){
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			this.isChaining=true;
			//父元素时当前元素[0],如果当前元素是空则父元素是document
			attr=attr||"";
			var parentArg=this.elems[0]||d,
				doms=[],
				reg=Docms.regOfIndStr(attr),
				value,
				typeLis=[],
				attrLis=[];
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
		//添加class,自动遍历查寻结果中所有元素
		addClass:function(cls){
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					this.elems[i].className=this.elems[i].className==""?cls:this.elems[i].className+" "+cls;
				}
			}
			return this;
		},
		//移除class,自动遍历查寻结果中所有元素
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
		//fetch,查找父元素或子元素时都会将旧结果放入栈底,将当前结果置顶
		
		//按下标选择查询结果中的元素
		fetch:function(n){
			if(n==undefined||n>=this.elems.length){
				throw new RangeError("Docms tips:fetch() n is out of index.");
			}
			//判断当前是否已链式操作,如果是就要从临时文件夹获取元素进行操作,否则先将原结果储存起来,再从源文件夹获取元素进行操作
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			//避免数组关联操作先重置elems,如果不需要修改原数组elem则elem不需要重置
			this.elems=[];
			this.elems[0]=this.isChaining?this.tempElems[n]:this.source[n];
			this.isChaining=true;
			this.resetElems();
			return this;
		},
		//查找父元素
		sup:function(n){
			if(!this.elems.length){return this;}
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			this.elems=[];
			this.elems[0]=this.isChaining?this.tempElems[0]:this.source[0];
			this.isChaining=true;
			//父元素根据n的数值进行n+1次获取
			n=n||0;
			do{
				this.elems[0]=this.elems[0].parentNode;
			}while(n--);
			this.resetElems();
			return this;
		},
		//查找子元素,筛选的条件exp[可选]:id|class|标签; 例如('div')('#id')('div#id')('.class')('div.class')
		sub:function(exp){
			if(!this.elems.length){return this;}
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			if(typeof(exp)=="string"&&exp){
				this.elems=Docms.elemsFilter(this.elems[0].children,exp);
			}else if(typeof(exp)=="number"){
				this.elems=[];
				this.elems[0]=this.tempElems[0].children[exp];
			}else{
				this.elems=this.elems[0].children;
			}
			this.isChaining=true;
			this.resetElems();
			return this;
		},
		//查找所有后代元素,筛选的条件exp[可选],如果bool为true,将包含当前元素
		all:function(exp,bool){
			if(!this.elems.length){return this;}
			//参数不定,要先判断参数
			if(arguments.length){
				for(var i=0,a='',b=false;i<arguments.length;i++){
					typeof(arguments[i])==='string'&&(a=arguments[i]);
					typeof(arguments[i])==='boolean'&&(b=arguments[i]);
				}
			}
			exp=a,bool=b;
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			this.isChaining=true;
			//先获取所有的后代元素
			this.elems=this.elems[0].getElementsByTagName('*');
			//再根据筛选条件对结果再次进行筛选
			exp&&(this.elems=Docms.elemsFilter(this.elems,exp));
			this.resetElems();
			//是否包含当前元素
			if(bool){
				this.elems.unshift(this.tempElems[0]);
				this.resetElems();
			}
			return this;
		},
		//将结果集设置成初始状态
		me:function(){
			if(this.isChaining){
				this.isChaining=false;
				this.tempElems=[];
				this.elems=this.source;
				this.resetElems();
			}
			return this;
		},
		//在结果中查找带指定属性的元素
		hasAttr:function(attrType,attr){
			if(!this.elems.length){return this;}
			this.isChaining=true;
			this.tempElems=this.elems;
			//父元素时当前元素[0],如果当前元素是空则父元素是document
			attr=attr||"";
			var reg=Docms.regOfIndStr(attr),
				value,
				typeLis=[],
				attrLis=[];
			for(var i=0;i<this.elems.length;i++){
				//ie7下用api获取class写法getAttribute("className")
				value=attrType=="class"?this.elems[i].className:this.elems[i].getAttribute(attrType);
				if(value){//判断属性是否有效,将带属性的元素放入数组
					value=value.replace(/^\s*|\s*$/g,"");
					value&&(typeLis.push(this.elems[i]));
					if(attrType=="class"){
						attr&&reg.test(value)&&(attrLis.push(this.elems[i]));
					}else {
						value==attr&&(attrLis.push(this.elems[i]));
					}
				}
			}
			this.elems=[];
			attr?this.resetElems(attrLis):this.resetElems(typeLis);
			return this;
		}
	};//end Docms
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
			throw new TypeError("Docms tips:regOfIndStr() Invalid RegExp ["+attr+"]");
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
	//获取p元素的某个子元素curr所在的下标
	Docms.index=function(curr){
		curr instanceof Docms.fun.init&&(curr=curr[0]);
		var childs=curr.parentNode.children;
		for(var i=0;i<childs.length;i++){
			if(curr==childs[i]){
				return i;
			}
		}
		return -1;
	}
	//格式化选择器参数
	Docms.formatSelector=function(exp){
		if(typeof(exp)!='string'){
			throw new TypeError("Docms tips:formatSelector()"+exp);
		}
		//参数:type:结果类型,t:标签名,m:符号类型#|.,n:id|class的值
		//type类型:0:标签,1:id,2.带标签的id,3.class,4.带标签的class
		var results={sn:null,type:null,t:null,m:null,n:null},
			regTest=exp.match(/#|\.|([A-z]+[1-6]?)+/g);
		if(regTest.length==1){
			results.sn=0;
			results.type='tag';
			results.t=exp.toUpperCase();
		}else if(regTest.length==2){
			if(regTest[0]=='#'){
				results.sn=1;
				results.type='id';
			}else if(regTest[0]=='.'){
				results.sn=3;
				results.type='class';
			}
			results.m=regTest[0];
			results.n=regTest[1];
		}else if(regTest.length==3){
			if(regTest[1]=='#'){
				results.sn=2;
				results.type='id';
			}else if(regTest[1]=='.'){
				results.sn=4;
				results.type='class';
			}
			results.t=regTest[0].toUpperCase();
			results.m=regTest[1];
			results.n=regTest[2];
		}
		return results;
	}
	//根据选择器过滤元素
	Docms.elemsFilter=function(elemsArr,exp){
		elemsArr instanceof Docms.fun.init&&(elemsArr=elemsArr.elems);
		if(elemsArr.length&&typeof(exp)=="string"&&exp){
			var result=Docms.formatSelector(exp);
			result.type=='class'&&(reg=Docms.regOfIndStr(result.n));
			for(var _temp=[],i=0;i<elemsArr.length;i++){
				if(result.type=='id'&&elemsArr[i].id==result.n){
					_temp.push(elemsArr[i]);
					break;
				}else if(result.type=='class'&&reg.test(elemsArr[i].className)){
					if(result.t){
						if(elemsArr[i].nodeName==result.t){
							_temp.push(elemsArr[i]);
						}
						continue;
					}
					_temp.push(elemsArr[i]);
				}else if(result.type=='tag'&&elemsArr[i].nodeName==result.t){
					_temp.push(elemsArr[i]);
				}
			}
			return _temp;
		}else{
			console.error("Docms tips:testElems() invalid elemsArr+exp");
			return [];
		}
	}
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