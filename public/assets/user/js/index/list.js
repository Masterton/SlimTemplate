/**
 * 包装文件(夹)名称
 */
function wrapperFSName(type, name) {
    var result,
        icon;
    if(type == 'dir') {
        icon = 'fa-folder';
    }
    else if(type == 'file') {
        icon = 'fa-file-o';
    }
    if(icon) {
        result = [
            '<span data-type="', type, '">',
                '<i class="fa ', icon, '"></i>',
                name,
            '</span>'
        ].join('');
    }
    else {
        result = name;
    }
    return result;
}

/**
 * thead事件绑定
 */
function bindTheadEvent($thead, $tbody, $chk_all) {
    $thead.off('click').on('click', function(e) {
        var $elem = $(e.target);
        if($elem.is('input[name="chk-all"]') || utils.latestParent($elem, 'thead th.col-chk')) {
            // 如果点击的是“全选”
            var checked = $chk_all.prop('checked');
            var $chk_items = $tbody.find('tr').find('td.col-chk').find('input[name="chk-item"]');
            $chk_items.each(function(i, chk_item) {
                $(chk_item).prop('checked', checked);
            });
            if($chk_items.length < 1) {
                $chk_all.prop('checked', false);
            }
            if(checked) {
                showOtherBtns();
            }
            else {
                hideOtherBtns();
            }
        }
    });
}

/**
 * tbody事件绑定
 */
function bindTbodyEvent($tbody, $chk_all) {
    $tbody.off('click').on('click', function(e) {
        var $elem = $(e.target);
        var is_chk_me = $elem.is('input[name="chk-item"]');
        var $chk_parent = utils.latestParent($elem, 'tbody td.col-chk');
        if(is_chk_me || $chk_parent.length > 0) {
            // 如果点击的是“选中”
            if($chk_parent.length > 0) {
                $elem = $elem.find('input[name="chk-item"]')
            }
            var $chk_items = $tbody.find('tr').find('td.col-chk').find('input[name="chk-item"]');
            if($elem.prop('checked') == false) {
                $chk_all.prop('checked', false);
            }
            else {
                var checked_count = 0;
                $chk_items.each(function(i, chk_item) {
                    if($(chk_item).prop('checked')) {
                        checked_count += 1;
                    }
                });
                if(checked_count == $chk_items.length) {
                    $chk_all.prop('checked', true);
                }
                else {
                    $chk_all.prop('checked', false);
                }
                if(checked_count > 0) {
                    showOtherBtns();
                }
                else {
                    hideOtherBtns();
                }
            }
        }
        else {
            var $col_name = utils.latestParent($elem, 'tbody td.col-name');
            if($col_name.length > 0) {
                var $fa = $col_name.find('i.fa');
                var $cell = $fa.parent();
                var arr_path = getBreadcrumb();
                if($cell.attr('data-type') == 'dir') {
                    // 添加父级ID.
                    $tbody.attr('data-id',$col_name.parents('tr').attr('data-id'));

                    arr_path.push($cell.text());
                    changeFolder(arr_path);
                }
                else if($cell.attr('data-type') == 'file') {
                    // arr_path.push($cell.text());
                    // openFile(arr_path.join('/'));
                    var $tr = utils.latestParent($cell, 'tr[data-hash]');
                    openFile($tr.attr('data-hash'));
                }
            }
            else {
                var $col_delete = utils.latestParent($elem, 'tbody td.col-delete');
                if($col_delete.length > 0) {
                    var $name_cell = utils.latestParent($col_delete, 'tbody tr').find('td.col-name');
                    inlineDelete($name_cell);
                }
                else {
                    var $col_rename = utils.latestParent($elem, 'tbody td.col-rename');
                    if($col_rename.length > 0) {
                        var $name_cell = utils.latestParent($col_rename, 'tbody tr').find('td.col-name');
                        inlineRename($name_cell);
                    }
                    else {
                        var $col_version = utils.latestParent($elem, 'tbody td.col-version');
                        if($col_version.length > 0) {
                            console.dir($col_version);
                            var $data_row = utils.latestParent($col_version, 'tbody tr[data-id][data-hash]');
                            console.dir($data_row);
                            var file_id = parseInt($data_row.attr('data-id')),
                                file_hash = $data_row.attr('data-hash'),
                                file_name = $data_row.find('td.col-name').text().trim();
                            showVersions(file_id, file_hash, file_name);
                        }
                    }
                }
            }
        }
    });
}

