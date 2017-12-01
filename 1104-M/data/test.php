<?php
//$conn = mysql_connect(SAE_MYSQL_HOST_M.':'.SAE_MYSQL_PORT,'o14154xozo','jkj54z4jy4305i024ylhxm3lz253jy404j1j02hk');
$conn = mysqli_connect(SAE_MYSQL_HOST_M, SAE_MYSQL_USER, SAE_MYSQL_PASS,  SAE_MYSQL_DB, SAE_MYSQL_PORT);
echo '开始连接<br>';
$sql='SET NAMES UTF8';
	mysqli_query($conn,$sql);
$sql="SELECT id FROM m_user where user_name=123";
$result=mysqli_query($conn,$sql);
$output=[];
	if ( $row=mysqli_fetch_assoc($result) ) //如果用户名已存在
	{
		$output[]=$row;
		$jsonString=json_encode($output);//以json字符串方式编码
        	echo $jsonString;
	}else{
		echo 'mysql失败';
	}
?>