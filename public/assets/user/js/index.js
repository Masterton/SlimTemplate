define(['layui', 'jquery', 'utils', 'dialog', 'md5', 'store', 'scrollbar', 'treeview', 'contextmenu', 'bootstrap-notify', 'jquery-fileupload'], function(layui, $, utils, dialog, md5, store) {
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
// index/common.js
/**
 * 去掉空节点
 */
function removeEmpty(nodes) {
    if(!nodes || !nodes.length > 0) {
        return nodes;
    }
    for (var i = 0; i < nodes.length; i++) {
        if(nodes[i].nodes.length < 1) {
            delete nodes[i].nodes;
        }
        else {
            removeEmpty(nodes[i].nodes);
        }
    }
}

/**
 * 包装数据
 */
function wrapperData(data) {
    var sorted_data = data.sort(utils.sort('path asc'));
    var ret = [];
    for(var i = 0; i < sorted_data.length; i++) {
        var item = sorted_data[i];
        buildTree(item.path.split('/'), ret);
    }
    ret = [
        {
            text: '所有文件',
            nodes: ret
        }
    ];
    removeEmpty(ret);
    return ret;
}

/**
 * 获取当前目录下的内容
 */
function getInCurrent(path) {
    if(path == '所有文件') {
        path = null;
    }
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/list'),
        type: 'POST',
        dataType: 'json',
        data: {
            path: path
        },
        success: function(data) {
            if(data.error == 0) {
                showInCurrent(data.data);
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
 * 切换当前目录
 */
function changeFolder(pathes, ignore) {
    showBreadcrumb($.extend(true, [], pathes));
    var $bc = $('.main .breadcrumb-wrapper .breadcrumb');
    var is_empty = false;
    if($bc.attr('breadcrumb-inited')) {
        $bc.removeAttr('breadcrumb-inited');
        is_empty = true;
    }
    if(pathes.length > 0) {
        selectCurrent(pathes);
    }
    else if(ignore || is_empty) {
        selectCurrent([]);
    }
}

/**
 * 更导航栏
 */
function updateSidebar(bar) {
    var max_h = $(window).height() - $('nav.navbar-inverse').outerHeight(true) - $('.sidebar .nav nav-tabs').parent().outerHeight(true);
    max_h -= 30;
    $('.sidebar .tab-content').height(max_h);
    $(bar).animate({
        'height': max_h - 2
    }, 100);
}

/**
 * 可变宽度侧边栏
 */
function changeSidebarSize() {
    var $p_body = $('.page-body');
    var $bar = $p_body.find('.sidebar'),
        $line = $p_body.find('.move-line'),
        $p_main = $p_body.find('.main');

    var body_w = parseInt($p_body.css('width').replace('px', '')),
        bar_w = $bar.outerWidth(true),
        main_w = $line.outerWidth(true) + 2;
    $p_main.css('width', body_w - bar_w - main_w + 8);

    $line.mousedown(function(eve) {
        $line.data('data-move', true);
        var _x = eve.pageX;
        $line.data('init-x', _x);
        var bar_w = parseInt($bar.css('width').replace('px', ''))
        $bar.data('init-width', bar_w);
        var _dw = parseInt($p_main.css('width').replace('px', ''));
        $p_main.data('init-width', _dw);
        var _dl = parseInt($p_main.css('left').replace('px', ''));
        $p_main.data('init-left', _dl);
    });
    $(window).mousemove(function(eve) {
        if($line.data('data-move')) {
            var _ox = $line.data('init-x');
            var _x = eve.pageX;
            var _dx = _x - _ox;
            var _nx = $bar.data('init-width') + _dx;
            $bar.css('width', _nx);
            $line.css('left', _nx + 2);
            var _nw = $p_main.data('init-width') - _dx;
            $p_main.css('width', _nw - main_w + 8);
            var _dl = $p_main.data('init-left');
            $p_main.css('left', _dl + _dx);
        }
    });
    $(window).mouseup(function(eve) {
        $(window).trigger('resize');
        $line.data('data-move', false);
    });

    $(window).trigger('resize');
}
// index/tree.js
/**
 * 获取目录树数据
 */
function getFSTree(path) {
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/tree'),
        type: 'POST',
        dataType: 'json',
        data: {},
        success: function(data) {
            if(data.error == 0) {
                showFSTree(data.data, path);
            }
            else {
                console.log(data);
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
 * 构建树
 */
function buildTree(parts, treeNode) {
    if (parts.length === 0) {
        return;
    }
    for (var i = 0; i < treeNode.length; i++) {
        if (parts[0] == treeNode[i].text) {
            buildTree(parts.splice(1, parts.length), treeNode[i].nodes);
            return;
        }
    }
    var newNode = {
        'text': parts[0],
        'nodes': []
    };
    treeNode.push(newNode);
    buildTree(parts.splice(1, parts.length), newNode.nodes);
}
/**
 * 渲染树数据
 */
function renderFSTree(data, path) {
    var $tree = $('#tab-fstree .fs-tree .tree-container').treeview({
        color: "#428bca",
        expandIcon: 'fa fa-chevron-right',
        collapseIcon: 'fa fa-chevron-down',
        nodeIcon: 'fa fa-folder',
        showTags: false,
        showBorder: false,
        highlightSelected: true,
        highlightSearchResults: false,
        backColor: "#f5f5f5",
        onhoverColor: "#fff",
        data: data,
        onNodeSelected: function(event, data) {
            // 选中
            var path_his = getPathHistory();
            if(path_his.inited) {
                var pathes = getFullPath(data);
                $('.table-responsive').find('tbody').attr('data-id',$(this).find('.node-selected').attr('data-id'));
                changeFolder(pathes);
            }
        },
        onNodeCollapsed: function(event, data) {
            // 折叠
            console.log('折叠');
        },
        onNodeExpanded: function(event, data) {
            // 展开
            console.log('展开');
        }
    });
    $tree.treeview('expandAll', {
        silent: true
    });
    setTimeout(function() {
        var max_width = 0;
        var all_nodes = [];
        // 读取数据
        $('.fs-tree').find('.list-group-item').each(function(i, elem) {
            var $node = $(elem);
            var node_id = $node.attr('data-nodeid');
            var node_obj = $tree.treeview('getNode', node_id);
            all_nodes.push(node_obj);
            $node.addClass('inline-block');
            var w = $node.outerWidth(true);
            if(w > max_width) {
                max_width = w;
            }
            $node.removeClass('inline-block');
        });
        // 调整宽度
        var new_width = max_width + 5;
        $('.fs-tree').width(new_width);
        $tree.treeview('collapseAll', {
            silent: true
        });
        var $selected = $tree.treeview('getSelected');
        var $bc = $('.main .breadcrumb-wrapper .breadcrumb');
        if($selected.length < 1 && !$bc.attr('breadcrumb-inited')) {
            $tree.treeview('selectNode', [0, {silent: false}]);
        }
        $tree.treeview('expandNode', [0, {levels: 1, silent: true}]);
        $($('.fs-tree').parents('.mCSB_container')[0]).width(new_width + 2);
        // 更新记录
        var node_tree_map = [];
        for (var i = 0; i < all_nodes.length; i++) {
            var node = all_nodes[i];
            var current_node = node;
            var current_pathes = [];
            current_pathes.unshift(current_node.text);
            while(current_node.parentId && !isNaN(current_node.parentId)) {
                current_node = $tree.treeview('getNode', current_node.parentId);
                current_pathes.unshift(current_node.text);
            }
            node_tree_map.push({
                id: node.nodeId,
                path: current_pathes.join('/')
            });
        }
        // 将记录绑定到tree上
        $tree.data('data-tree-map', node_tree_map);

        // 切换到当前目录
        var cps = (typeof path == 'string') ? path.split('/') : [];
        if (!Array.prototype.filter) {
            Array.prototype.filter = function (fun) {
                var len = this.length >>> 0;
                if (typeof fun != 'function') {
                    throw new TypeError();
                }
                var res = [
                ];
                var thisp = arguments[1];
                for (var i = 0; i < len; i++) {
                    if (i in this) {
                        var val = this[i]; // in case fun mutates this
                        if (fun.call(thisp, val, i, this)) {
                            res.push(val);
                        }
                    }
                }
                return res;
            };
        }
        cps = cps.filter(function(item) {
             return item && item.length > 0;
        });
        changeFolder(cps);
    }, 100);
}

/**
 * 显示目录树
 */
function showFSTree(data, path) {
    if(data) {
        // 将对象转换为数组
        data = $.map(data, function(value, index) {
            return [value];
        });
    }
    if($.isArray(data)) {
        data = wrapperData(data);
        renderFSTree(data, path);
    }
}

/**
 * 获取完整路径
 */
function getFullPath(node_data) {
    var result = [];
    var current = node_data;
    result.unshift(node_data.text);
    var $tree = $('#tab-fstree .fs-tree .tree-container');
    while(current.parentId && !isNaN(current.parentId)) {
        current = $tree.treeview('getNode', current.parentId);
        result.unshift(current.text);
    }
    return result;
}

/**
 * 选中左侧树型导航当前目录
 */ 
function selectCurrent(pathes) {
    var $tree = $('#tab-fstree .fs-tree .tree-container');
    var tree_map = $tree.data('data-tree-map'),
        current_path = pathes.join('/');
    if(current_path == ''){
        current_path = '所有文件';
    }
    if(tree_map && tree_map.length > 0 && current_path && current_path.length > 0) {
        for (var i = 0; i < tree_map.length; i++) {
            var map_item = tree_map[i];
            if(map_item.path == current_path) {
                // 展开折叠的节点
                $tree.treeview('revealNode', [map_item.id, {silent: true }]);
                // 选中节点
                $tree.treeview('selectNode', [map_item.id, {silent: true }]);
                break;
            }
        }
    }
    // 获取数据
    getInCurrent(current_path);
}

// 左侧导航栏右键菜单
function treeContextMenu() {
    var tree_selector = '#tab-fstree .fs-tree .tree-container';
    var $tree = $(tree_selector);
    var menu_items = {
        "expand": {
            name: "全部展开",
            icon: "fa-expand",
            disabled: function(key, opt){
                // 只要存在折叠的，就显示
                return !($(opt.$trigger).parents(tree_selector).find('.fa.fa-chevron-right').length > 0);
            },
            visible: function(key, opt) {
                if($(opt.$trigger).find('.icon.expand-icon').length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            callback: function(key, opt) {
                var nodeid = opt.$trigger.attr('data-nodeid');
                if(nodeid == 0) {
                    $tree.treeview('expandAll');
                } else {
                    var node = $tree.treeview('getNode', nodeid);
                    // 要展开的层级，设置一个比较大的数
                    $tree.treeview('expandNode', [node, {silent: true, levels: 100}]);
                }
            }
        },
        "collapse": {
            name: "全部折叠",
            icon: "fa-compress",
            disabled: function(key, opt){
                var enabled = false;
                if($(opt.$trigger).attr('data-nodeid') == '0') {
                    return !($(opt.$trigger).parents(tree_selector).find('.fa.fa-chevron-down').length > 1);
                }
                return !($(opt.$trigger).find('.fa.fa-chevron-down').length > 0);
            },
            visible: function(key, opt) {
                if($(opt.$trigger).find('.icon.expand-icon').length > 0) {
                    return true;
                } else {
                    return false;
                }
            },
            callback: function(key, opt) {
                var nodeid = opt.$trigger.attr('data-nodeid');
                var node = $tree.treeview('getNode', nodeid);
                $tree.treeview('collapseNode', [node, {silent: true, ignoreChildren: false}]);
            }
        }
    };
    var common_options = {
        appendTo: 'html > body',
        autoHide: false,
        items: menu_items,
        animation: {
            duration: 110,
            show: 'slideDown',
            hide: 'fadeOut'
        },
        callback: function(key, options) {
            return true;
        },
        events: {
            show: function(options) {
                // var LV = options.$menu.find(".context-menu-submenu.fa.fa-lock").find("li");
                return true;
            },
            hide: function(options) {
                return true;
            }
        }
    };
    var menu_options = {
        selector: tree_selector + ' li.list-group-item',
        trigger: 'right',
        build: function($trigger, eve) {
            // var _id = getID($(eve.target));
            if(true) {
                // trigger.prop('node-id', _id);
            }
            else {
                // $trigger.prop('event-level', MENU_EVENT_LEVEL.NONE);
            }
            return menu_options;
        }
    };
    var opt_config = $.extend(true, {}, menu_options, common_options);
    $.contextMenu(opt_config);
}

// 分类菜单渲染.
function showCategory(){
    // 获取分类树.
    var category = GLOBAL.FILE_CATEGORY;
    category = JSON.parse(category);
    var li = '';
    $.each(category,function(index,item){
        li +=[
            '<li data-id="'+item.id+'">',
                '<a href="#">',
                    item.name,
                '</a>',
            '</li>'
        ].join('');
    });
    var html = '<ul class="nav nav-sidebar">'+li+'</ul>';
    // 添加进去.
    $('#sidebar-main').html(html);

    $('#sidebar-main').find('a').off('click').on('click',function(){
        $(this).parents('li').addClass('active').siblings('li').removeClass('active');
        // 这里是ID
        var data_id = $(this).parents('li').attr('data-id');
        $.ajax({
            'type':'GET',
            'url':utils.mergeUrl(App.baseUrl,'/api/fs/category'),
            'data':{
                'data_id':data_id
            },
            'success':function(data){
                var tbody = $('#table-category').find('tbody');
                if(data.error == 0){
                    // 这里要组建相应的内容了.
                    data = data.data;
                    tbody.html('');
                    $.each(data,function(index,node){
                        var $tr = $([
                            '<tr data-id="',node.id,'">',
                                '<td class="col-chk">',
                                    '<label>',
                                    '<input type="checkbox" name="chk-item" />选中',
                                    '</label>',
                                '</td>',
                                '<td class="col-name">', wrapperFSName(node.type, node.basename), '</td>',
                                '<td>', (!isNaN(node.size) ? utils.formatFileSize(node.size) : '-'), '</td>',
                                '<td>', node.updated_at, '</td>',
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
                            $($tr).attr('data-hash', node.hash);
                            $($tr).attr('data-id', node.id);
                        }
                        tbody.append($tr);
                    });
                    var $chk_all = tbody.find(':checked');
                    bindTbodyEvent(tbody,$chk_all);
                }else{
                    var tbody = $('#table-category').find('tbody');
                    var col_num = $('#table-category thead').find('th').length;
                    tbody.html(['<tr>',
                                    '<td colspan="' + col_num + '" style="text-align: center;color: #919191;">请选择分类</td>',
                                '</tr>'
                    ].join(''));
                    notifyDanger(data.msg);
                }
            },
            'error':function(data){
                console.dir(data);
            }
        });
    });
}
// index/operate-bar.js
// 渲染路径导航
function renderBreadcrumb($bc, pathes) {
    var new_path = (pathes && pathes.length > 0) ? pathes.join('/') : null;
    if(!pathes || pathes.length < 1 || pathes[0] != '所有文件') {
        pathes.unshift('所有文件');
    }
    var latest_path = getLatestPath();
    var path_his = getPathHistory();
    if(path_his.inited) {
        if((new_path != latest_path)) {
            appendPath(new_path);
        }
    }
    else {
        path_his.inited = true;
        store.set('path-history', path_his);
    }
    // 设置导航
    $bc.empty();
    for (var i = 0; i < pathes.length; i++) {
        var $item = $([
            '<li class="path-node">',
                '<a href="javascript:;">', pathes[i], '</a>',
            '</li>',
        ].join(''));
        if(i == pathes.length -1) {
            $item.addClass('active');
            $item.html($item.text());
        }
        if(i > 0) {
            $item.addClass('fs-node').data('data-node', pathes[i]);
        }
        $bc.append($item);
    }
}

/**
 * 显示路径导航
 */
function showBreadcrumb(pathes) {
    var $r = $('.redo-undo');
    var $p = $r.parent();
    var $b = $p.find('.breadcrumb-wrapper');
    var $bc = $b.find('.breadcrumb');
    renderBreadcrumb($bc, pathes);
    // 设置导航条宽度
    var _rw = $r.outerWidth(true);
    var _bw = $p.width() - _rw - ($b.outerWidth(true) - $b.width());
    $b.width(_bw - 10);

    // 绑定事件
    $bc.off('click').on('click', function(e) {
        var $elem = $(e.target);
        if($elem.is('a') && $elem.parent().hasClass('path-node')) {
            $elem = $elem.parent();
        }
        if($elem.hasClass('path-node')) {
            if($elem.hasClass('fs-node')) {
                if(!$elem.hasClass('active')) {
                    // 点击父级目录
                    var arr_path = [];
                    while($elem.hasClass('fs-node')) {
                        arr_path.unshift($elem.data('data-node'));
                        $elem = $elem.prev('li');
                    }
                    changeFolder(arr_path);
                }
            }
            else {
                var $tree = $('#tab-fstree .fs-tree .tree-container');
                $tree.treeview('selectNode', [0, {silent: true}]);
                $tree.treeview('expandNode', [0, {levels: 1, silent: true}]);
                renderBreadcrumb($bc, []);
                getInCurrent(null);
            }
        }
    });
}

/**
 * 获取当前导航路径
 */
function getBreadcrumb() {
    var $bc = $('.main .breadcrumb-wrapper .breadcrumb');
    var arr_path = [];
    $bc.find('li.fs-node').each(function(index, el) {
        arr_path.push($(el).text());
    });
    return arr_path;
}

/**
 * 显示其它按钮
 */
function showOtherBtns() {
    var $btns = $('.btn-kz-border');
    $btns.each(function(i, elem) {
        if($(elem).hasClass('hide')) {
            $(elem).removeClass('hide');
        }
    });
    bindBtnMoveFolder();
}

/**
 * 隐藏其它按钮
 */
function hideOtherBtns() {
    var $btns = $('.btn-kz-border');
    $btns.each(function(i, elem) {
        if(!$(elem).hasClass('hide')) {
            $(elem).addClass('hide');
        }
    });
}

/**
 * 绑定"新建文件夹"
 */
function bindBtnCreateFolder() {
    $('.main .btns-line-bar').find('[name="btn-create-folder"]').off('click').on('click', function(e) {
        inlineCreateFolder();
    });
}
/**
 * 绑定"移动"
 */
function bindBtnMoveFolder() {
    $('.main .btns-line-bar').find('[name="btn-move"]').off('click').on('click', function(e) {
        var tbody = $('.table-responsive tbody');
        var checked = tbody.find(':checked');
        // 判断是否有选中的文件夹或者文件
        if(checked.length >= 1){
            // 根据类型得到对应的id,用于是否显示该文件夹.
            var folder = [];
            var file= [];
            $.each(checked,function(index,item){
                var tr = utils.latestParent($(item),'tr');
                var data_type = tr.find('[data-type]').attr('data-type'),
                data_id = tr.attr('data-id');
                if(data_type == 'dir'){
                    folder.push(data_id);
                }
                if(data_type == 'file'){
                    file.push(data_id);
                }
            });
            $('#fs-picker-modal-move').modal('show');
            moveFolder(folder.join(','),file.join(','));
            $('#fs-picker-modal-move').find('.kz-btn-submit').off('click').on('click',function(){
                // 这里是调用的点击事件.
                startMoveFolder(folder,file);
            });
        }else{
            notifyDanger('请选择要移动的文件夹!');
        }
    });
}

/**
 * 开始移动文件夹.
 * @param tbody
 */
function startMoveFolder(folder,file){
    var folder_id=$('#fs-picker-modal-move').find('input[name=folder]').val();
    if(folder_id){
        var data={
            'current_folder':folder_id,
            'folder_ids':folder.join(','),
            'file_ids':file.join(','),
            'method':'put'
        };
        $.ajax({
            'url':utils.mergeUrl(App.baseUrl,'/api/fs/folders'),
            'type':'post',
            'data':JSON.stringify(data),
            'dataType':'json',
            'headers':{
                "Content-Type": "application/json",
                "X-HTTP-Method-Override": "PUT"
            },
            'success':function(data){
                if(data.error == 0){
                    notifySuccess(data.desc);
                    $('#fs-picker-modal-move').modal('hide');

                    var arr_path = getBreadcrumb();
                    var current_path = arr_path.join('/');
                    if(!current_path || current_path.length < 1) {
                        current_path = null;
                    }
                    getFSTree(current_path);
                }else{
                    notifyDanger(data.desc);
                }
            }
        });
    }else{
        notifyWarning('请选择要移动的文件夹.');
    }
}

/**
 * 展开文件树.
 * @param current_folder
 * @param current_file
 */
function moveFolder(current_folder,current_file){
    // 清空树,获取所有的树.
    $('#demo').empty();
    $('#fs-picker-modal-move').find('input[name=topic]').val('');
    layui.use('tree', function() {
        var nodes=null;
        $.ajax({
            'url':utils.mergeUrl(App.baseUrl,'/api/fs/folders'),
            'type':'post',
            'data':{
                // 已经选择的id
                'current_folder':current_folder,
                'current_file':current_file
            },
            'dataType':'json',
            'success':function(data){
                if(data.error == 0){
                    nodes = data.data;
                    layui.tree({
                        elem: '#demo',//指定元素
                        nodes: createTree(nodes),
                        click:function(item){
                            // console.dir(item);
                            $('#fs-picker-modal-move').find('input[name=topic]').val('/'+item.path);
                            $('#fs-picker-modal-move').find('input[name=folder]').val(item.id);
                        }
                    });
                }
            }
        });
        //生成一个模拟树
        var createTree = function(nodes) {
            if(nodes.length > 0){
                // 开始组装数据.
                return getNodeData(nodes);
            }else{
                notifyDanger('该网站没有目录.');
                return [
                    {
                        'name':'没有找到文件夹',
                        'id':0,
                        'parent_id':0
                    }
                ];
            }
        };

        /**
         * 组装数据. 需要一个树结构.
         * @param node  开始节点.
         * @param nodes 节点集.
         * @returns {*}
         */
        function getNodeData(nodes){
            var data= [];
            var parents = getChildNode(0,nodes);
            $.each(parents,function(index,item){
                data.push(createData(item,nodes));
            });
            return data;
        }
        // 创建data
        function createData(node,nodes){
            var row = {
                'name':node.filename,
                'id':node.id,
                'path':node.path,
                'parent_id':node.parent_id
            };
            var data = getChildNode(node.id,nodes);
            if(data.length > 0 ){
                row.children = [];
                // 这里递归.
                $.each(data,function(index,item){
                    row.children.push(createData(item,nodes));
                });

            }
            return row;
        }
        // 获取子节点.
        function getChildNode(parent_id,nodes){
            var data= [];
            $.each(nodes,function(index,item){
                if(item.parent_id == parent_id){
                    data.push(item);
                }
            });
            return data;
        }
    });
}

/**
 * 绑定"上传文件"
 */
function bindBtnUpload() {
    $('.main .btns-line-bar').find('[name="btn-upload"]').off('click').on('click', function(e) {
        showUploadPanel(true);
    });
}

function bindUndoRedo() {
    var $bar = $('.path-line-bar .redo-undo');
    $bar.find('.dir-undo, .dir-redo').each(function() {
        $(this).addClass('disabled');
    });
    $bar.find('.dir-undo').click(function(event) {
        goPrevPath($(this));
    });
    $bar.find('.dir-redo').click(function(event) {
        goNextPath($(this));
    });
}

/**
 * 获取路径历史
 */
function getPathHistory() {
    var data = store.get('path-history');
    if(!data) {
        data = {
            current: -1,
            histories: []
        };
    }
    return data;
}

/**
 * 获取上一条(旧)路径
 */
function goPrevPath($elem) {
    if($elem.hasClass('disabled')) {
        return;
    }
    var data = getPathHistory();
    var len = data.histories.length;
    if(len > 0) {
        data.current -= 1;
        var path = data.histories[data.current];
        var pathes = (path && path.length > 0) ? path.split('/') : [];
        changeFolder(pathes, true);
        $elem.parent().find('.dir-redo').removeClass('disabled');
        store.set('path-history', data);
        if(data.current < 1) {
            $elem.addClass('disabled');
        }
    }
    else {
        $elem.addClass('disabled');
    }
}

/**
 * 获取下一条(新)路径
 */
function goNextPath($elem) {
    if($elem.hasClass('disabled')) {
        return;
    }
    var data = getPathHistory();
    var len = data.histories.length;
    if(len > 0) {
        data.current += 1;
        var path = data.histories[data.current];
        var pathes = (path && path.length > 0) ? path.split('/') : [];
        changeFolder(pathes, true);
        var $redo = $elem.parent().find('.dir-undo');
        $redo.removeClass('disabled');
        store.set('path-history', data);
        if(data.current >= len - 1) {
            $elem.addClass('disabled');
        }
    }
    else {
        $elem.addClass('disabled');
    }
}

/**
 * 添加新的路径记录
 */
function appendPath(new_path) {
    if(new_path == '所有文件') {
        return;
    }
    var data = getPathHistory();
    // 最大次数限制
    if(data.histories.length > 2048) {
        data.histories = [];
    }
    if(!data.inited) {
        data.inited = true;
    }
    else {
        data.histories.push(new_path);
        data.current += 1;
        var $undo = $('.path-line-bar .redo-undo').find('.dir-undo');
        $undo.removeClass('disabled');
    }
    store.set('path-history', data);
}

/**
 * 重置路径记录
 */
function resetPath(init_path) {
    var his = [],
        c = -1,
        inited = false;
    if(init_path) {
        his.push(init_path);
        c = 0;
        inited = true;
    }
    store.set('path-history', {
        current: c,
        histories: his,
        inited: inited
    });
}

/**
 * 获取最后一次访问的路径(用于打开刷新页面时读取记录)
 */
function getLatestPath() {
    var data = getPathHistory();
    var len = data.histories.length;
    return len > 0 ? data.histories[data.current] : null;
}
// index/list.js
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
// index/upload.js
// from: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 文件添加到上传队列
 */
function addFile(e, data, that) {
    var _files = data.files;
    if(_files.length > 0) {
        var $up = $('.upload-panel');
        var $drag_area = $up.find('.panel .panel-body');
        var _file = _files[0];

        var _current_id = ['id_', (new Date()).getTime()].join('');
        var _progress = [
            '<li class="list-group-item" id="', _current_id,'">',
                '<div style="height: 1em;">',
                    '<span class="current-update-name">',
                    _file.name,
                    '</span>',
                    '<span class="update-size">(',
                    utils.formatFileSize(_file.size),
                    ')</span>',
                    '<span class="update-status">排队中</span>',
                '</div>',
                '<div class="progress">',
                    '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;">0%</div>',
                '</div>',
            '</li>'
        ].join('');
        if($drag_area.find('ul').length < 1) {
            $drag_area.append('<ul></ul>');
        }
        var $tip = $drag_area.find('.upload-tip');
        if(!$tip.hasClass('list-mode')) {
            $tip.addClass('list-mode');
        }
        $drag_area.find('ul').append(_progress);

        var upload_quene = $(document.body).data('upload-quene');
        if(!upload_quene) {
            upload_quene = [];
            $(document.body).data('upload-quene', upload_quene);
        }
        data['id'] = _current_id;
        data['client_hash'] = md5(_current_id + uuid());
        data['relative_path'] = _file.relativePath;
        var arr_path = getBreadcrumb();
        var current_path = arr_path.join('/');
        data['current_path'] = current_path;
        upload_quene.push(data);
        data.context = $('#', _current_id).find('.upload-status');
        if(upload_quene.length < 2) {
            $(document.body).attr('upload-progress-id', _current_id);
            data.submit();
        }
    }
}
/**
 * 文件上传进度更新
 */
function setFileProgress(e, data, that) {
    var progress = parseInt(data.loaded / data.total * 100, 10);
    var $current_li = $(['#', $(document.body).attr('upload-progress-id')].join(''));
    var $progress_bar = $current_li.find('.progress-bar');
    $progress_bar.css('width', progress + '%');
    $progress_bar.text(progress + '%');
    $progress_bar.attr('aria-valuenow', progress);
    $current_li.find('.update-status').text('上传中');
}
/**
 * 文件上传完成
 */
function fileDoneCallback(e, data, that) {
    var $current_li = $(['#', $(document.body).attr('upload-progress-id')].join(''));
    $current_li.find('.update-status').text('已上传');
    // 防止文件上传失败.
    if(data.result.error > 0){
        console.dir($(document.body).data('upload-quene'));
        notifyDanger(data.result.desc);
        // 防止万一
        $('.progress-bar').css({'color':'red','background-color':'red'});
        $current_li.find('.update-status').text('上传失败!');
        $current_li.find('.update-status').css({'color':'red'});
    }
    setTimeout(function() {
        $current_li.find('.progress').fadeOut(1000, function() {
            var arr_path = getBreadcrumb();
            changeFolder(arr_path, true);
            var $ul = $('.upload-panel .panel-body .upload-tip + ul');
            if($ul.length > 0) {
                var inner_height = 0;
                $ul.children('li').each(function(i, elem) {
                    inner_height += $(elem).outerHeight();
                });
            }
            inner_height + 20;
            var max_height = parseInt($('.main').css('height').replace('px', ''));
            var aval_height = max_height > 300 ? (max_height - 120) : 100;
            $ul.height(inner_height <= aval_height ? inner_height : aval_height);
        });
        var upload_quene = $(document.body).data('upload-quene');
        if(upload_quene.length > 0) {
            upload_quene.shift();
            if(upload_quene.length > 0) {
                var next_upload = upload_quene[0];
                $(document.body).data('upload-quene', upload_quene);
                $(document.body).attr('upload-progress-id', next_upload['id']);
                next_upload.submit();
            }
        }
    }, 100);
}
/**
 * 文件上传失败
 */
function failProcess(e, data, that) {
    var fu = $(that).data('blueimp-fileupload') || $(that).data('fileupload');
    var retries = 0;
    try {
        retries = data.context.data.retries || 0;
    }
    catch (ex) {
        retries = 0;
    }
    var retry = function () {
        var resume_url = utils.mergeUrl(App.baseUrl, '/api/fs/resume_upload');
        $.getJSON(resume_url, {
            file: data.files[0].name
        }).done(function(result) {
            var file = result.file;
            data.uploadedBytes = file && file.size;
            // clear the previous data:
            data.data = null;
            data.submit();
        }).fail(function () {
            fu._trigger('fail', e, data);
        });
    };
    if (data.errorThrown !== 'abort' &&
            data.uploadedBytes < data.files[0].size &&
            retries < fu.options.maxRetries) {
        retries += 1;
        //修改次数.
        data.context.data.retries = retries;
        // data.context.data('retries', retries);
        window.setTimeout(retry, retries * fu.options.retryTimeout);
        return;
    }
    data.context.removeData('retries');
    // 这里有问题.
    $.blueimp.fileupload.prototype.options.fail.call(that, e, data);
}


/**
 * 得到上传配置
 */
function getConfig($drag_area) {
    var $file_input = $drag_area.find('.upload-tip input[name="filename"]');
    var _cfg = {
        url: utils.mergeUrl(App.baseUrl, '/api/fs/upload'),
        dataType: 'json',
        autoUpload: false,
        singleFileUploads: false,
        limitMultiFileUploads: 1,
        limitConcurrentUploads: 1,
        sequentialUploads: true,
        maxChunkSize: 1024 * 1024 * 10, // 10 MB
        maxRetries: 10,
        retryTimeout: 500,
        dragdrop: true,
        dropZone: $drag_area,
        fileInput: $file_input,
        formData: function(args) {
            return [
                {
                    name: 'field',
                    value: 'filename'
                },
                {
                    name: 'hash',
                    value: this.client_hash
                },
                {
                    name: 'relative',
                    value: this.relative_path || ''
                },
                {
                    name: 'current',
                    value: this.current_path || ''
                }
            ];
        },
        add: function(e, data) {
            addFile(e, data, this);
        },
        submit: function(e, data) {
            // console.log('submit-file');
        },
        progressall: function (e, data) {
            setFileProgress(e, data, this);
        },
        done: function (e, data) {
            fileDoneCallback(e, data, this);
        },
        fail: function (e, data) {
            failProcess(e, data, this);
        }
    };
    return _cfg;
}

/**
 * 初始化上传面板
 */
function initUploadPanel() {
    var $up = $('.upload-panel');
    // 屏蔽默认拖拽事件
    $(document).bind('dragstart drag dragenter dragover dragleave drop dragend', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    // 设置上传
    var $drag_area = $up.find('.panel .panel-body');
    var fu_cfg = getConfig($drag_area);
    $drag_area.fileupload(fu_cfg);

    bindUploadPanelEvent();
}

/**
 * 显示上传面板
 * @param triggr_file_picker 是否触发文件选择
 */
function showUploadPanel(triggr_file_picker) {
    if(triggr_file_picker) {
        console.log('TODO 选择文件')
    }
    var $up = $('.upload-panel');
    $up.removeClass('min');
    $up.show(300);
}

/**
 * 关闭上传面板
 */
function closeUploadPanel() {
    var $up = $('.upload-panel');
    $up.hide(500);
}

/**
 * 事件绑定
 */
function bindUploadPanelEvent() {
    var $up = $('.upload-panel');
    $up.find('.panel-heading .btn-icon-close').off('click').on('click', function(e) {
        closeUploadPanel();
    });
    $up.find('.panel-heading .btn-icon-min').off('click').on('click', function(e) {
        if($(this).hasClass('min-hide')) {
            if(!$up.hasClass('min')) {
                $up.addClass('min');
            }
        }
        else if($(this).hasClass('min-show')) {
            $up.removeClass('min');
        }
    });

    var $drag_area = $up.find('.panel .panel-body');
    $(document.body).bind('dragenter dragover', function (e) {
        if(!$drag_area.hasClass('drag-over-doc-body')) {
            $drag_area.addClass('drag-over-doc-body');
        }
    });
    $(document.body).bind('dragleave drop dragend', function (e) {
        if($drag_area.hasClass('drag-over-doc-body')) {
            $drag_area.removeClass('drag-over-doc-body');
        }
    });
    $drag_area.bind('dragenter dragover', function (e) {
        if(!$drag_area.hasClass('drag-over-area')) {
            $drag_area.addClass('drag-over-area');
        }
    });
    $drag_area.bind('dragleave drop dragend', function (e) {
        if($drag_area.hasClass('drag-over-area')) {
            $drag_area.removeClass('drag-over-area');
        }
    });
}
// index/__call__.js
/**
 * docs:
 *    1. mCustomScrollbar: http://manos.malihu.gr/jquery-custom-content-scroller/
 *
 */

// 目录树视图-导航栏美化
// $("#tab-fstree .sidebar-main").mCustomScrollbar({
//     theme: "dark",
//     axis:"xy",
//     callbacks: {
//         onCreate: function() {
//             updateSidebar(this);
//         }
//     }
// });

// // 分类视图-导航栏美化
// $("#tab-classify .sidebar-main").mCustomScrollbar({
//     theme: "dark",
//     // axis:"yx",
//     callbacks: {
//         onCreate: function() {
//             updateSidebar(this);
//         }
//     }
// });

// 窗口大小改变事件绑定
$(window).resize(function(event) {
    // 调整左侧选项卡
    $('#tab-fstree, #tab-classify').each(function(index, el) {
        var $bar = $(el).find('.sidebar-main');
        updateSidebar($bar[0]);
        var $main = $('.page-body').find('.main');
        var sh = $('.sidebar').outerHeight(),
            mh = $main.outerHeight(true);
        $main.height(sh - (mh - $main.height()));
        $('.page-body').find('.move-line').height(sh);
    });
    // 页面内容大小调整
    var $p_body = $('.page-body');
    var $bar = $p_body.find('.sidebar'),
        $line = $p_body.find('.move-line'),
        $p_main = $p_body.find('.main');

    var body_w = parseInt($p_body.css('width').replace('px', '')),
        bar_w = $bar.outerWidth(true),
        main_w = $line.outerWidth(true) + 2;
    $p_main.css('width', body_w - bar_w - main_w + 8);
    // 调整路径导航栏宽度
    var $r = $('.redo-undo');
    var $p = $r.parent();
    var $b = $p.find('.breadcrumb-wrapper');
    var _rw = $r.outerWidth(true);
    var _bw = $p.width() - _rw - ($b.outerWidth(true) - $b.width());
    $b.width(_bw - 10);
});

$('.tree-refresh').off('click').on('click', function(e) {
    var arr_path = getBreadcrumb();
    var current_path = arr_path.join('/');
    if(!current_path || current_path.length < 1) {
        current_path = null;
    }
    getFSTree(current_path);
});
// 设置初始化标志(用于标识数据没有初始化)
$('.main .breadcrumb-wrapper .breadcrumb').attr('breadcrumb-inited', true);
var latest_path = getLatestPath();
resetPath(latest_path);
bindUndoRedo();
getFSTree(latest_path);

changeSidebarSize();

treeContextMenu();

bindBtnCreateFolder();

bindBtnUpload();

initUploadPanel();

$('#fs-picker-modal-move').off('show.bs.modal').on('show.bs.modal', function (event) {
    var recipient = '移动';
    var modal = $(this);
    var item_id = parseInt(modal.attr('data-current'));
    modal.find('.modal-title').text(recipient);
    // 注册点击事件.
    modal.find('.kz-btn-submit').off('click').on('click',function(){

    });
});

layui.config({
    dir: utils.mergeUrl(GLOBAL.SITE_BASE_URL, '/lib/layui/') //layui.js 所在路径
});

showCategory();

checkTable();
   });
});