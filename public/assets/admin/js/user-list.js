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
// user-list/add-user.js
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
// user-list/edit-user.js
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
// user-list/show-user-list.js
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
// user-list/__call__.js
getRoleList();
getUserList();
bindDrowdownClick();
bindAddUser();
bindModifyUser();
   });
});