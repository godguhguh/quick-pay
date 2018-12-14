import VueCountdown from '@xkeshi/vue-countdown';
import common from './common';
export default {
  components: {
    'comp-count-down': {
      template:`
          <countdown :time='totleTime' 
                :auto-start='true' 
                @countdownstart='countdownStarted' 
                @countdownprogress='countdownProgressing' 
                @countdownend='countdownended'> 
          </countdown> `,
      data () {
        return {
          totleTime: 0
        };
      },
      components: {
        'countdown': VueCountdown
      },
      mounted () {
        this.getInitData();
      },
      methods: {
        getInitData () {
          var params = {
            orderid: common.getUrlParams().orderid
          };
          common.request('getInitData', params).then(res=>{   
            var resData = res.data;
            if (resData.code == 0) {              
              if(resData.data.length === 0) return alert('无效秘钥！');
              var times = (resData.data.use_time * 1e3 + (300 * 1e3)) - resData.time * 1e3;
              if (times <= 0) {
                alert('支付链接已失效，请重新生成！');
                return this.totleTime = 0;
              }
              this.totleTime = times;
              this.$emit('initdata', resData.data);
            }
          });
        },
        countdownStarted () {
          this.$emit('countdownstart');
        },
        countdownProgressing (days) {
          if (days.hours < 0) return false;
          this.$emit('countdowndata', {
            hours: days.hours < 10 ? '0' + days.hours : days.hours.toString(),
            minutes: days.minutes < 10 ? '0' + days.minutes : days.minutes.toString(),
            seconds: days.seconds < 10 ? '0' + days.seconds : days.seconds.toString()
          });
        },
        countdownended () {
          //the end 
          this.$emit('countdownend');
        }
      }
    }
  }
};
