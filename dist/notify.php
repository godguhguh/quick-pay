<?php
include 'functions.php';
include 'pxpay/Pxpay.php';

//支付完成通知。
//本页面必须外网可以访问。否则无法获取通知。
//通知一共访问5次，支付完成时，1分钟，5分钟，15分钟
$args = [];

$args['order_id'] = $_GET['order_id'];
$args['rndstr'] = $_GET['rndstr'];
$args['money'] = $_GET['money'];
$args['out_order_id'] = $_GET['out_order_id'];
$args['pay_type'] = $_GET['pay_type'];
$args['sign'] = $_GET['sign'];

$pxpay = new pxpay\Pxpay();
//	$pxpay->init('自己的商户id', '自己的商户密钥');
$orderid = $args['order_id'];

//----演示站为了让商户ID 和密钥 动态输入.保存了商户ID 和密钥.实际运营请删除这三行---				
$order = getOrder($orderid);
if($order && isset($order['merchantId'])){
	$pxpay->init($order['merchantId'], $order['merchantSecret']);
}
//END-------------------------------------------------------------------------------

if($pxpay->checkNotify($args)){
    
    if($order && $order['status'] == 0){
        $order['status'] = 1;
        //只有正常订单才能被完成。防止订单多次重复完成
        setOrder($order);
    }
    //只有返回SUCCESS,才表示通知成功。否则，系统会重复发送通知
    echo 'SUCCESS';
}else{
    echo '签名错误';
}
die();