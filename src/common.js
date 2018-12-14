import urls from './rest-mapping';
import conf from './config';
import axios from 'axios';

export default {
  UA: navigator.userAgent,
  isMobile (){
    return !!this.UA.match(/AppleWebKit.*Mobile.*/); 
  },
  isAndroid (){
    return this.UA.indexOf('Android') > -1 || this.UA.indexOf('Adr') > -1;
  },
  isIOS (){
    return !!this.UA.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  },
  
  alipay_url: 'alipays://platformapi/startapp?appId=20000123&actionType=scan&biz_data=',
  REST_REQ_URL: process.env.RESUEST_HOST,
  instance: null,
  getInstance () {
    this.instance = axios.create({
      baseURL: this.REST_REQ_URL,
      timeout: conf.timeout
    });
    this.instance.interceptors.request.use((config) => {
      // customize headers
      // config.headers.Authorization = 'Authorization Token';
      return config;
    }, error => Promise.reject(error));

    this.instance.interceptors.response.use((res) => {
      return res;
    }, (error) => {
      const res = error.response;
      if (res) {
        if (res.status === 401) {
          //logout
        } else {
          alert(conf.SERVER_ERROR_MESSAGE);
        }
      } else {
        if(!navigator.onLine){
          alert(conf.NETWORK_EXCEPTION_MESSAGE);
        } else {
          alert(conf.SERVER_ERROR_MESSAGE);
        }
      }
      return Promise.reject(error);
    });
  },
  initAPI () {
    this.getInstance();
  },
  createAPI (key, config) {
    config = config || {};
    var $params = {};
    if(!urls[key] || !urls[key].u) throw new Error(`${conf.NOT_SET_RESTMAPPING_MESSAGE} [ ${key} ]`);
    urls[key].m = urls[key].m || 'get';
    if(urls[key].m == 'get' || urls[key].m == 'GET'){
      $params.params = config;
    } else {
      $params.data = config;
    }
    
    return this.instance({
      url: urls[key].u,
      method: urls[key].m,
      ...$params
    });
  },
  request (url, methods, config) {
    return this.createAPI(url, methods, config);
  },
  redirect (url){
    global.location.href = url;
  },
  getUrlParams () {
    var url = location.search;
    var theRequest = {};
    if (~url.indexOf('?')) {
      var str = url.substr(1);
      var strs = str.split('&');
      for(var i = 0; i < strs.length; i ++) {
        theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
      }
    }
    return theRequest;
  },
  open (url){
    global.open(url);
  },
  getQueryString (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
      r = window.location.search.substr(1).match(reg);
    return null != r ? unescape(r[2]) : null;
  }
};
