<?php
// 自行配置跨域请求
//header('Access-Control-Allow-Origin:http://localhost:8080');
include 'functions.php';
include 'pxpay/Pxpay.php';
/**
 下订单,支付页面查询订单,获取订单支付状态
 *  */
$act = $_GET['act'];
if($act == 'new'){
    $paytype = $_GET['paytype'];
    if ($paytype != 'ALIPAY' && $paytype != 'WXPAY') {
        die('未选择支付方式');
    } else {
        $orderid = time(); //自己的订单ID,不可以重复
        $money = 0.01; //订单金额,必须有对应的二维码
        $remark = (isset($_GET['remark']) && $_GET['remark'] != '' ) ? $_GET['remark'] : false;
        if($remark){
            $money = rand(1, 100)*0.1;
        }
        // 自定义金额
        if(isset($_GET['customizemoney'])){
            if(isset($_GET['money'])){
                $money =(float)$_GET['money'];
                if($money>10000){
                    die('自定义金额不能超过1万元');
                }
            }
        }else{
            if(isset($_GET['money'])){
                $money =(float)$_GET['money'];
                if($money>1.05){
                    die('测试金额不能超过1元');
                }
            }
        }
        
        $args = [
            'money' => $money,
            'orderid' => $orderid,
            'paytype' => $paytype,
            'notify_url' => getMyUrl() . '/notify.php',
            'return_url' => getMyUrl() . '/complete.html',
        ];
		
        $pxpay = new pxpay\Pxpay();
        $appid = isset($_GET['appid'])?$_GET['appid']:false;
        $merchant_secret = isset($_GET['merchant_secret'])?$_GET['merchant_secret']:false;
        if($appid && $merchant_secret) {
            $pxpay->init(trim($appid),trim($merchant_secret));//输入自己的appid,secret
        }else if($remark){
            $pxpay->init(17830094,'5d3aabc4d37901ca476baa3ab6772471');//输入自己的appid,secret
        }
        $rs = $pxpay->addOrder($args,$remark);
        if($rs){
		    //跳转到支付页面			
            setOrder($rs);//这里存在文本文件中,实际应该存入数据库.
			$referer = $_SERVER['HTTP_REFERER'];
            $result = "";
            $userId = "2088802653923921"; // 收款人支付宝userid
			preg_match("/^http(s)?:\/\/(.*?)\//", $referer, $result);
			if(isset($_GET['homepage'])){
                $url = 'pay.html?orderid=' . $rs['orderid'] . '&uid=' . $userId;
            }else{
                $url = (sizeof($result) > 0 ? $result[0] : '/') .'pay.html?orderid=' . $rs['orderid'] . '&uid=' . $userId;
            }
            //支付链接,打开这个链接就可以支付了.返回给客户端,或者自己直接跳转
            //如果通过ajax请求本接口.就返回url,客户端拿到支付链接后,打开即可;
            header("Location: $url"); 
        }else{
            echo $pxpay->getErrorMsg();
        }
        exit();
    }
}

$orderid = $_GET['orderid'];
if($act == 'checkorder'){
	//检测订单状态
	$status = getOrder($orderid);
	$data = [
		'pay'=>isset($status['status'])?$status['status']:0,
		'url'=>'complate.html'
	];
}else{
	//支付页面，获取订单信息
	$data = getOrder($orderid);//这里从文本中加载.实际应该从数据库里读取
}

echo json(0,$data);