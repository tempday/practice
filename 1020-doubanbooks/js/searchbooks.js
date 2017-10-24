$(function(){
		var books,contents=[];
		function addmore(books){
			$('footer.addmore').hide();
			$('footer.loading').show().html('加载中');
			var n=books.length-$("#list li").length;
			n=n>5?$("#list li").length+5:$("#list li").length;
			loadBooks($("#list li").length,n);
		}
		function loadBooks(startNum,n){
			for(var i=startNum;i<n;i++){
				$("#list").append($("<li><div class='left'><a href='"+books[i].alt+"'><img src=\'"+books[i].image+"\' alt='暂无图片'/></a></div><div class='right'><h3><b>书名</b>：《"+books[i].title+"》</h3><p><b>图书简介：</b>"+books[i].summary+"</p></div></li>"));
			}
			if(n-startNum<5){//加载完成
				$('footer.addmore').hide();
			}else{
				$('footer.loading').hide();
				$('footer.addmore').show();
			}
			ellipsis();
			$('footer.loading').html('加载完成');
		}
		function ellipsis(){
            $("#list li p").each(function(i){
	            contents.push($(this).html());
                var maxheight=115;
                if($(this).text().length>maxheight){
                    $(this).html($(this).html().slice(0,maxheight));
                    $(this).html($(this).html()+'...<a href="'+books[i].alt+'">(详情)</a>');
                    //more = true;
                }
            });
         };
		function searchByKye(key,n){
			$('footer.addmore').hide();
			$('footer.loading').show().html('加载中');
			$.getJSON('https://api.douban.com/v2/book/search?q='+key+'&callback=?',function(data){
				books=data['books'];
				n=n<books.length?n:books.length;
				loadBooks(0,n);
			});
		}
		//searchByKye("万物");
		/*
		$('img').load(function(){
		  $(this).parents('li').outerHeight($(this).parents('.left').height());   
		});
		*/
		$('.search button').on('click',function(){
			var key=$('.search input').val().trim();
			$('h1 b').html("搜索");
			$('h1 span').html(key);
			$("#list").html("");
			searchByKye(key,5);
		});
		$('footer.addmore').on('click',function(){
			addmore(books);
		});
		$("div.types b").click(function(){
			$("div.types b").removeClass('active');
			$(this).addClass('active');
		});
		$.ajax({
			url:'http://1.lglong519.applinzi.com/data/keywords.php',
			dataType:'json',
			success:function(data){
				//var index=Math.ceil(new Date().getHours()/6);
				var index=parseInt(Math.random()*data['keywords'].length);
				var key=data['keywords'][index].keys[parseInt(Math.random()*data['keywords'][index].keys.length)];
				$('h1 b').html("推荐");
				$('h1 span').html(data['keywords'][index].type);
				$("#list").html("");
				searchByKye(key,5);
			}
		});
	});
	