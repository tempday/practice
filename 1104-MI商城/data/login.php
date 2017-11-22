<?php
	$user=$_POST['user'];
	$pwd=$_POST['pwd'];
	@$json=$_POST['json'];

	$conn=mysqli_connect('127.0.0.1','lglong519','123','myCart');
    //设置中文编码
    $sql='SET NAMES UTF8';
    mysqli_query($conn,$sql);
    //验证用户名和密码
	$sql="SELECT id FROM m_user where user_name='$user' and pwd='$pwd'";
	$result=mysqli_query($conn,$sql);
	//验证通过后,将localStorage 更新到用户信息
	if ( $row=mysqli_fetch_assoc($result) ) //如果成功验证
	{
		if($json!=''){
        	$data=json_decode($json);
       		for($i=1;$i<count($data);$i++){
        		$pnum=$data[$i]->{'pnum'};
        		$pid=$data[$i]->{'pid'};
        		$sql="SELECT state FROM m_user_order where user_name='$user' and pid='$pid'";
        		$check=mysqli_query($conn,$sql);
        		if ( $ckRow=mysqli_fetch_assoc($check) ){
                	$sql="update m_user_order set pnum=pnum+'$pnum' where user_name='$user' and pid='$pid'";
                	 mysqli_query($conn,$sql);
                }else{
        			$sql="INSERT INTO m_user_order(id,user_name,pnum,pid,state) VALUES (NULL,'$user','$pnum','$pid',1)";
        			mysqli_query($conn,$sql);
        		}
        	}
        }
        ///*
        $sql="SELECT p.pid, p.pic, p.pname, p.price, u.pnum from m_products as p,m_user_order as u WHERE u.user_name='$user' and u.pid=p.pid and u.state=1";
        $result=mysqli_query($conn,$sql);
        $output=[];
        while ( $row=mysqli_fetch_assoc($result) )//不用写 !=NULL
        {
        	$output[]=$row;
        }
        	//	向客户端输出响应消息主体
        $jsonString=json_encode($output);//以json字符串方式编码
        echo $jsonString;
        //*/

	}else{
		echo false;
	}
?>