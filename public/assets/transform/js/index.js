define(['layui','jquery', 'utils', 'md5','dialog','bootstrap-notify','jquery-fileupload'], function(layui,$, utils,md5,dialog) {
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
 * Created by whs on 17-4-24.
 */



(function(){
    $.ajax({
        'type':'get',
        'url':utils.mergeUrl(App.baseUrl,'/api/video/progress'),
        'data':{'status':2},
        'success':function(data){
            data = data.data;
            if(data.length == 0){
                $('tbody').html(
                    [
                        '<tr><td colspan="7" style="text-align: center;">暂无数据</td></tr>'
                    ].join('')
                );
            }else{
                var html = '';
                $.each(data,function(index,item){
                    var tr = [
                        '<td>',item.id,'</td>',
                        '<td>',item.file_name,'</td>',
                        '<td>',item.file_type,'</td>',
                        '<td>',item.create_at,'</td>',
                        '<td>',item.hash+'.'+item.file_type,'</td>',
                        '<td class="check" data-hash="'+item.hash+'">' +
                        '   <a href="javascript:;">查看</a>' +
                        '</td>',
                        '<td class="download" data-hash="'+item.hash+'">' +
                        '   <a href="javascript:;">下载</a>' +
                        '</td>',
                    ].join('');
                    html += tr;
                });
                html = '<tr>'+ html + '</tr>';
                $('tbody').html(html);
                $('tbody').find('.check').off('click').on('click',function(){
                    location.href=utils.mergeUrl(App.baseUrl,'/file/transform')+'/?file='+$(this).attr('data-hash');
                });
                $('tbody').find('.download').off('click').on('click',function(){
                    location.href=utils.mergeUrl(App.baseUrl,'/file/transform')+'/?file='+$(this).attr('data-hash')+'&download=1';
                })
            }
        }
    });


    $('.btn-success').off('click').on('click',function(){
        location.href = utils.mergeUrl(App.baseUrl,'/transform/add');
    });
})();

   });
});