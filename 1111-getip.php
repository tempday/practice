<?php
	//$reIP=$_SERVER["REMOTE_ADDR"]; 
	//echo $reIP;
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
	date_default_timezone_set('Asia/Shanghai');
	@$reIP=getIP().'<br>'.date('Y-m-d H:i:s'); 
	echo $reIP;
	$arrStr = explode('.',$reIP);
	echo '<br>';
	echo $arrStr[0].'.'.$arrStr[1].'.'.$arrStr[2];
	
?>