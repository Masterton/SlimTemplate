// 发送添加用户的请求
function requestAddUser(username, email, password) {
    $.ajax({
        url: App.mergePath('/api/user/'),
        type: 'POST',
        dataType: 'json',
        data: {
            'username': username,
            'email': email,
            'password': password
        },
        success: function(data) {
            if (data.error == 0) {
                $('#user-add-modal').modal('hide');
                notifySuccess(data.desc);
            } else {
                notifyDanger(data.desc);
            }
        },
        error: function(info) {
            if (info.responseJSON) {
                notifyDanger(info.responseJSON['desc']);
            }
        }
    });
}

// 绑定添加用户事件
function bindAddUser() {
    var $modal = $('#user-add-modal');
    $modal.find('[name="btn-add-submit"]').off('click').on('click', function() {
        var $username = $modal.find('[name="txt-real-name"]'),
            $email = $modal.find('[name="txt-email"]'),
            $password = $modal.find('[name="txt-password"]');
        var txt_username = $username.val(),
            txt_email = $email.val(),
            txt_password = $password.val();
        if(txt_username.length <= 20 && txt_username.length >=2) {
            if(utils.regex.isEmail(txt_email)) {
                if(txt_password.length < 1) {
                    txt_password = '123456';
                }
                if(txt_password.length <= 20 && txt_password.length >= 6) {
                    requestAddUser(txt_username, txt_email, txt_password);
                }
                else {
                    notifyDanger('密码长度(长度: 6~20)验证失败');
                    $password.focus();
                }
            }
            else {
                notifyDanger('email格式验证失败');
                $email.focus();
            }
        }
        else {
            notifyDanger('真实姓名长度(长度: 2~20)验证失败');
            $username.focus();
        }
    });
}