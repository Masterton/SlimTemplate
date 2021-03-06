define(['layui','jquery', 'utils', 'md5','bootstrap-notify','jquery-fileupload'], function(layui,$, utils,md5) {
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
// index/main.js
/**
 * Created by whs on 17-4-7.
 */
function do_sumbit(){
    $('#submits').off('click').on('click',function(){
        var form = $('#form1');
        // 一大堆判断开始.
        var format,bit,resolution,frames,
            audio_hz,audio_bit,scheme_name;
        scheme_name = $('[name=scheme_name]').val();
        if(!scheme_name){
            notifyDanger('请填写方案名称.');
            return;
        }
        format = $('[name=format]').val();
        if(!format){
            notifyDanger('请选择视频格式!');
            return;
        }
        bit = $('input[name=bit]').val();
        if(!bit){
            notifyDanger('请填写视频码率!');
            return;
        }
        resolution = $('input[name=resolution]').val();
        if(!resolution){
            notifyDanger('请填写视频分辨率!');
            return;
        }
        frames = $('[name=frames]').val();
        if(!frames){
            notifyDanger('请选择视频帧数!');
            return;
        }
        audio_hz = $('input[name=audio_hz]').val();
        if(!audio_hz){
            notifyDanger('请填写音频采样率!');
            return;
        }
        audio_bit = $('input[name=audio_bit]').val();
        if(!audio_bit){
            notifyDanger('请填写音频比特率');
            return;
        }
        var type = 'post';
        if($('input[name=scheme_id]').val()){
            type = 'put';
        }
        // 开始获取值.
        $.ajax({
            'type': type,
            'url': utils.mergeUrl(App.baseUrl,'/api/scheme'),
            'dataType': 'json',
            'data':form.serialize(),
            'success': function (data) {
                if(data.error == 0){
                    notifySuccess(data.desc);
                    //重新读取数据.
                    show_list();
                    checkTable(true);
                }else{
                    notifyDanger(data.desc);
                }
            },
            'error': function () {

            }
        });
    });
}

function show_list(){
    $.ajax({
        'type':'get',
        'data':null,
        'url':utils.mergeUrl(App.baseUrl,'/scheme/lists'),
        'dataType':'json',
        'success':function(data){
            if(data.data.length == 0){
                // 暂无数据.
                var html = '<ul class="nav nav-sidebar"><li><a href="#">暂无数据</a></li></ul>';
                $('.sidebar-main').html(html);
            }else{
                // 填充数据.
                var data = data.data;
                var html = '';
                $.each(data,function(index,item){
                    html += [
                        '<li data-id="',item.id,'">',
                            '<a href="#">',item.scheme_name,'</a>' ,
                        '</li>'
                    ].join('');
                });
                $('.sidebar-main').find('ul').html(html);
            }
            modify_scheme();
        }
    });
}

function modify_scheme(){
    $('.sidebar-main').find('a').off('click').on('click',function(){
        $(this).parents('li').addClass('active').siblings('li').removeClass('active');
        // 这里是ID
        var data_id = $(this).parents('li').attr('data-id');
        if(data_id){
            $.ajax({
                'type':'post',
                'data':{'scheme_id':data_id},
                'url':utils.mergeUrl(App.baseUrl,'/scheme/one'),
                'dataType':'json',
                'success':function(data){
                    if(data.error == 0){
                        fill_data(data.data)
                        checkTable(false);
                    }else{
                        notifyDanger(data.desc);
                    }
                },
                'error':function(e){
                    console.dir(e);
                }
            });
        }else{
            // 这里显示新增界面.
        }
    });
}

/**
 * 填充数据.
 * @param data
 */
function fill_data(data){
    $('[name=format]').val(data.format);
    $('[name=scheme_name]').val(data.scheme_name);
    $('input[name=bit]').val(data.bit);
    $('input[name=resolution]').val(data.resolution);
    $('[name=frames]').val(data.frames);
    $('input[name=audio_hz]').val(data.audio_hz);
    $('input[name=audio_bit]').val(data.audio_bit);
    $('[name=channel]').val(data.channel);
    if(data.is_default){
        $('[name=is_default]').attr({'checked':true});
    }
    $('input[name=scheme_id]').val(data.id);
    // 新增一个按钮到界面上.
    var html = '<button type="button" id="delete" class="btn btn-success">删除方案</button>';
    $('.delete').html(html);
    $('#delete').off('click').on('click',function(){
        // 得到ID
        var scheme_id =$('input[name=scheme_id]').val();
        $.ajax({
            'type':'delete',
            'data':{'scheme_id':scheme_id},
            'url':utils.mergeUrl(App.baseUrl,'/api/scheme'),
            'dataType':'json',
            'success':function(data){
                if(data.error == 0){
                    notifySuccess('删除成功!');
                    show_list();
                    checkTable(true);
                }else{
                    notifyDanger(data.desc);
                }
            }
        });
    });
}


function clear_form(){
    $('[name=format]').val('');
    $('[name=scheme_name]').val('');
    $('input[name=bit]').val('');
    $('input[name=resolution]').val('');
    $('[name=frames]').val('');
    $('input[name=audio_hz]').val('');
    $('input[name=audio_bit]').val('');
    $('[name=channel]').val('');
    $('input[name=scheme_id]').val('');
}

function insert() {
    $('.add-scheme').off('click').on('click',function(){
        clear_form();
        checkTable(false);
        $('.delete').html('');
    });
}

function checkTable(check){
    if(check){
        $('.form-add').show();
        $('.form-main').hide();
    }else{
        $('.form-add').hide();
        $('.form-main').show();
    }
}
// index/__call__.js
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
   });
});