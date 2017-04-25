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