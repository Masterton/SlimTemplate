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
// app-list/add-app.js
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
// app-list/edit-app.js
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
// app-list/show-app-list.js
// 获取应用列表信息
function getAppList(app_id) {
    var req_data = {};
    if(!isNaN(app_id)) {
        req_data = {
            id: app_id
        };
    }
    $.ajax({
        url: App.mergePath('/api/app/'),
        type: 'GET',
        dataType: 'json',
        data: req_data,
        success: function(data) {
            if (data.error == 0) {
                showAppList(data.data);
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

// 显示应用列表
function showAppList(data) {
    var $tbody = $('#page-wrapper .kz-data-panel .panel-body table > tbody');
    $tbody.empty();
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        var $tr = $([
            '<tr data-app-id="', item.id, '">',
                '<td>', item.id, '</td>',
                '<td>', item.name, '</td>',
                '<td>', item.cn_name, '</td>',
                '<td>',
                    '<div class="btn-group">',
                        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                            '操作 <span class="caret"></span>',
                        '</button>',
                        '<ul class="dropdown-menu">',
                            '<li><a data-action="delete" href="javascript:;">删除</a></li>',
                            '<li app="separator" class="divider"></li>',
                            '<li><a data-action="detail" href="javascript:;">查看详细</a></li>',
                        '</ul>',
                    '</div>',
                '</td>',
            '</tr>'
        ].join(''));
        $tr.attr('data-app-info', JSON.stringify(item).replace(/"/g, '\\"'));
        $tbody.append($tr);
    }
}

// 绑定列表中操作列下拉项点击事件
function bindDrowdownClick() {
    var $tbody = $('#page-wrapper .kz-data-panel .panel-body table > tbody');
    $tbody.off('click').on('click', 'tr td ul.dropdown-menu li a[data-action]', function(event) {
        var action = $(this).attr('data-action');
        if(action == 'detail') {
            var $tr = $(event.target).parents('tr[data-app-id]');
            var app_info = $tr.attr('data-app-info');
            app_info = JSON.parse(app_info.replace(/\\"/g, '"'));
            showEditModal(app_info);
        }
        else if(action == 'delete') {
            notifyInfo('删除功能暂未实现');
        }
    });
}
// app-list/__call__.js
bindAddApp();
getAppList();
bindDrowdownClick();
bindModifyApp();
   });
});