/**
 * 通过表单方式在新窗口中打开文件
 */
function openFile(file_hash) {
    if ($('#redirect-from').length < 1) {
        $(document.body).append([
            '<div style="display: none;">',
                '<form id="redirect-from" target="_blank" method="GET" action="', GLOBAL.FILE_VIEW_URL, '">',
                    '<input type="hidden" name="file" value="', file_hash, '" />',
                '</form>',
            '</div>'
        ].join(''));
    } else {
        $('#redirect-from').attr('action', GLOBAL.FILE_VIEW_URL);
        $('#redirect-from').find('input[name="file"]').val(file_hash);
    }
    setTimeout(function() {
        $('#redirect-from').submit();
    }, 50);
}

/**
 * 显示当前目录下的内容
 */
function showInCurrent(data) {
    data = data.sort(utils.sort('type asc', 'basename asc'));
    var $table = $('.main .list-mode table');
    var $tbody = $table.find('tbody'),
        $thead = $table.find('thead');
    var $chk_all = $thead.find('input[name="chk-all"]');
    $tbody.empty();
    hideOtherBtns();
    $chk_all.prop('checked', false);
    if(data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var node = data[i];
            var $tr = $([
                '<tr data-id="',node.id,'">',
                    '<td class="col-chk">',
                        '<label>',
                            '<input type="checkbox" name="chk-item" />选中',
                        '</label>',
                    '</td>',
                    '<td class="col-name">', wrapperFSName(node.type, node.basename), '</td>',
                    '<td>', (!isNaN(node.size) ? utils.formatFileSize(node.size) : '-'), '</td>',
                    '<td>', utils.ts2str(node.timestamp), '</td>',
                    '<td>', createDownloadUrl(node) , '</td>',
                    '<td class="col-version">',
                        (node.type == 'file' ? '<a href="javascript:;">查看</a>' : '-'),
                    '</td>',
                    '<td class="col-rename">',
                        '<a href="javascript:;">重命名</a>',
                    '</td>',
                    '<td class="col-delete">',
                        '<a href="javascript:;">删除</a>',
                    '</td>',
                '</tr>'
            ].join(''));
            if(node.type == 'file') {
                $tr.attr('data-hash', node.hash);
                $tr.attr('data-id', node.id);
            }
            $tbody.append($tr);
        }
        bindTbodyEvent($tbody, $chk_all)
        bindTheadEvent($thead, $tbody, $chk_all);
    }
    else {
        var col_num = $thead.find('th').length;
        var $tr = $([
            '<tr>',
                '<td colspan="',col_num,'" class="row-empty">',
                    '<span>文件夹为空</span>',
                '</td>',
            '</tr>'
        ].join(''));
        $tbody.html($tr);
    }
}
/**
 * 获取文件下载路径.
 */
function createDownloadUrl(item){
    if(item.hash){
       return [
          '<a href="',(GLOBAL.FILE_RAW_URL + '?download=true&file=' + item.hash),'">下载</a>'
       ].join(' ');
    }
    return '-';
}

/**
 * 行内创建文件夹
 */
