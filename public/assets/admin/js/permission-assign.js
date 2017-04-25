define(['jquery', 'utils', 'dialog', 'jquery-ui', 'bootstrap-notify', 'bootstrap-select-zh_CN', 'metisMenu'], function($, utils, dialog) {
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
// permission-assign/__call__.js
// 获取角色列表
function getRoleList() {
    $.ajax({
        url: App.mergePath('/api/role/'),
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function(data) {
            if (data.error == 0) {
                renderRoleList(data.data);
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

// 显示角色列表
function renderRoleList(data) {
    var $elem = $('#page-wrapper .sel-role.selectpicker');
    $elem.data('data-source', data);
    $elem.attr('title', '请选择角色');
    for (var i = 0; i < data.length; i++) {
        var $option = $([
            '<option value="', data[i].id, '">',
                data[i].cn_name,
                '(',
                data[i].name,
                ')',
            '</option>'
        ].join(''));
        if(data[i].manage && data[i].predefine) {
            $option.attr('disabled', true);
        }
        $elem.append($option);
    }
    $elem.selectpicker({
        liveSearch: true
    });
    $elem.on('shown.bs.select', function(event) {
        var a = $(this).selectpicker('val');
        if(isNumber(a)) {
            $(this).data('data-old-value', a);
        }
    });
    $elem.on('changed.bs.select', function(event, clickedIndex, newValue, oldValue) {
        var $sel = $(this);
        var a = $sel.selectpicker('val'),
            oa = $sel.data('data-old-value');
        var changed = false;
        // if(oa) {
        //     $sel.selectpicker('val', oa);
        //     $elem.trigger('blur');
        //     dialog.confirm('数据已修改但未保存, 确定不保存就切换角色吗?', '温馨提示', function() {
        //         $sel.selectpicker('val', a);
        //     }, function() {
        //     }, true);
        // }
        getPermissionsByRole(a, renderPermissionsOfRole);
    });
}

// 获取权限(操作)列表
function getPermissionList() {
    $.ajax({
        url: App.mergePath('/api/permission/'),
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function(data) {
            if (data.error == 0) {
                renderPermissionList(data.data);
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

// 显示权限(操作)
function renderPermissionList(data, re_render) {
    var $elem = $('#page-wrapper .permission-list');
    var used_list = [];
    if(re_render) {
        used_list = data;
        data = $elem.data('data-source');
    }
    else {
        $elem.data('data-source', data);
    }
    $elem.empty();
    for (var i = 0; i < data.length; i++) {
        if(used_list.length > 0 && $.inArray(data[i].id, used_list) > -1) {
            continue;
        }
        var $li = $([
            '<li data-id="', data[i].id, '" data-name="', data[i].name, '">',
                '<div>', data[i].cn_name, '</div>',
            '</li>'
        ].join(''));
        $li.addClass('fc-field');
        $elem.append($li);
    }
}

// 根据角色id　获取其所分配的权限
function getPermissionsByRole(role_id, call_back) {
    $.ajax({
        url: App.mergePath('/api/permission/'),
        type: 'GET',
        dataType: 'json',
        data: {
            role: role_id
        },
        success: function(data) {
            if (data.error == 0) {
                if(typeof call_back == 'function') {
                    call_back(data.data);
                }
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

function renderPermissionsOfRole(data) {
    var $elem = $('#page-wrapper .role-permissions-list');
    $elem.empty();
    $elem.data('data-source', data);
    var used_list = [];
    for(var i = 0; i < data.length; i++) {
        var $li = $([
            '<li data-id="', data[i].id, '" data-name="', data[i].name, '">',
                '<div>', data[i].cn_name, '</div>',
            '</li>'
        ].join(''));
        $li.addClass('fc-field');
        $elem.append($li);
        used_list.push(data[i].id);
    }
    $elem.data('data-used-ids', used_list);
    // 重新渲染全部权限列表
    renderPermissionList(used_list, true);
    $('#page-wrapper .permission-list').sortable('enable');
}

// 自动调整高度
function resizeAutoHeight()　{
    $(window).on('resize', function() {
        var $permission_list = $('#page-wrapper .permission-list');
        var _tmp = setTimeout(function() {
            $permission_list.removeData('adjust-height-handler');
            var max_h = parseInt($('#page-wrapper').css('min-height').replace('px', ''));
            $permission_list.height(max_h -50 - 38);
            $('#page-wrapper .role-permissions-list').height($permission_list.height() - 19);
        }, 33);
        var old_handler = $permission_list.data('adjust-height-handler');
        if(old_handler) {
            clearTimeout(old_handler);
        }
        $permission_list.data('adjust-height-handler', _tmp);
    });
    $(window).css('overflow-y', 'hidden').trigger('resize');
}

// 角色所分配的权限移动
function bindPermissionOfRoleMove() {
    $('#page-wrapper .permission-list').sortable({
        revert: 'invalid',
        connectWith: "#page-wrapper .role-permissions-list",
        items: "li.fc-field",
        cancel: "li.fc-disabled",
        disabled: true
    });
    $('#page-wrapper .role-permissions-list').sortable({
        revert: 'invalid',
        connectWith: "#page-wrapper .permission-list",
        items: "li.fc-field",
        cancel: "li.fc-disabled",
        start: function(event, ui) {
            // var start_pos = ui.item.index();
            // ui.item.data('start_pos', start_pos);
        },
        change: function(event, ui) {
            // var start_pos = ui.item.data('start_pos');
            // var index = ui.placeholder.index();
            // if (start_pos < index) {
            //     $('#sortable li:nth-child(' + index + ')').addClass('highlights');
            // } else {
            //     $('#sortable li:eq(' + (index + 1) + ')').addClass('highlights');
            // }
        },
        update: function(event, ui) {
            // $('#sortable li').removeClass('highlights');
            var $self = $(this);
            var used_list = $self.data('data-used-ids');
            if(!used_list || (typeof used_list !== 'array')) {
                used_list = [];
            }
            var $children = $self.children('li.fc-field');
            var changed = false;
            if($children.length == used_list.length) {
                if($children.length > 0) {
                    for(var i = 0; i < $children.length; i++) {
                        var $item = $($children[i]);
                        if($.inArray($item.attr('data-id'), used_list) < 0) {
                            changed = true;
                            break;
                        }
                    }
                }
            }
            else {
                changed = true;
            }
            if(changed) {
                $('#page-wrapper .btn-save').removeAttr('disabled');
            }
            else {
                $('#page-wrapper .btn-save').attr('disabled', true);
            }
        }
    });
}

// 获取权限分配改变情况
function getChanged() {
    var $elem = $('#page-wrapper .role-permissions-list');
    var used_list = $elem.data('data-used-ids');
    var $children = $elem.children('li.fc-field');
    var add_list = [], // 新增的
        del_list = [], // 删除的
        normal_list = []; // 未改变的
    var all_list = [];
    if($children.length > 0) {
        for(var i = 0; i < $children.length; i++) {
            var $item = $($children[i]);
            var op_id = $item.attr('data-id');
            op_id = parseInt(op_id);
            if(used_list.length > 0) {
                if($.inArray(op_id, used_list) < 0) {
                    // 新增的
                    add_list.push(op_id);
                }
                else {
                    // 未改变
                    normal_list.push(op_id);
                }
            }
            else {
                add_list.push(op_id);
            }
            all_list.push(op_id);
        }
        add_list = $.unique(add_list);
        normal_list = $.unique(normal_list);
        all_list = $.unique(all_list);
        // 如果旧的里面有，但是当前数据里没有，则说明是删除的
        for (var m = 0; m < used_list.length; m++) {
            if($.inArray(used_list[m], all_list) < 0) {
                del_list.push(used_list[m]);
            }
        }
    }
    else {
        if(used_list.length > 0) {
            del_list = used_list;
        }
    }
    del_list = $.unique(del_list);
    return {
        added: add_list,
        deleted: del_list,
        all: all_list
    };
}

// 发送保存的请求
function requestSave(changed_data) {
    var role_id = $('#page-wrapper .sel-role.selectpicker').selectpicker('val');
    if(isNumber(role_id)) {
        if(changed_data.added.length > 0 || changed_data.deleted.length > 0) {
            $.ajax({
                url: App.mergePath('/api/role_permission/'),
                type: 'PUT',
                dataType: 'json',
                data: {
                    role: role_id,
                    added: changed_data.added.join(','),
                    deleted: changed_data.deleted.join(',')
                },
                success: function(data) {
                    if(data.error == 0) {
                        $('#page-wrapper .role-permissions-list').data('data-used-ids', changed_data.all);
                        $('#page-wrapper .btn-save').attr('disabled', true);
                        notifySuccess(data.desc);
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
        else {
            notifyInfo('没有要修改的数据，操作已取消');
            $('#page-wrapper .btn-save').attr('disabled', true);
        }
    }
    else {
        notifyDanger('未选择角色');
        $('#page-wrapper .btn-save').attr('disabled', true);
    }
}

// 保存按钮事件绑定
function bindSaveButton() {
    var $btn_save = $('#page-wrapper .btn-save');
    // 默认禁用保存按钮
    $btn_save.attr('disabled', true);
    $btn_save.off('click').on('click', function() {
        var changed = getChanged();
        requestSave(changed);
    });
}

getRoleList();
getPermissionList();
resizeAutoHeight();
bindPermissionOfRoleMove();
bindSaveButton();
   });
});