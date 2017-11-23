<?php
	$user=$_POST['user'];
	$pwd=$_POST['pwd'];
	date_default_timezone_set('Asia/Shanghai');
	$ptime=date("Y-m-d H:i:s");
    @$reIP=getIP();
	//执行数据库操作
	$conn=mysqli_connect('127.0.0.1','lglong519','123','myCart');
	//设置中文编码
	$sql='SET NAMES UTF8';
	mysqli_query($conn,$sql);
	$sql="INSERT INTO m_user(id,user_name,pwd,ptime,pip) VALUES (NULL,'$user','$pwd','$ptime','$reIP')";
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
	function getIP() {
	if (getenv('HTTP_CLIENT_IP')) {
            		$ip = getenv('HTTP_CLIENT_IP');
            		}
            		elseif (getenv('HTTP_X_FORWARDED_FOR')) {
            		$ip = getenv('HTTP_X_FORWARDED_FOR');
            		}
            		elseif (getenv('HTTP_X_FORWARDED')) {
            		$ip = getenv('HTTP_X_FORWARDED');
            		}
            		elseif (getenv('HTTP_FORWARDED_FOR')) {
            		$ip = getenv('HTTP_FORWARDED_FOR');

            		}
            		elseif (getenv('HTTP_FORWARDED')) {
            		$ip = getenv('HTTP_FORWARDED');
            		}
            		else {
            		$ip = $_SERVER['REMOTE_ADDR'];
            		}
            		return $ip;
            	}
?>