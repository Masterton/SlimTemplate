// 获取所有角色
function getRoleList() {
    $.ajax({
        url: App.mergePath('/api/role/'),
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function(data) {
            if (data.error == 0) {
                $('#user-edit-modal').data('data-role-list', data.data);
            } else {
                notifyDanger(data.desc);
            }
        },
        error: function(info) {
            console.log(info)
            if (info.responseJSON) {
                notifyDanger(info.responseJSON['desc'] || info.responseJSON['message']);
            }
        }
    });
}

// 显示编辑窗口
function showEditModal(user_info) {
    var $modal = $('#user-edit-modal');
    $modal.find('input[name="txt-real-name"]').attr('data-username', user_info.username).val(user_info.username);
    $modal.find('input[name="txt-email"]').attr('data-email', user_info.email).val(user_info.email);
    var $sel = $modal.find('select[name="sel-role"]');
    if($sel.children('option').length < 2) {
        var role_list = $('#user-edit-modal').data('data-role-list');
        if(role_list && role_list.length > 0) {
            for(var i = 0; i < role_list.length; i++) {
                var $option = $([
                    '<option value="', role_list[i].id, '">',
                        role_list[i].cn_name,
                    '</option>'
                ].join(''));
                $sel.append($option);
            }
        }
    }
    if(user_info.role.id) {
        $sel.attr('data-role', user_info.role.id).val(user_info.role.id);
    }
    else {
        $sel.removeAttr('data-role').val(-1);
    }
    $modal.find('[name="btn-edit-submit"]').attr('data-user-id', user_info.id);
    $modal.modal('show');
}

// 绑定修改用户信息提交事件
function bindModifyUser() {
    var $modal = $('#user-edit-modal');
    $modal.find('[name="btn-edit-submit"]').off('click').on('click', function() {
        var $username = $modal.find('[name="txt-real-name"]'),
            $email = $modal.find('[name="txt-email"]'),
            $password = $modal.find('[name="txt-password"]'),
            $role = $modal.find('[name="sel-role"]');
        var old_username = $username.attr('data-username'),
            old_email = $email.attr('data-email'),
            old_role = $role.attr('data-role');
        var txt_username = $username.val(),
            txt_email = $email.val(),
            txt_password = $password.val(),
            role_value = $role.val();
        var req_data = {},
            modified = false;
        if(txt_username != old_username) {
            if(txt_username.length <= 20 && txt_username.length >=2) {
                req_data['username'] = txt_username;
                modified = true;
            }
            else {
                notifyDanger('真实姓名长度(长度: 2~20)验证失败');
                $username.focus();
                return;
            }
        }
        if(txt_email != old_email) {
            if(utils.regex.isEmail(txt_email)) {
                req_data['email'] = txt_email;
                modified = true;
            }
            else {
                notifyDanger('email格式验证失败');
                $email.focus();
                return;
            }
        }
        if(txt_password.length > 0) {
            if(txt_password.length <= 20 && txt_password.length >= 6) {
                req_data['password'] = password;
                modified = true;
            }
            else {
                notifyDanger('密码长度(长度: 6~20)验证失败');
                $password.focus();
                return;
            }
        }
        if(role_value && role_value != old_role && isNumber(role_value)) {
            req_data['role'] = role_value;
            modified = true;
        }
        if(modified) {
            req_data['id'] = $(this).attr('data-user-id');
            requestModifyUser(req_data);
        }
        else {
            notifyWarning('数据未修改, 操作已取消');
        }
    });
}

// 发送修改用户的请求
function requestModifyUser(req_data) {
    $.ajax({
        url: App.mergePath('/api/user/'),
        type: 'PUT',
        dataType: 'json',
        data: req_data,
        success: function(data) {
            if (data.error == 0) {
                getUserList();
                var $modal = $('#user-edit-modal');
                $modal.find('[name="btn-edit-submit"]').removeAttr('data-user-id');
                $modal.modal('hide');
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