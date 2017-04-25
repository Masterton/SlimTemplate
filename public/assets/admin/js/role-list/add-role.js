// 发送添加角色的请求
function requestAddRole(name, cn_name, manage) {
    var req_data = {
        'name': name,
        'cn_name': cn_name
    };
    console.log(manage)
    if(manage) {
        req_data['manage'] = true;
    }
    $.ajax({
        url: App.mergePath('/api/role/'),
        type: 'POST',
        dataType: 'json',
        data: req_data,
        success: function(data) {
            if (data.error == 0) {
                $('#role-add-modal').modal('hide');
                notifySuccess(data.desc);
                getRoleList();
            } else {
                notifyDanger(data.desc);
            }
        },
        error: function(info) {
            if (info.responseJSON) {
                notifyDanger(info.responseJSON['desc'] || info.responseJSON['message']);
            }
        }
    });
}

// 绑定添加角色事件
function bindAddRole() {
    var $modal = $('#role-add-modal');
    $modal.find('[name="btn-add-submit"]').off('click').on('click', function() {
        var $name = $modal.find('[name="txt-name"]'),
            $cn_name = $modal.find('[name="txt-cn_name"]'),
            $manage = $modal.find('[name="chk-manage"]');
        var txt_name = $name.val(),
            txt_cn_name = $cn_name.val(),
            chk_manage = $manage.prop('checked');
        if((/^[a-z_]{2,36}$/i).test(txt_name)) {
            if(txt_cn_name.length <= 20 && txt_cn_name.length >= 2) {
                requestAddRole(txt_name, txt_cn_name, chk_manage);
            }
            else {
                notifyDanger('角色(中文名)长度(长度: 2~20)验证失败');
                $cn_name.focus();
            }
        }
        else {
            notifyDanger('角色(英文名)格式(长度: 2~36, 只能包含大小写字母和下划线)验证失败');
            $name.focus();
        }
    });
}