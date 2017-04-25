define(['jquery', 'utils', 'bootstrap-notify', 'metisMenu'], function($, utils) {
   'use strict';
   $(function() {
      // merge-common/js/notify.js
/**
 * notify　提示
 */
function _notify(msg, close_callback, callback_params, type, speed) {
    if(!type) {
        type = 'info';
    }
    if(!speed) {
        speed = 1600;
    }
    $.notify({
        message: msg
    }, {
        type: type,
        delay: speed,
        timer: 200,
        z_index: 1051, // z-index of bootstrap-modal is 1050
        placement: {
            align: 'center'
        },
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        onClose: function() {
            if(typeof close_callback == 'function') {
                close_callback(callback_params);
            }
        }
    });
}

/**
 * notify-success
 */
function notifySuccess(msg, close_callback, callback_params) {
    _notify(msg, close_callback, callback_params, 'success');
}

/**
 * notify-info
 */
function notifyInfo(msg, close_callback, callback_params) {
    _notify(msg, close_callback, callback_params, 'info');
}

/**
 * notify-warning
 */
function notifyWarning(msg, close_callback, callback_params) {
    _notify(msg, close_callback, callback_params, 'warning');
}

/**
 * notify-danger
 */
function notifyDanger(msg, close_callback, callback_params) {
    _notify(msg, close_callback, callback_params, 'danger');
}
// layout/startmin.js
$('#side-menu').metisMenu();

// Loads the correct sidebar on window load,
// collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
// $(window).bind("load resize", function() {
//     var topOffset = 50;
//     var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
//     if (width < 768) {
//         $('div.navbar-collapse').addClass('collapse');
//         topOffset = 100; // 2-row-menu
//     } else {
//         $('div.navbar-collapse').removeClass('collapse');
//     }

//     var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
//     height = height - topOffset;
//     if (height < 1) height = 1;
//     if (height > topOffset) {
//         $("#page-wrapper").css("min-height", (height) + "px");
//     }
// });

var element = $('ul.nav a').filter(function() {
    var current_id = $(this).parent().attr('sidebar-id');
    return current_id && (current_id == GLOBAL.PAGE_ID);
}).addClass('active').parent().parent().addClass('in').parent();
if (element.is('li')) {
    element.addClass('active').addClass('sidebar-highlight');
}

function adjustHeight() {
    var top_height = $('.navbar > .navbar-header').height(),
        max_height = $(window).height();
    $('.sidebar .sidebar-nav').height(max_height - top_height - 8);
    $('#page-wrapper').css('min-height', ($('.sidebar .sidebar-nav').height() + 35) + 'px');
}
// layout/__call__.js
// 判断是否是数字
function isNumber(a) {
    return (
        (typeof a == 'number') ||
        (
            (typeof a == 'string') &&
            a.length > 0 &&
            !isNaN(a)
        )
    );
}

adjustHeight();

$(window).off('resize').on('resize', function() {
    adjustHeight();
});
// role-list/add-role.js
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
// role-list/edit-role.js
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
// role-list/show-role-list.js
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
// role-list/__call__.js
bindAddRole();
getRoleList();
bindDrowdownClick();
bindModifyRole();
   });
});