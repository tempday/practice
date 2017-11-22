<?php
	@$json=$_POST['json'];
	//$str='[{"username":"localhost1"},{"pid":"001","pnum":"8"},{"pid":"002","pnum":"2"},{"pid":"003","pnum":"6"},{"pid":"009","pnum":"5"}]';
	//$data=json_decode($str);
	$data=json_decode($json);
	$user=$data[0]->{'username'};
	$state=1;
	$conn=mysqli_connect('127.0.0.1','lglong519','123','myCart');
    //设置中文编码
    $sql='SET NAMES UTF8';
    mysqli_query($conn,$sql);
    $sql="update m_user_order set state=0 where user_name='$user'";
    mysqli_query($conn,$sql);
	for($i=1;$i<count($data);$i++){
		$pnum=$data[$i]->{'pnum'};
		$pid=$data[$i]->{'pid'};
		$sql="INSERT INTO m_user_order(id,user_name,pnum,pid,state) VALUES (NULL,'$user','$pnum','$pid',1)";
		mysqli_query($conn,$sql);
	}
	echo '成功更新用户信息';
?>