<?php
function json($code, $data) {
    $rs = [
        'code' => $code,
        'time' => time(),
        'data' => $data
    ];
    echo json_encode($rs);
    die();
}
//获取本机的url，注意如果是内网，是无法被通知的。部署到外网服务器能获取支付完成通知
function getMyUrl(){
    $http_type = ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https')) ? 'https://' : 'http://';
    return $http_type. $_SERVER['HTTP_HOST'];
}
//签名，所有参数按字升序排列，去除空数据，然后拼接密钥。md5
function sign($data){
    ksort($data);
    $str = '';
    foreach ($data as $k=>$v){
        if($str){
            $str = $str.$k.$v;
        }else{
            $str = $k.$v;
        }
    }
    return md5($str.PXPAY_APP_Secret);
}

//模拟检测订单状态，实际应该在数据库中。一个订单应该只能被完成一次。
function getOrder($orderid){
//'code_url'=>'http://www.baidu.com',
//		'pay_type'=>'ALIPAY',
//		'money'=>1.01,
//		'orderId'=>'1212121212',
//		'use_time'=>time()
    
    if(file_exists($orderid)){
            $str = file_get_contents($orderid);
            return unserialize($str);
    }
    return [];
}


function setOrder($data){
    if(isset($data['orderid'])){
        $orderid = $data['orderid'];
        $dataStr = serialize($data);
            file_put_contents($orderid,$dataStr);
    }
}