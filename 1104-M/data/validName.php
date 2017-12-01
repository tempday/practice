<?php
	$userName=$_POST['user'];
	//执行数据库操作
	$conn=mysqli_connect('127.0.0.1','lglong519','123','myCart');
	//$conn = mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT,SAE_MYSQL_USER,SAE_MYSQL_PASS);
	//$conn = mysqli_connect(SAE_MYSQL_HOST_M, SAE_MYSQL_USER, SAE_MYSQL_PASS,  SAE_MYSQL_DB, SAE_MYSQL_PORT);
	//设置中文编码
	$sql='SET NAMES UTF8';
	mysqli_query($conn,$sql);
	//var_dump($userName);
	
	$sql="SELECT id FROM m_user where user_name='$userName'";
	//var_dump($sql);
	$result=mysqli_query($conn,$sql);
	if ( $row=mysqli_fetch_assoc($result) ) //如果用户名已存在
	{
		echo false;
	}else{
		echo true;
	}
?>