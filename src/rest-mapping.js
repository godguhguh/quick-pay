export default {
  //获取订单数据接口
  getInitData: {
    u: '/order.php?act=getorder',
    m: 'get'
  },
  //检查订单状态接口
  getPayResult: {
    u: '/order.php?act=checkorder',
    m: 'get'
  }
};
