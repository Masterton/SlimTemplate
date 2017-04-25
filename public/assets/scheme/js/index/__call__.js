/**
 * Created by whs on 17-4-7.
 */
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

$(window).trigger('resize');


$('#fs-picker-modal-move').off('show.bs.modal').on('show.bs.modal', function (event) {});

do_sumbit();

show_list();

modify_scheme();

insert();