import Vue from 'vue';
import common from './common';
import compContdown from './comp-contdown';
import QRCode from 'qrcodejs2';
import './asstes/css/pay.css';

new Vue({
  mixins: [ compContdown ],
  el: '#main-container',
  data: {
    payData: {},
    countdownData: {},
    qrcodeUrl: '',
    isMobile: common.isMobile(),
    isAndroid: common.isAndroid(),
    isIOS: common.isIOS(),
    payType: 'WXPAY',
    payResultTimer: null,
    isExpired: false,
    startAlipayUrl: ''
  },
  created (){
	  common.initAPI();
  },
  methods: {
    initHandler (initData) {
      this.payData = initData;
      this.qrcodeUrl = this.payData.code_url;
      this.createQrcode(this.qrcodeUrl);
      this.payType = this.payData.pay_type;
      if (this.payType == 'ALIPAY' && this.isMobile) {
        var reg = new RegExp('^alipays:');
        if(reg.test(this.qrcodeUrl)){
          this.startAlipayUrl = this.qrcodeUrl;
        }else{
          this.startAlipayUrl = common.alipay_url + JSON.stringify( 
            { 
              's': 'money', 
              'u': common.getUrlParams().uid || 0,
              'a': this.payData.money,
              'm': `=${this.payData.remark || ''}=`
            });
        }
        common.redirect(this.startAlipayUrl);
      }
    },
    loadImg (url) {
	    return require(`.${url}`);
    },
    createQrcode (url) {
      var qrcode = new QRCode(this.$refs.show_qrcode_container, {
        width: 210,
        height: 210
      });

      qrcode.makeCode(url);
    },

    countDownEventHandle (data) {
      this.countdownData = data;
    },
    countDownStart () {

    },
    countDownEnd () {
      clearInterval(this.payResultTimer);
      this.isExpired = true;
    },
    getInitData (initData) {
      this.initHandler(initData);
      this.payResultTimer = setInterval(function () {
        var params = {
          orderid: common.getUrlParams().orderid
        };

        common.request('getPayResult', params).then(res=>{
          var resData = res.data;
          if (resData.code == 0) {
            if (resData.data.pay == 1) {
              clearInterval(this.payResultTimer);
              common.redirect(resData.data.url);
            }
          }
        });
      }, 2e3);
    },
    downloadQrcode (){
      if(this.payType == 'WXPAY' && this.isMobile){
        common.redirect(`http://mobile.qq.com/qrcode?url=${this.qrcodeUrl}`);
      }
    }
  }
});
