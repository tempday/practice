<?php
	$userName=$_POST['user'];
	//执行数据库操作
	$conn=mysqli_connect('127.0.0.1','lglong519','123','myCart');
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