function inlineCreateFolder() {
    var $table = $('.main .list-mode table');
    var $tbody = $table.find('tbody');
    var $old_cf = $tbody.find('.inline-create-folder');
    if($old_cf.length > 0) {
        utils.latestParent($old_cf, 'tr').remove();
    }
    var cf_block = [
        '<div class="input-group create-folder-block">',
            '<span class="input-group-addon fa fa-folder"></span>',
            '<input type="text" class="form-control" placeholder="新建文件夹" />',
            '<span class="input-group-btn">',
                '<span class="btn-cf-ok"title="确定">',
                    '<i class="fa fa-check"></i>',
                '</span>',
                '<span class="btn-cf-cancel" title="取消">',
                    '<i class="fa fa-remove"></i>',
                '</span>',
            '</span>',
        '</div>'
    ].join('');
    var col_num = $table.find('th').length;
    var $tr = $([
        '<tr>',
            '<td class="row-empty">-</td>',
                '<td class="inline-create-folder">', cf_block,'</td>',
            '</td>',
            '<td colspan="',col_num-2,'" class="row-empty">-</td>',
        '</tr>'
    ].join(''));
    $tbody.prepend($tr);

    var $block_obj = $tr.find('.create-folder-block');
    $block_obj.on('click', function(e) {
        e.preventDefault();
        return false;
    });
    var $cf_input = $block_obj.find('input[type="text"]');
    $cf_input.focus();
    $block_obj.find('.btn-cf-ok').off('click').on('click', function() {
        var new_name = $cf_input.val();
        var arr_path = getBreadcrumb();
        var current_path = arr_path.join('/');
        if(new_name && new_name.length > 0) {
            // 路径不能包含 / \
            if(new_name.indexOf('/') < 0 && new_name.indexOf('\\') < 0) {
                if(!current_path || current_path.length < 1) {
                    current_path = null;
                }
                var pid = $tbody.attr('data-id');
                if(!pid){
                    pid = 0;
                }
                $.ajax({
                    url: utils.mergeUrl(App.baseUrl, '/api/fs/folder'),
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        dir: current_path,
                        name: new_name,
                        pid:pid
                    },
                    success: function(data) {
                        if(data.error == 0) {
                            notifySuccess(data.desc);
                            $tr.remove();
                            getFSTree(current_path);
                        }
                        else {
                            $cf_input.focus();
                            notifyDanger(data.desc);
                        }
                    },
                    error: function(data) {
                        if(App.debug) {
                            console.error(data);
                        }
                    }
                });
            }
            else {
                $cf_input.focus();
                notifyWarning('文件夹名不能包含 <code>/</code>或<code>\\</code>');
            }
        }
        else {
            $cf_input.focus();
            notifyWarning('新文件夹名不可为空');
        }
    });
    $block_obj.find('.btn-cf-cancel').off('click').on('click', function() {
        $tr.remove();
    });
}

/**
 * 行内重命名
 */
function inlineRename($name_cell) {
    var cell_text = $name_cell.text(),
        cell_type = $name_cell.find('i.fa').parent().attr('data-type');
    var $old_rename = $name_cell.parents('table').find('.inline-rename');
    if($old_rename.length > 0) {
        $old_rename.removeClass('inline-rename');
        $old_rename.find('.rename-block').remove();
    }
    $name_cell.addClass('inline-rename');
    var icon_class = '';
    if(cell_type == 'dir') {
        icon_class = 'fa fa-folder';
    }
    else if(cell_type == 'file') {
        icon_class = 'fa fa-file-o';
    }
    var rename_block = [
        '<div class="input-group rename-block">',
            ['<span class="input-group-addon ', icon_class, '"></span>'].join(''),
            '<input type="text" class="form-control" />',
            '<span class="input-group-btn">',
                '<span class="btn-rename-ok"title="确定">',
                    '<i class="fa fa-check"></i>',
                '</span>',
                '<span class="btn-rename-cancel" title="取消">',
                    '<i class="fa fa-remove"></i>',
                '</span>',
            '</span>',
        '</div>'
    ].join('');
    $name_cell.append(rename_block);
    var $block_obj = $name_cell.find('.rename-block');
    $block_obj.on('click', function(e) {
        e.preventDefault();
        return false;
    });
    var $rename_input = $block_obj.find('input[type="text"]');
    $rename_input.val(cell_text);
    $rename_input.focus();
    $block_obj.find('.btn-rename-ok').off('click').on('click', function() {
        if(cell_text == $rename_input.val()) {
            notifyInfo('名称未改变，操作已取消', function() {
                $block_obj.remove();
                $name_cell.removeClass('inline-rename');
            });
        }
        else {
            var arr_path = getBreadcrumb();
            var current_path = arr_path.join('/');
            if(cell_type == 'dir') {
                $name_cell.data('data-new-name', $rename_input.val());
                renameFolder(current_path, cell_text, $rename_input.val(), [
                    function($args) {
                        getFSTree(current_path);
                        /*
                        var $block_obj = $args[0],
                            $name_cell = $args[1];
                        if($block_obj.length > 0) {
                            $block_obj.remove();
                        }
                        if($name_cell.length > 0) {
                            $name_cell.removeClass('inline-rename');
                            $name_cell.empty().append(wrapperFSName(
                                'dir',
                                $name_cell.data('data-new-name')
                            ));
                            $name_cell.removeData('data-new-name');
                        }
                        */
                    },
                    [$block_obj, $name_cell]
                ]);
            }
            else if(cell_type == 'file') {
                $name_cell.data('data-new-name', $rename_input.val());
                renameFile(current_path, cell_text, $rename_input.val(), [
                    function($args) {
                        getFSTree(current_path);
                        var $block_obj = $args[0],
                            $name_cell = $args[1];
                        if($block_obj.length > 0) {
                            $block_obj.remove();
                        }
                        if($name_cell.length > 0) {
                            $name_cell.removeClass('inline-rename');
                            $name_cell.empty().append(wrapperFSName(
                                'file',
                                $name_cell.data('data-new-name')
                            ));
                            $name_cell.removeData('data-new-name');
                        }
                    },
                    [$block_obj, $name_cell]
                ]);
            }
        }
    });
    $block_obj.find('.btn-rename-cancel').off('click').on('click', function() {
        $block_obj.remove();
        $name_cell.removeClass('inline-rename');
    });
}

