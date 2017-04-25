// 发送添加角色的请求
function requestAddApp(name, cn_name, access) {
    var req_data = {
        'name': name,
        'cn_name': cn_name,
        'access': access
    };
    $.ajax({
        url: App.mergePath('/api/app/'),
        type: 'POST',
        dataType: 'json',
        data: req_data,
        success: function(data) {
            if (data.error == 0) {
                $('#app-add-modal').modal('hide');
                notifySuccess(data.desc);
                getAppList();
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
function bindAddApp() {
    var $modal = $('#app-add-modal');
    $modal.find('[name="btn-add-submit"]').off('click').on('click', function() {
        var $name = $modal.find('[name="txt-name"]'),
            $cn_name = $modal.find('[name="txt-cn_name"]'),
            $access = $modal.find('[name="txt-access"]');
        var txt_name = $name.val(),
            txt_cn_name = $cn_name.val(),
            txt_access = $access.val();
        if((/^[a-z_]{2,20}$/i).test(txt_name)) {
            if(txt_cn_name.length <= 20 && txt_cn_name.length >= 2) {
                if(txt_access.length <= 20 && txt_access.length >= 6) {
                    requestAddApp(txt_name, txt_cn_name, txt_access);
                }
                else {
                    notifyDanger('访问密钥长度(长度: 6~20)验证失败');
                    $access.focus();
                }
            }
            else {
                notifyDanger('角色名(中文)格式(长度: 2~20)验证失败');
                $cn_name.focus();
            }
        }
        else {
            notifyDanger('角色名格式(长度: 2~20, 只能包含大小写字母和下划线)验证失败');
            $name.focus();
        }
    });
}