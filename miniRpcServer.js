var methodList = "[add],[myfunc1]";

function add(args){
	return args[0]+args[1];
}

function myfunc1(args){
	return "myfunc1 OK";
}


//-----------------------------------------------------------------------
var http = require('http');
http.createServer(function (req, res) {
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });

  req.on('end', function () {
    //console.log(body);
    res.writeHead(200, {'Content-Type': 'application/json'}); // 设置rpc响应头部信息及编码
  	var rpcRes =  {"jsonrpc" : "2.0", "result": "","error" : null,"id" : 1 };  
    body = JSON.parse(body);
    if(body.method) { 
    	  if( methodList.indexOf('['+body.method+']') >= 0 ) 
    	  	  rpcRes.result = eval(body.method + "(body.params)");
    	  else
    	  	  rpcRes.error = {"code":-32601,"message": "Method:" + body.method + " is not support", "data":null};
    } else {  
    	  rpcRes.error = {"code":--32700,"message": "No method specified", "data":null};
    }

    res.write( JSON.stringify(rpcRes) );
    res.end();
  });
}).listen(3000);