/**
 * 行内删除
 */
function inlineDelete($name_cell) {
    var cell_text = $name_cell.text(),
        cell_type = $name_cell.find('i.fa').parent().attr('data-type');
    var arr_path = getBreadcrumb();
    var current_path = arr_path.join('/');
    var $tr = utils.latestParent($name_cell, 'tbody tr');
    if(cell_type == 'dir') {
        deleteFolder(current_path, cell_text, [
            function($args) {
                getFSTree(current_path);
                /*
                var $tr = $args[0];
                if($tr.length > 0) {
                    $tr.remove();
                }
                */
            },
            [$tr]
        ]);
    }
    else if(cell_type == 'file') {
        deleteFile(current_path, cell_text, [
            function($args) {
                getFSTree(current_path);
                /*
                var $tr = $args[0];
                if($tr.length > 0) {
                    $tr.remove();
                }
                */
            },
            [$tr]
        ]);
    }
}

/**
 * 删除文件夹
 */
function deleteFolder(parent, name, success_call, is_confirm) {
    if(!parent || parent.length < 1) {
        parent = null;
    }
    var data = {
        "_method": 'delete',
        "dir": parent,
        "name": name
    };
    if(is_confirm) {
        data['confirm'] = 'true';
    }
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/folder'),
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "DELETE"
        },
        success: function(data) {
            if(data.error == 0) {
                notifySuccess(data.desc);
                if(success_call && $.isArray(success_call) && success_call.length > 0) {
                    var arg_func = success_call[0];
                    if(typeof arg_func == 'function') {
                        var arg_params = success_call.length > 1 ? success_call[1] : undefined;
                        arg_func(arg_params);
                    }
                }
                updateHistory(name);
            }
            else if(data.error == 5) {
                dialog.confirm(data.desc, '操作询问', function() {
                    deleteFolder(parent, name, success_call, true);
                }, function() {
                    notifyInfo('操作已取消');
                }, true);
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            if(App.debug) {
                console.error(data);
            }
        }
    });
}

/**
 * 重命名文件夹
 */
function renameFolder(parent, name, new_name, success_call) {
    if(!parent || parent.length < 1) {
        parent = null;
    }
    var data = {
        "_method": 'put',
        "dir": parent,
        "name": name,
        "new_name": new_name
    };
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/folder'),
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "PUT"
        },
        success: function(data) {
            if(data.error == 0) {
                notifySuccess(data.desc);
                if(success_call && $.isArray(success_call) && success_call.length > 0) {
                    var arg_func = success_call[0];
                    if(typeof arg_func == 'function') {
                        var arg_params = success_call.length > 1 ? success_call[1] : undefined;
                        arg_func(arg_params);
                    }
                }
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            if(App.debug) {
                console.error(data);
            }
        }
    });
}

