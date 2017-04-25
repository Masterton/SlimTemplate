define(['jquery', 'utils', 'bootstrap-notify'], function($, utils) {
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
// asset/iframe.js
/**
 * 调整 iframe 高度
 */
function iframeResponsive() {
    // https://css-tricks.com/NetMag/FluidWidthVideo/Article-FluidWidthVideo.php
    var $iframe = $('.iframe-wrapper').find('iframe');
    var h = $iframe.outerHeight(true),
        w = $iframe.outerWidth(true);
    $iframe.attr('data-aspectRatio', h / w).removeAttr('height').removeAttr('width');
    if($iframe.length < 1) {
        return;
    }
    else {
        bindMesssageEvent();
    }

    $(window).off('resize').on('resize', function() {
        var ww = $('.iframe-wrapper').width();
        $iframe.width(ww).height(ww * $iframe.attr('data-aspectRatio'));
        var child = $iframe[0].contentWindow;
        var origin = utils.origin(window);
        // child.postMessage('adjust', origin);
    });
    $(window).trigger('resize');
}

function bindMesssageEvent() {
    var $iframe = $('.iframe-wrapper').find('iframe');
    var child = $iframe[0].contentWindow;
    var origin = utils.origin(window);
    $(window).off('message').on('message', function(e) {
        // if(!e.data) {
        //     e = e.originalEvent;
        // }
        if(utils.origin(child) == origin) {
            e = e.originalEvent;
            if(e.source.location.href == child.location.href) {
                // e.source.postMessage('iframe -> parent -> iframe', origin)
                try {
                    var data = JSON.parse(e.data);
                    if(data) {
                        switch(data.action) {
                            case 'file_data':
                                showFile(data.data, child, origin);
                                break;
                            case 'folder_data':
                                showFolder(data.data, child, origin);
                                break;
                            case 'package_data':
                                showPackage(data.data, child, origin);
                                break;
                            default:
                                break;
                        }
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        else {
            throw new Error('only site inner call limited');
        }
    });
    switch(GLOBAL.ASSET_INFO.type) {
        case 'file':
            child.postMessage('get_file', origin);
            break;
        case 'folder':
            child.postMessage('get_folder', origin);
            break;
        case 'package':
            child.postMessage('get_package', origin);
            break;
        default:
            break;
    }
}

function shake($elem, i) {
    $elem.animate({
        left: '-=4'
    }, 35, function() {
        $elem.animate({
            top: '-=4'
        }, 35, function() {
            $elem.animate({
                left: '+=8'
            }, 70, function() {
                $elem.animate({
                    top: '+=8'
                }, 70, function() {
                    $elem.animate({
                        left: '-=4'
                    }, 35, function() {
                        $elem.animate({
                            top: '-=4'
                        }, 35, function() {
                            // TOOD 动画完成
                        });
                    });
                });
            });
        });
    });
}

function showFile(file_data, child, origin) {
    file_data.type = getFileType(file_data.basename);
    var data = {
        'action': 'show_file',
        'data': file_data
    };
    var $wrapper = $('.iframe-wrapper');
    if(!$wrapper.hasClass('single-file-view')) {
        $wrapper.addClass('single-file-view');
    }
    child.postMessage(JSON.stringify(data), origin);
    $(window).trigger('resize');
}

function showFolder(folder_data, child, origin) {
    generateFSTree(folder_data, child, origin);
}

function showPackage(package_data, child, origin) {
    generateFSTree(package_data, child, origin);
}

function getFileExt(file_name) {
    var arrs = file_name.split('.');
    if(arrs && arrs.length > 0) {
        return arrs[arrs.length - 1];
    }
    return null;
}

function getFileType(file_name) {
    var ext = getFileExt(file_name);
    var type = 'other';
    if(ext) {
        $.each(GLOBAL.FILE_TYPES, function(k, v) {
            var found = false;
            for (var i = 0; i < v.length; i++) {
                if(ext == v[i]) {
                    type = k;
                    // 设置找到的标识
                    found = true;
                    break;
                }
            }
            if(found) {
                // 跳出 each 循环
                return false;
            }
        });
    }
    return type;
}

// 文件数据包装
function wrapperFileData(data_item) {
    return {
        hash: data_item.hash,
        filename: data_item.basename,
        folder: data_item.dirname,
        path: data_item.path,
        type: getFileType(data_item.basename)
    };
}

// 生成一条路径
function generateItem($panel, data_item) {
    var $ul = $panel.find('ul.fs-root');
    if($ul.length < 1) {
        $ul = $('<ul></ul>');
        $ul.addClass('fs-root');
        $panel.append($ul);
    }
    var is_file = (data_item.type == 'file');
    var mat = data_item.path.match(/[\/]/g);
    if(mat && mat.length > 0) {
        var pathes = data_item.path.split('/');
        var $li = $ul.children('li[data-name="' + pathes[0] + '"]');
        if($li.length < 1) {
            $li = $([
                '<li data-name="', pathes[0], '" data-type="folder">',
                    '<div>',
                        '<i class="fa fa-folder"></i>',
                        '&nbsp;<span>', pathes[0], '</span>',
                    '</div>',
                '</li>'
            ].join(''));
            $ul.append($li);
        }
        var i = 1;
        while(i < pathes.length - 1) {
            var $tmp = $li.find('ul > li[data-name="' + pathes[i] + '"]');
            if($tmp.length < 1) {
                $li.append([
                    '<ul>',
                        '<li data-name="', pathes[i], '" data-type="folder">',
                            '<div>',
                                '<i class="fa fa-folder"></i>',
                                '&nbsp;<span>', pathes[i], '</span>',
                            '</div>',
                        '</li>',
                    '</ul>'
                ].join(''));
                $li = $li.find('ul > li[data-name="' + pathes[i] + '"]');
            }
            else {
                $li = $tmp;
            }
            i ++;
        }
        $li.append([
            '<ul>',
                '<li data-name="', pathes[pathes.length - 1], '" data-type="', (is_file ? 'file' : 'folder'), '">',
                    '<div>',
                        '<i class="fa ', (is_file ? 'fa-file-o' : 'fa-folder'), '"></i>',
                        '&nbsp;<span>', pathes[pathes.length - 1], '</span>',
                    '</div>',
                '</li>',
            '</ul>'
        ].join(''));
        if(is_file) {
            var $file_elem = $li.find('ul > li[data-name="' + pathes[pathes.length - 1] + '"]');
            $file_elem.attr('data-hash', data_item.hash);
            $file_elem.data('file-data', wrapperFileData(data_item));
        }
    }
    else {
        $ul.append([
            '<li data-name="', data_item.path, '" data-type="', (is_file ? 'file' : 'folder'), '">',
                '<div>',
                    '<i class="fa ', (is_file ? 'fa-file-o' : 'fa-folder'), '"></i>',
                    '&nbsp;<span>', data_item.path, '</span>',
                '</div>',
            '</li>'
        ].join(''));
        if(is_file) {
            var $file_elem = $ul.find('li[data-name="' + data_item.path + '"]');
            $file_elem.attr('data-hash', data_item.hash);
            $file_elem.data('file-data', wrapperFileData(data_item));
        }
    }
}

function bindUnPopView() {
    var $wrapper = $('.iframe-wrapper');
    $wrapper.find('.close-line .close-handler').off('click').on('click', function() {
        if($wrapper.hasClass('pop-view-mode')) {
            $wrapper.removeClass('pop-view-mode');
        }
    });
}

function bindFileClick($panel, child, origin) {
    $panel.find('.fs-root').off('click').on('click', 'li[data-type="file"]', function(e) {
        // var file_path = $(this).attr('data-file');
        // console.log(file_path);
        var file_data = $(this).data('file-data');
        var data = {
            'action': 'show_file',
            'data': file_data
        };
        child.postMessage(JSON.stringify(data), origin);
        if(!$('.iframe-wrapper').hasClass('pop-view-mode')) {
            $('.iframe-wrapper').addClass('pop-view-mode');
        }
        $(window).trigger('resize');
        var $handler = $('.iframe-wrapper').find('.close-line .close-handler');
        shake($handler);
    });
}

// 生成文件(文件夹树)
function generateFSTree(fs_data, child, origin) {
    var $panel = $('.fs-tree-panel');
    if(fs_data && fs_data.length > 0) {
        var sorted = fs_data.sort(utils.sort('type asc', 'path asc'));
        for (var i = 0; i < sorted.length; i++) {
            // console.log(sorted[i]);
            generateItem($panel, sorted[i]);
        }
        bindUnPopView();
        bindFileClick($panel, child, origin);
    }
    else {
        $('.iframe-wrapper').html('<h2 class="text-center">Error: 数据无效</h2>');
    }
}

iframeResponsive();
// asset/file.js

// asset/folder.js

// asset/package.js

// asset/__call__.js

   });
});