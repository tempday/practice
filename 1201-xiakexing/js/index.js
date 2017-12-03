/**
 * Created by lglong519 on 2017-12-02.
 */

$('.category').hover(function(){
	$('.cate-box').toggleClass('hide');
});
$(window).scroll(function(){
	if($(this).scrollTop()>=55){
		$('.navbar').addClass('navbar-fixed');
	}else{
		$('.navbar').removeClass('navbar-fixed');
	}
});
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