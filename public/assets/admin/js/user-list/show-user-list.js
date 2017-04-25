// 获取用户列表
function getUserList(user_id) {
    var req_data = {};
    if(!isNaN(user_id)) {
        req_data = {
            id: user_id
        };
    }
    $.ajax({
        url: App.mergePath('/api/user/'),
        type: 'GET',
        dataType: 'json',
        data: req_data,
        success: function(data) {
            if (data.error == 0) {
                showUserList(data.data);
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

// 包装角色对象
function wrapperRole(role_data) {
    if(!role_data.id) {
        return '<div class="sstext-gray">&lt;未分配&gt;</div>';
    }
    var $div = $([
        '<div><div data-id="', role_data.id, '">',
            role_data.cn_name,
        '</div></div>'
    ].join(''));
    $div.find('[data-id]').attr('data-role', JSON.stringify(role_data).replace(/"/g, '\\"'));
    return $div.html();
}

// 绑定列表中操作列下拉项点击事件
function bindDrowdownClick() {
    var $tbody = $('#page-wrapper .kz-data-panel .panel-body table > tbody');
    $tbody.off('click').on('click', 'tr td ul.dropdown-menu li a[data-action]', function(event) {
        var action = $(this).attr('data-action');
        if(action == 'detail') {
            var $tr = $(event.target).parents('tr[data-user-id]');
            var user_info = $tr.attr('data-user-info');
            user_info = JSON.parse(user_info.replace(/\\"/g, '"'));
            showEditModal(user_info);
        }
        else if(action == 'delete') {
            notifyInfo('删除功能暂未实现');
        }
    });
}

// 显示用户列表
function showUserList(data) {
    var $tbody = $('#page-wrapper .kz-data-panel .panel-body table > tbody');
    $tbody.empty();
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var $tr = $([
            '<tr data-user-id="', item.id, '">',
                '<td>', item.id, '</td>',
                '<td>', item.username, '</td>',
                '<td>', item.email, '</td>',
                '<td>', wrapperRole(item.role), '</td>',
                '<td>',
                    '<div class="btn-group dropdown">',
                        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                            '操作 <span class="caret"></span>',
                        '</button>',
                        '<ul class="dropdown-menu">',
                            '<li><a data-action="delete" href="javascript:;">删除</a></li>',
                            '<li role="separator" class="divider"></li>',
                            '<li><a data-action="detail" href="javascript:;">查看详细</a></li>',
                        '</ul>',
                    '</div>',
                '</td>',
            '</tr>'
        ].join(''));
        $tr.attr('data-user-info', JSON.stringify(item).replace(/"/g, '\\"'));
        $tbody.append($tr);
    }
}