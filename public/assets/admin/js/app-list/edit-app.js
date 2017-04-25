// 显示编辑窗口
function showEditModal(app_info) {
    var $modal = $('#app-edit-modal');
    $modal.find('input[name="txt-name"]').attr('data-name', app_info.name).val(app_info.name);
    $modal.find('input[name="txt-cn_name"]').attr('data-cn_name', app_info.cn_name).val(app_info.cn_name);
    $modal.find('[name="btn-edit-submit"]').attr('data-app-id', app_info.id);
    $modal.modal('show');
}

// 绑定修改角色信息提交事件
function bindModifyApp() {
    var $modal = $('#app-edit-modal');
    $modal.find('[name="btn-edit-submit"]').off('click').on('click', function() {
        var $name = $modal.find('[name="txt-name"]'),
            $cn_name = $modal.find('[name="txt-cn_name"]'),
            $access = $modal.find('[name="txt-access"]');
        var old_name = $name.attr('data-name'),
            old_cn_name = $cn_name.attr('data-cn_name');
        var txt_name = $name.val(),
            txt_cn_name = $cn_name.val(),
            txt_access = $access.val();
        var req_data = {},
            modified = false;
        if(txt_name != old_name) {
            if((/^[a-z_]{2,20}$/i).test(txt_name)) {
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
        if(txt_access && txt_access.length > 0) {
            if(txt_access.length <= 20 && txt_access.length >= 6) {
                req_data['access'] = txt_access;
                modified = true;
            }
            else {
                notifyDanger('访问密钥长度(长度: 6~20)验证失败');
                $access.focus();
            }
        }
        if(modified) {
            req_data['id'] = $(this).attr('data-app-id');
            $(this).removeAttr('data-app-id');
            requestModifyApp(req_data);
        }
        else {
            notifyWarning('数据未修改, 操作已取消');
        }
    });
}

// 发送修改角色信息的请求
function requestModifyApp(req_data) {
    $.ajax({
        url: App.mergePath('/api/app/'),
        type: 'PUT',
        dataType: 'json',
        data: req_data,
        success: function(data) {
            if (data.error == 0) {
                getAppList();
                var $modal = $('#app-edit-modal');
                $modal.find('[name="btn-edit-submit"]').removeAttr('data-app-id');
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