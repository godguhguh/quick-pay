/* eslint-disable */
layui.use(['form'], function () {
    var form = layui.form;
    form.verify({
        customizemoney: function (value) {
            var isNumber = function(obj) {
              return /^\d{1,9}(\.{0}|\.{1}\d{1,2})?$/.test(obj);
            }
            if (!isNumber(value)) {
               return '请输入正确的金额';
            }

            if(value > 1) {
                return '收款金额不得大于1元';
            }

            if(value <= 0) {
                return '收款金额不得小于0元';
            }
        }
    });
    form.render(null, 'component-form-group');

    /* 监听提交 */
    form.on('submit(component-form-pay)', function (data) {
        
    });

});