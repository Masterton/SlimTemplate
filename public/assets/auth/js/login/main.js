/**
 * 绑定表单提交
 */
function bindFormSubmit() {
    $('#btn-login').off('click').on('click', function(event) {
        var account = $('#txt-account').val(),
            password = $('#txt-password').val(),
            remember = $('#chk-remember').prop('checked');
        if((/^[a-zA-Z0-9]{5,18}$/).test(account) || utils.regex.isEmail(account)) {
            var pwd_cfg = {
                min: 5,
                max: 18,
                number: false,
                big: false,
                small: false,
                special: false
            };
            // 目前只限制长度
            var is_pwd = utils.isPassword(password, pwd_cfg);
            if(utils.isPassword(password, pwd_cfg)) {
                var submit_data = {
                    account: account,
                    password: password
                };
                if(remember) {
                    submit_data['remember'] = 'remember';
                }
                $.ajax({
                    url: App.mergePath('/auth/login/'),
                    type: 'POST',
                    dataType: 'json',
                    data: submit_data,
                    success: function(data) {
                        if (data.error == 0) {
                            window.location.href = data.data.url;
                        } else {
                            notifyDanger(data.desc);
                        }
                    },
                    error: function(info) {
                        if (info.responseJSON) {
                            notifyDanger(info.responseJSON['desc'], 'warning');
                        }
                    }
                });
            }
            else {
                $('#txt-password').focus();
                notifyWarning('密码必须是6～18位长度的大写或小写字母、数字、常见字符(英文)的组合');
            }
        }
        else {
            $('#txt-account').focus();
            notifyWarning('帐号必须是5～18位大消息字母和数字的组合，或者电子邮箱');
        }
        // event.preventDefault();
        // return false;
    });
    $('.form-signin').off('keypress').on('keypress', function(e) {
        if ((e.keyCode || e.which) == 13) {
            $('#btn-login').trigger('click');
        }
    });
}