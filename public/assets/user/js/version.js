define(['jquery', 'utils', 'dialog', 'bootstrap-notify'], function($, utils, dialog) {
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
// merge-common/js/highlight-current.js
function highlightCurrent() {
    var $current_bar = $('#navbar').find('li[data-bar="' + GLOBAL.CURRENT + '"]');
    if($current_bar.length > 0) {
        if(!$current_bar.hasClass('nav-current')) {
            $current_bar.addClass('nav-current');
        }
    }
}

highlightCurrent();
// version/list.js
/**
 * 获取文件信息
 */
function getFileInfo() {
    return {
        id: parseInt(utils.getUrlParam('file')),
        hash: utils.getUrlParam('hash'),
        name: decodeURI(utils.getUrlParam('name')),
        versions: GLOBAL.FILE_VERSIONS
    };
}

/**
 * 显示文件版本
 */
function showFileVersions(info) {
    var iv = info.versions;
    var $tb = $('#tb-versions');
    var $tbody = $tb.children('tbody');
    $tbody.empty();
    $tb.removeData('data-version-info');
    if(iv && iv.length > 0) {
        $tb.data('data-version-info', info);
        for (var i = 0; i < iv.length; i++) {
            var $tr = wrapperVersionLine(iv[i]);
            $tbody.append($tr);
        }
    }
    else {
        $tbody.append([
            '<tr>',
                '<td colspan="7">',
                    '<span class="text-center>获取数据失败</span>',
                '</td>',
            '</tr>'
        ].join(''));
    }
}

/**
 * 版本信息每一行的html生成
 */
function wrapperVersionLine(version_item) {
    var $tr = $([
        '<tr data-id="', version_item.id, '">',
            '<td data-version="', version_item.number, '">', version_item.number, '</td>',
            '<td>', (!isNaN(version_item.size) ? utils.formatFileSize(version_item.size) : '-'), '</td>',
            '<td>', version_item.md5, '</td>',
            '<td>', version_item.upload_time, '</td>',
            '<td class="col-view">',
                '<a href="javascript:;">查看</a>',
            '</td>',
            '<td class="col-use">',
                '<a href="javascript:;">重用</a>',
            '</td>',
            '<td class="col-delete">',
                '<a href="javascript:;">删除</a>',
            '</td>',
        '</tr>'
    ].join(''));
    return $tr;
}

/**
 * 重新(获取数据)显示版本信息
 */
function reShowVersions(file_id) {
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/version/'),
        type: 'GET',
        dataType: 'json',
        data: {
            file: file_id
        },
        success: function(data) {
            if(data.error == 0) {
                GLOBAL.FILE_VERSIONS = data.data;
                var info = getFileInfo();
                showFileVersions(info);
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            notifyDanger(data.desc);
        }
    });
}
// version/operation.js
/**
 * 绑定操作
 */
function bindOperation() {
    var $tb = $('#tb-versions');
    var $tbody = $tb.children('tbody');
    var info = $tb.data('data-version-info');
    $tbody.off('click').on('click', 'tr > td > a[href="javascript:;"]', function(event) {
        var $td = $(this).parent();
        var $tr = utils.latestParent($td, 'tr');
        var version_number = parseInt($tr.find('td[data-version]').attr('data-version'));
        var version_id = parseInt($tr.attr('data-id'));
        if($td.hasClass('col-view')) {
            viewVersion(info.hash, version_number);
        }
        else if($td.hasClass('col-use')) {
            useVersion(info.id, version_id);
        }
        else if($td.hasClass('col-delete')) {
            deleteVersion(info.id, version_id);
        }
    });
}

/**
 * 查看某个版本的文件
 */
function viewVersion(file_hash, version_number) {
    if ($('#redirect-from').length < 1) {
        $(document.body).append([
            '<div style="display: none;">',
                '<form id="redirect-from" target="_blank" method="GET" action="', GLOBAL.FILE_VIEW_URL, '">',
                    '<input type="hidden" name="file" value="', file_hash, '" />',
                    '<input type="hidden" name="version" value="', version_number, '" />',
                '</form>',
            '</div>'
        ].join(''));
    } else {
        $('#redirect-from').attr('action', GLOBAL.FILE_VIEW_URL);
        $('#redirect-from').find('input[name="file"]').val(file_hash);
        $('#redirect-from').find('input[name="version"]').val(version_number);
    }
    setTimeout(function() {
        $('#redirect-from').submit();
    }, 50);
}

/**
 * 使用某个版本作为文件的最新版本
 */
function useVersion(file_id, version_id) {
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/version/'),
        type: 'POST',
        dataType: 'json',
        data: {
            file: file_id,
            version: version_id
        },
        success: function(data) {
            if(data.error == 0) {
                notifySuccess(data.desc);
                reShowVersions(file_id);
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            notifyDanger(data.desc);
        }
    });
}

/**
 * 删除文件的某个版本
 */
function deleteVersion(file_id, version_id) {
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/version/'),
        type: 'DELETE',
        dataType: 'json',
        data: {
            file: file_id,
            version: version_id
        },
        success: function(data) {
            if(data.error == 0) {
                notifySuccess(data.desc);
                reShowVersions(file_id);
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            notifyDanger(data.desc);
        }
    });
}
// version/__call__.js
$('[data-toggle="tooltip"]').tooltip();

// 获取文件信息
var info = getFileInfo();
// 显示文件名
$('#file-name').text(info.name);
// 显示文件版本列表
showFileVersions(info);

bindOperation();
   });
});