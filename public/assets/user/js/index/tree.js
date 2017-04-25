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