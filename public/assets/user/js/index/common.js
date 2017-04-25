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