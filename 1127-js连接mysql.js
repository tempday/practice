//创建数据库连接对象
	var conn = new ActiveXObject("ADODB.Connection");
	//创建数据集对象
	var rs = new ActiveXObject("ADODB.Recordset");
	try{
	//数据库连接串，具体配置请参考：http://www.connectionstrings.com/
	//如果不知道如何配置连接串，可以通过配置UDL文件后用文本编辑器打开获得
	var connectionstring = "Driver={MySQL ODBC 5.2w Driver};Server=localhost;Database=myDataBase;User=myUsername; Password=myPassword;Option=3;Port=3306";
	//打开连接
	conn.open(connectionstring);
	  
	//查询语句
	var sql = " select * from tb_col ";
	//打开数据集（即执行查询语句）
	rs.open(sql,conn);
	WScript.Echo(213);