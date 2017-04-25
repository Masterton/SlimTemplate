// 获取角色列表信息
function getRoleList(role_id) {
    var req_data = {};
    if(!isNaN(role_id)) {
        req_data = {
            id: role_id
        };
    }
    $.ajax({
        url: App.mergePath('/api/role/'),
        type: 'GET',
        dataType: 'json',
        data: req_data,
        success: function(data) {
            if (data.error == 0) {
                showRoleList(data.data);
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

// 显示角色列表
function showRoleList(data) {
    var $tbody = $('#page-wrapper .kz-data-panel .panel-body table > tbody');
    $tbody.empty();
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var $tr = $([
            '<tr data-role-id="', item.id, '">',
                '<td>', item.id, '</td>',
                '<td>', item.name, '</td>',
                '<td>', item.cn_name, '</td>',
                '<td>', (item.manage == 1 ? '是' : '否'), '</td>',
                '<td>',
                    '<div class="btn-group">',
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
        $tr.attr('data-role-info', JSON.stringify(item).replace(/"/g, '\\"'));
        $tbody.append($tr);
    }
}

// 绑定列表中操作列下拉项点击事件
function bindDrowdownClick() {
    var $tbody = $('#page-wrapper .kz-data-panel .panel-body table > tbody');
    $tbody.off('click').on('click', 'tr td ul.dropdown-menu li a[data-action]', function(event) {
        var action = $(this).attr('data-action');
        if(action == 'detail') {
            var $tr = $(event.target).parents('tr[data-role-id]');
            var role_info = $tr.attr('data-role-info');
            role_info = JSON.parse(role_info.replace(/\\"/g, '"'));
            showEditModal(role_info);
        }
        else if(action == 'delete') {
            notifyInfo('删除功能暂未实现');
        }
    });
}