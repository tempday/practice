<?php
	$user=$_POST['user'];
	$pwd=$_POST['pwd'];
	//执行数据库操作
	$conn=mysqli_connect('127.0.0.1','lglong519','123','myCart');
	//设置中文编码
	$sql='SET NAMES UTF8';
	mysqli_query($conn,$sql);
	$sql="INSERT INTO m_user(id,user_name,pwd) VALUES (NULL,'$user','$pwd')";
	mysqli_query($conn,$sql);
	$sql="SELECT id FROM m_user where user_name='$user'";
	//var_dump($sql);
	$result=mysqli_query($conn,$sql);
	if ( $row=mysqli_fetch_assoc($result) ) //如果成功添加用户
	{
		echo true;
	}else{
		echo false;
	}
?>