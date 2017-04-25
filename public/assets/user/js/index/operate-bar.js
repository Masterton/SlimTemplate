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