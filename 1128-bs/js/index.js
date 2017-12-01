/**
 * Created by lglong519 on 2017-11-30.
 */
+function(){
	var words=['“IntWifi one-ups traditional routers in the two areas that matter to most of us: total coverage and simplicity.”',
			'“My daughter said, ‘Dad, that thing has changed my life.’”',
		'“But I didn’t need the stats to tell me what I was experiencing: really fast Internet in all corners of my home, whether firing up a movie inside Netflix or just whizzing through cyberspace.”',
		'“In short, it feels like what Apple might have come up with if it had invested considerable energy into rethinking WiFi.”',
		'“IntWifi’s app was the easiest to understand, which made setting up and checking on the status of the WiFi system extremely smooth...my favorite was IntWifi.”'
	];
	//文字图片自动轮播
	var sliderWords={
		ul:$('#sliderUl'),
		lis:null,
		width:null,
		curId:2,
		newId:null,
		leftPoint:null,
		rightPoint:null,
		timer:null,
		wait:5000,
		init:function(){
			//获取移动的li
			this.lis=this.ul.children();
			//设置每个li的left
			this.setLiLeft();
			//开启自动移动
			this.autoMove();
			var me=this;
			this.lis.on('click',function(){
				clearTimeout(me.timer);
				//设置当前的下标为点击目标所在的下标
				me.newId=$(this).index();
				me.move();
				me.timer=setTimeout(function(){
					me.autoMove();
				},me.wait);
			});
		},
		//按分别率初始化左右临界点,并设置每个li的left值
		setLiLeft:function(){
			var me=this;
			if($(window).width()>768){
				me.leftPoint=2;
				me.rightPoint=me.lis.length-3;
			}else{
				me.leftPoint=1;
				me.rightPoint=me.lis.length-2;
			}
			me.width=me.lis[0].offsetWidth;
			me.lis.each(function(i){
				$(this).css('left',i*me.width);
			});
		},
		//判断修改当前移动的顺序
		setId:function(){
			if(this.newId<this.leftPoint){//this.curId<=2&&
				this.curId+=5;
				this.newId+=5;
				this.ul.css('left',-this.width*(this.rightPoint-this.leftPoint))
			}else if(this.newId>this.rightPoint){//this.curId>=7&&
				this.curId-=5;
				this.newId-=5;
				this.ul.css('left',0)
			}
		},
		//移动
		move:function(){
			this.setId();
			this.ul.children().eq(this.newId).addClass('active').siblings().removeClass('active');
			this.ul.stop().animate({'left':-this.width*(this.newId-this.leftPoint)},'slow',function(){
				this.curId=this.newId;
				$('#words p').css('opacity',.3);
				setTimeout(function(){
					$('#words p').html(words[this.curId>(this.lis.length/2-1)?this.curId-this.lis.length/2:this.curId]);
					setTimeout(function(){
						$('#words p').css('opacity',1);
					},200);
				}.bind(this),200);

			}.bind(this));
		},
		//自动移动
		autoMove:function(){
			this.newId++;
			this.move();
			clearTimeout(this.timer);
			this.timer=setTimeout(function(){
				this.autoMove();
			}.bind(this),this.wait);
		}
	};
	//轮播初始化
	sliderWords.init();
	changeByWindow();
	$(window).on('resize',changeByWindow);
	//重新设置figure的top=description*.8
	function changeByWindow(){
		sliderWords.setLiLeft();
		if(window.innerWidth<=1024){
			$('figure').css('marginTop',$('figure .description').outerHeight()*.8);
			$('.auto').css('marginTop',$('.auto .description').outerHeight()*.8);
		}
	}
}();