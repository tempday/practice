/**
 * Created by lglong519 on 2017-12-02.
 */
Function.prototype.bind || (Function.prototype.bind = function(e) {
	if ("function" != typeof this) throw new TypeError("Function.prototype.bind");
	var t = Array.prototype.slice.call(arguments, 1),
			s = this,
			n = function() {},
			i = function() {
				return s.apply(this instanceof n && e ? this : e, t.concat(Array.prototype.slice.call(arguments)))
			};
	return n.prototype = this.prototype, i.prototype = new n, i
});
+function(){
	//设置同人专区的图片和文字
	var cosWords=['四只连连小可爱【作者】子柠酱','辉夜姬竹子新皮肤【作者】 油盏灯先生','酒呱和茨呱的爱恨情仇【作者】nami_波風桑','水彩百目鬼和辉夜姬女儿【作者】镜_Area','缩水版三个大妖怪【作者】八里个两','来自异世界的茨球（1&2）【作者】Len了个Len','正太吞应该是个熊孩子【作者】nami_波風桑','阴阳师ASK（十）【作者】青春迈克尔','茨木X一松【作者】nami_波風桑','少女漫女主风的神乐【作者】Aque榊淚','陆生和晴明在此谢谢大家~【作者】八里个两','奴良陆生X晴明【作者】八里个两','会动的雪童子~【作者】画画的Xiang','会动的追月神~【作者】画画的Xiang','连绅士教龙淑女跳舞【作者】宝宝宝酱er','我家饿鬼也是可爱的！【作者】大尾魚_kamkam','白狼cos【作者】coser小樱','妖狐x大天狗cos【作者】太一 & 山海','神乐cos【作者】水蜜桃妖','妖刀姬cos【作者】阿聿空空','萤草cos【作者】阿聿空空','大天狗cos【作者】喝风的CC','晴明cos【作者】随镜ing','大天狗cos【作者】夏目目','玩球的百目鬼-手绘作画过程【作者】弃疗萌萌哒【作者】弃疗萌萌哒','没出息的阴阳师一家 第三话【作者】FLAY工作室【作者】FLAY工作室','一起觉醒次元之力【作者】','【白磷】【阴阳师现世妖约】与狗子在炎炎夏日中共舞【作者】','普通话的阴阳师开场白你敢听吗？【作者】北炎【作者】北炎','华丽现世召唤，突破次元壁之旅【作者】《阴阳师》手游','【有声漫画】妖狐与天狗【莫逸工作室】【眠君】【作者】莫逸工作室&眠君','祝各位阴阳师大人六一节日快乐【作者】','百鬼夜行——第二章','百鬼夜行——第一章','华之乱#酒茨【作者】八点三十二分','狗崽【作者】929****41','指间冰雪（姑获鸟×雪女）【作者】瑶台镜','阴阳师妖狐前身传记二【作者】Heyingyao','阴阳师妖狐前身传记一【作者】Heyingyao','阴阳寮的元宵节【作者】月朝歌＃阴阳师同人文大赛＃','一只乖巧连！【作者】 伍靥_来自喵星的王子','姑获鸟 超轻粘土【作者】-白木反-','一目连 超轻粘土【作者】-白木反-','妖刀姬 超轻黏土【作者】 丶眼泪泪泪','山兔 超轻黏土【作者】风吟wj','玉藻前 超轻粘土【作者】佐颜丶','一只小小风神 ​​【作者】Lolo一洛','萤草胸像【作者】许蕾粘土手作'];
	$('.cosplay .content img').each(function(i){
		$(this).attr('src','img/cos/'+i+'.jpg');
	});
	$('.cosplay .content p').each(function(i){
		$(this).html(cosWords[i]);
	});
	//游戏目录下拉
	$('.category').hover(function(){
		$('.cate-box').toggleClass('hide');
	});
	//页面滚动切换导航栏的透明度,固定位置
	$(window).scroll(function(){
		if($(this).scrollTop()>=55){
			$('.navbar').addClass('navbar-fixed');
		}else{
			$('.navbar').removeClass('navbar-fixed');
		}
	});
	//点击切换角色大图
	$('.roles b').on('click',function(){
		$('.roles .init').removeClass('init');
		$('.roles .part2').css('display','block');
		$('.roles div').each(function(){
			if(this.className.indexOf('hide')>-1){
				$(this).removeClass('hide').addClass('show');
			}else{
				$(this).removeClass('show').addClass('hide');
			}
		});
	});

	//扫码下载打开关闭
	$('.download b').click(function(){
		$('.download b.active').removeClass('active').siblings('b').addClass('active');
		$('.download').toggleClass('fold');
	});

	function tabsChange(tabs,items){
		$(tabs).click(function(){
			$(this).addClass('active').siblings().removeClass('active');
			$(items).eq($(tabs).index(this)).addClass('display').siblings().removeClass('display');
			return false;
		})
	}
	//5.角色切换
	tabsChange('.role-menu>.tabs','.role-tabs>.item');
	//主角切换
	tabsChange('.major>.sub-tabs>a','.major>.sub-items>.item');


	//点击切换式神头像
	$('.all>.sub-tabs>a').on('click',function(){
		if(!$(this).is('.active')){
			$('.all>.sub-tabs>a.active').removeClass('active');
			var n=$(this).addClass('active').index();
			$('.all>.sub-items div>img').each(function(i){
				$(this).attr('src','img/avatar/'+(1+i+12*n)+'.png');
			});
		}
		return false;
	});

	//选项卡滑动切换构造函数
	function Slider(){
		this.btns=null;
		this.itemBox=null;
		this.width=null;
		this.count=0;
		this.interval=500;
		this.wait=4000;
		this.timer=null;
		this.isAuto=false;
	}
	Slider.prototype={
		move:function(){
			this.setHover();
			this.itemBox.stop().animate({'marginLeft':-this.count*this.width},this.interval);
			this.autoMove();
		},
		autoMove:function(){
			clearTimeout(this.timer);
			this.count++;
			this.count>this.btns.size()-1&&(this.count=0);
			if(this.isAuto){
				this.timer=setTimeout(function(){
					this.move();
				}.bind(this),this.wait)
			}
		}
		,
		setHover:function(){
			this.btns.removeClass('hover').eq(this.count).addClass('hover');
		}
	};
	function sliderObj(btns,itemBox,isAuto){
		var obj=new Slider();
		obj.isAuto=isAuto||false;
		obj.btns=$(btns);
		obj.itemBox=$(itemBox);
		obj.width=$(itemBox).children().outerWidth();
		obj.autoMove();
		obj.btns.mouseenter(function(){
			obj.count=obj.btns.index(this);
			obj.move();
		});
	}
	//4.最新/新闻 图片
	sliderObj('.indicator b','.photos-slide-box',true);
	//最新/新闻 内容
	sliderObj('.news>.tabs>a','.news-slide-box');
	//6.攻略 图片
	sliderObj('.carousel>ol>li','.carousel>ul',true);
	//6.攻略 内容
	sliderObj('.strategy-menu>div[data-tabs]','.strategy-tabs>.tab-items');
	//7.同人
	sliderObj('.cosplay .header li[data-tabs]','.cosplay .tabs-details');
	//返回顶部
	$('#toTop').click(function(){
		$('body,html').stop().animate({'scrollTop':0},500);
	});
}();