/**
 * 重命名文件
 */
function renameFile(parent, name, new_name, success_call) {
    if(!parent || parent.length < 1) {
        parent = null;
    }
    var data = {
        "_method": 'put',
        "dir": parent,
        "name": name,
        "new_name": new_name
    };
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/file/'),
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "PUT"
        },
        success: function(data) {
            if(data.error == 0) {
                notifySuccess(data.desc);
                if(success_call && $.isArray(success_call) && success_call.length > 0) {
                    var arg_func = success_call[0];
                    if(typeof arg_func == 'function') {
                        var arg_params = success_call.length > 1 ? success_call[1] : undefined;
                        arg_func(arg_params);
                    }
                }
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            if(App.debug) {
                console.error(data);
            }
        }
    });
}

/**
 * 删除文件
 */
function deleteFile(parent, name, success_call) {
    if(!parent || parent.length < 1) {
        parent = null;
    }
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/file/'),
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify({
            "_method": 'delete',
            "dir": parent,
            "name": name
        }),
        headers: {
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "DELETE"
        },
        success: function(data) {
            if(data.error == 0) {
                notifySuccess(data.desc);
                if($.isArray(success_call) && success_call.length > 0) {
                    var arg_func = success_call[0];
                    if(typeof arg_func == 'function') {
                        var arg_params = success_call.length > 1 ? success_call[1] : undefined;
                        arg_func(arg_params);
                    }
                }
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            if(App.debug) {
                console.error(data);
            }
        }
    });
}

/**
 * 显示(文件)版本
 */
function showVersions(file_id, file_hash, file_name) {
    if ($('#version-from').length < 1) {
        $(document.body).append([
            '<div style="display: none;">',
                '<form id="version-from" target="_blank" method="GET" action="', GLOBAL.FILE_VERSION_URL, '">',
                    '<input type="hidden" name="file" value="', file_id, '" />',
                    '<input type="hidden" name="hash" value="', file_hash, '" />',
                    '<input type="hidden" name="name" value="', file_name, '" />',
                '</form>',
            '</div>'
        ].join(''));
    } else {
        $('#version-from').attr('action', GLOBAL.FILE_VERSION_URL);
        $('#version-from').find('input[name="file"]').val(file_id);
        $('#version-from').find('input[name="hash"]').val(file_hash);
        $('#version-from').find('input[name="name"]').val(file_name);
    }
    setTimeout(function() {
        $('#version-from').submit();
    }, 50);
}

/**
 * 显示加载信息
 */
function showMessage(msg) {
    var $panel = $('.main .data-panel');
    $panel.html('<h1 style="text-align: center; margin-top: 50px;">' + msg + '</h1>');
}

/**
 * 移除加载信息
 */
function removeMessage() {
    var $panel = $('.main .data-panel');
    $panel.empty();
}
/**
 * 移除数组的数据.
 * @param path
 */
function updateHistory(path){
    // 这里要判断循环  是否设置新的历史记录.
    var paths = store.get('path-history');
    if(paths.histories.length>=1){
        for(var i=0;i<paths.histories.length;i++){
            if(paths.histories[i] == path){
                // 这里只是置空
                paths.histories[i] = null;
                // paths.histories.remove(i);
            }
        }
        store.set('path-history',paths);
    }else{
        return ;
    }
}
/**
 * 数组移除某个元素,并且更新数组原有的长度.
 * @param from
 * @param to
 * @returns {*}
 */
// Array.prototype.remove = function(from, to) {
//     var rest = this.slice((to || from) + 1 || this.length);
//     this.length = from < 0 ? this.length + from : from;
//     return this.push.apply(this, rest);
// };

function checkTable(){
    $('[aria-controls="tab-classify"]').off('click').on('click',function(){
        $('#main-category').css({'display':'block'});
        $('#main-folder').css({'display':'none'});
        
    });

    $('[aria-controls="tab-fstree"]').off('click').on('click',function(){
        $('#main-folder').css({'display':'block'});
        $('#main-category').css({'display':'none'});
        $(window).trigger('resize');
    });
}