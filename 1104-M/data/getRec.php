<?php
		//执行数据库操作
    	$conn=mysqli_connect('127.0.0.1','lglong519','123','myCart');
    	//$conn = mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);
    	//$conn = mysqli_connect(SAE_MYSQL_HOST_M, SAE_MYSQL_USER, SAE_MYSQL_PASS,  SAE_MYSQL_DB, SAE_MYSQL_PORT);
    	//设置中文编码
    	$sql='SET NAMES UTF8';
    	mysqli_query($conn,$sql);
    	//分页查询 select * from table limit [start,count]
    	$sql='SELECT * FROM m_products ORDER BY  RAND() LIMIT 5';
    	$output=[];
    	$result=mysqli_query($conn,$sql);
    	while ( $row=mysqli_fetch_assoc($result) )//不用写 !=NULL
    	{
    		$output[]=$row;
    	}
    	//	向客户端输出响应消息主体
    	$jsonString=json_encode($output);//以json字符串方式编码
    	echo $jsonString;
?>