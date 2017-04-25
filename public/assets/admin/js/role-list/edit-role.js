// 显示编辑窗口
function showEditModal(role_info) {
    var $modal = $('#role-edit-modal');
    $modal.find('input[name="txt-name"]').attr('data-name', role_info.name).val(role_info.name);
    $modal.find('input[name="txt-cn_name"]').attr('data-cn_name', role_info.cn_name).val(role_info.cn_name);
    $modal.find('input[name="chk-manage"]').attr('data-manage', role_info.manage).prop('checked', role_info.manage);
    $modal.find('[name="btn-edit-submit"]').attr('data-role-id', role_info.id);
    $modal.modal('show');
}

// 绑定修改角色信息提交事件
function bindModifyRole() {
    var $modal = $('#role-edit-modal');
    $modal.find('[name="btn-edit-submit"]').off('click').on('click', function() {
        var $name = $modal.find('[name="txt-name"]'),
            $cn_name = $modal.find('[name="txt-cn_name"]'),
            $manage = $modal.find('[name="chk-manage"]');
        var old_name = $name.attr('data-name'),
            old_cn_name = $cn_name.attr('data-cn_name'),
            old_manage = parseInt($manage.attr('data-manage')) == 1;
        var txt_name = $name.val(),
            txt_cn_name = $cn_name.val(),
            chk_manage = $manage.prop('checked');
        var req_data = {},
            modified = false;
        if(txt_name != old_name) {
            if((/^[a-z_]{2,36}$/i).test(txt_name)) {
                req_data['name'] = txt_name;
                modified = true;
            }
            else {
                notifyDanger('角色(英文名)格式(长度: 2~36, 只能包含大小写字母和下划线)验证失败');
                $name.focus();
                return;
            }
        }
        if(txt_cn_name != old_cn_name) {
            if(txt_cn_name.length <= 20 && txt_cn_name.length >= 2) {
                req_data['cn_name'] = txt_cn_name;
                modified = true;
            }
            else {
                notifyDanger('角色(中文名)长度(长度: 2~20)验证失败');
                $email.focus();
                return;
            }
        }
        if(chk_manage != old_manage) {
            req_data['manage'] = chk_manage;
            modified = true;
        }
        if(modified) {
            req_data['id'] = $(this).attr('data-role-id');
            $(this).removeAttr('data-role-id');
            requestModifyRole(req_data);
        }
        else {
            notifyWarning('数据未修改, 操作已取消');
        }
    });
}

// 发送修改角色信息的请求
function requestModifyRole(req_data) {
    $.ajax({
        url: App.mergePath('/api/role/'),
        type: 'PUT',
        dataType: 'json',
        data: req_data,
        success: function(data) {
            if (data.error == 0) {
                getRoleList();
                var $modal = $('#role-edit-modal');
                $modal.find('[name="btn-edit-submit"]').removeAttr('data-role-id');
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