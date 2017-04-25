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
// add/main.js
/**
 * Created by whs on 17-4-7.
 */
/**
 * 显示文件树.
 * @param demo
 */
function show_tree(demo){
    demo.empty();
    layui.use('tree', function() {
        var nodes=null;
        $.ajax({
            'url':utils.mergeUrl(App.baseUrl,'/api/video/file'),
            'type':'get',
            'data':null,
            'dataType':'json',
            'success':function(data){
                if(data.error == 0){
                    nodes = data.data;
                    layui.tree({
                        elem: '#demo',//指定元素
                        nodes: createTree(nodes),
                        click:function(item){
                            $('.file-info').attr({'data-id':item.id});
                            $('[name=file_id]').val(item.id);
                            $('.file-info').html(item.name);
                        }
                    });
                }
            }
        });
        //生成一个模拟树
        var createTree = function(nodes) {
            if(nodes.length > 0){
                // 开始组装数据.
                // console.dir(getNodeData(nodes));
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
            $.each(nodes,function(index,item){
                var row={
                    'name':item.name,
                    'id':item.id
                };
                data.push(row);
            });
            return data;
        }
    });
}


function do_sumbit(){
    $('#submits').off('click').on('click',function(){
        var form = $('#form1');
        // 一大堆判断开始.
        var format,bit,resolution,frames,watermark,
            position,audio_hz,audio_bit,channel;

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
        watermark = $('#form').attr('data-path');
        if(watermark){
            position = $('input[name=position]').val();
            if(!position){
                notifyDanger('请填写水印位置!');
                return;
            }
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
        // 开始获取值.
        $.ajax({
            'type': 'post',
            'url': utils.mergeUrl(App.baseUrl,'/api/video/transform'),
            'dataType': 'json',
            'data':form.serialize(),
            'success': function (data) {
                if(data.error == 0){
                    notifySuccess('开始转化视频!');
                    get_progress();
                }else{
                    notifyDanger(data.desc);
                }
            },
            'error': function () {
                notifyDanger('链接服务器失败!请稍后重试');
            }
        });
    });
}

function get_list(){
    $.ajax({
        'type':'get',
        'data':null,
        'dataType':'json',
        'url':utils.mergeUrl(App.baseUrl,'/scheme/lists'),
        'success':function(data){
            var html = '';
            if(data.data.length > 0){
                var option = '<option value="">请选择</option>';
                $.each(data.data,function(index,item){
                    option += [
                        '<option value="',item.id,'">',
                        item.scheme_name,
                        '</option>'
                    ].join('');
                });
                html += [
                    '<select name="scheme" id="scheme" class="form-control">',
                    option,
                    '</select>'
                ].join('');
            }else{
                html = [
                        '<select name="scheme" id="scheme" class="form-control">',
                            '<option value="">请选择</option>',
                        '</select>'
                ].join('');
            }
            $('.scheme').html(html);

            $('#scheme').off('change').on('change',function(){
                var value = $(this).val();
                if(value == '请选择'){
                    scheme_change(false);
                }else{
                    scheme_change(value);
                }
            });
        }
    });
}

function bindEvent(){
    $('.scheme-add').off('click').on('click',function(){
        dialog.confirm('是否离开此界面,离开后将重新填写信息', '操作询问', function() {
            location.href=utils.mergeUrl(App.baseUrl,'/scheme');
        }, function() {
            notifyInfo('操作已取消');
        }, true);
    });
    var $up = $('.upload-panel');
    $up.find('.panel-heading .btn-icon-min').off('click').on('click', function(e) {
        console.dir(1);
        if($(this).hasClass('min-hide')) {
            if(!$up.hasClass('min')) {
                $up.addClass('min');
            }
        }
        else if($(this).hasClass('min-show')) {
            $up.removeClass('min');
        }
    });
}
/**
 * 填充数据.
 */
function scheme_change(value){
    if(value){
        $.ajax({
            'type':'post',
            'url':utils.mergeUrl(App.baseUrl,'/scheme/one'),
            'data':{'scheme_id':value},
            'success':function(data){
                if(data.error == 0){
                    fill_data(data.data);
                }else{
                    notifyDanger(data.desc);
                }
            }
        });
    }else{
        clear_form();
    }
}

function fill_data(data){
    $('[name=format]').val(data.format);
    $('input[name=bit]').val(data.bit);
    $('input[name=resolution]').val(data.resolution);
    $('[name=frames]').val(data.frames);
    $('input[name=audio_hz]').val(data.audio_hz);
    $('input[name=audio_bit]').val(data.audio_bit);
    $('[name=channel]').val(data.channel);
}


function clear_form(){
    $('[name=format]').val('');
    $('input[name=bit]').val('');
    $('input[name=resolution]').val('');
    $('[name=frames]').val('');
    $('input[name=audio_hz]').val('');
    $('input[name=audio_bit]').val('');
    $('[name=channel]').val('');
}


function init_water(){
    $.ajax({
        'type':'post',
        'url':utils.mergeUrl(App.baseUrl,'/api/water/lists'),
        'data':null,
        'dataType':'json',
        'success':function(data){
            if(data.data.length > 0){
                var data= data.data;
                var html = '<option value="0">请选择</option>';
                $.each(data,function(index,item){
                    var option = [
                        '<option value="',item.id,'">',
                        item.file_name,
                        '</option>'
                    ].join('');
                    html += option;
                });
                $('#water_id').html(html);
                $('#water_id').off('change').on('change',function(){
                   if($(this).val() == 0){
                       $('#upload_water').show();
                   }else{
                       $('#watermark').val('');
                       $('#upload_water').hide();
                   }
                });
            }
        }
    });
}

function get_progress(){
    var time_out = setInterval(function(){
        $.ajax({
            'url':utils.mergeUrl(App.baseUrl,'/api/video/progress'),
            'type':'get',
            'data':null,
            'dataType':'json',
            'success':function(data){
                if(data.data){
                    // 找到元素
                    // $('.panel-body').show();
                    $('.upload-panel').show();
                    var data = data.data;
                    var html = '';
                    $.each(data,function(index,item){
                        var status = '等待转码!';
                        switch(item.status){
                            case 0:
                                status = '等待转码';
                                break;
                            case 1:
                                status = '转码中';
                                break;
                            case 2:
                                status = '转码成功';
                                break;
                            case 3:
                                status = '转码失败';
                                break;
                        }
                        var li = [
                            '<li class="list-group-item">',
                                '<div>',
                                    '<span class="current-update-name">'+item.file_name+'</span>',
                                    '<span class="update-status">'+status+'</span>',
                                '</div>',
                                '<div class="progress">',
                                    '<div class="progress-bar" role="progressbar" aria-valuenow="'+item.progress+'" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em; width: '+item.progress+'%;">',item.progress,'%</div>',
                                '</div>',
                            '</li>'
                        ].join('');
                        html += li;
                    });
                    var ul = [
                        '<ul>',html,'</ul>'
                    ].join('');
                    $('.panel-body').html(ul);
                    $('.upload-panel').show();
                }else{
                    clearInterval(time_out);
                    closeUploadPanel();
                }
            }
        });
    },3000);
}

/**
 * 关闭上传面板
 */
function closeUploadPanel() {
    var $up = $('.upload-panel');
    $up.hide();
}

// add/__call__.js
/**
 * Created by whs on 17-4-7.
 */

(function(){
    $('#select').off('click').on('click',function(){
        var demo = $('#fs-picker-modal-move').find('#demo');
        // 所有的文件树.
        show_tree(demo);
        var modal  = $('#fs-picker-modal-move');
        modal.modal('show');
        modal.find('.kz-btn-submit').off('click').on('click',function(){
            if($('input[name=file_id]').val()){
                // 这里获得数据.组装到表格中,并显示下面表单
                $('.main-transform').show();
                // 重新获得填写的叙述  是否需要保存?
                modal.modal('hide');
            }else{
                modal.modal('hide');
            }
        });

        modal.find('.kz-btn-default').off('click').on('click',function(){
            $('.main-transform').hide();
            $('.file-info').removeAttr('data-id');
            $('.file-info').html('');
        });
    });
})();

$('#fs-picker-modal-move').off('show.bs.modal').on('show.bs.modal', function (event) {});

layui.config({
    dir: utils.mergeUrl(GLOBAL.SITE_BASE_URL, '/lib/layui/') //layui.js 所在路径
});

/**
 * 初始化上传插件.
 */
initUploadPanel();
/**
 * 提交表单.
 */
do_sumbit();

get_list();

bindEvent();

init_water();

get_progress();
// add/upload.js
/**
 * Created by whs on 17-4-10.
 */
/**
 * 得到上传配置
 */
function getConfig($file_input) {
    // var $file_input = $drag_area.find('.upload-tip input[name="filename"]');
    var _cfg = {
        url: utils.mergeUrl(App.baseUrl, '/api/video/file'),
        dataType: 'json',
        autoUpload: true,
        singleFileUploads: true,
        limitMultiFileUploads: 1,
        limitConcurrentUploads: 1,
        sequentialUploads: true,
        acceptFileTypes:/(\.|\/)(gif|jpe?g|png|bmp)$/i,
        maxChunkSize: 1024 * 1024 * 10, // 10 MB
        maxRetries: 10,
        retryTimeout: 500,
        dragdrop: true,
        // dropZone: $drag_area,
        fileInput: $file_input,
        start:function(e,data){
            // 上传开始前.
            $('.btn-warning').attr({'disabled':'disabled'});
        },
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
            // setFileProgress(e, data, this);
        },
        done: function (e, data) {
            $('.btn-warning').removeAttr('disabled');
            var result = data.result;
            if(result.error == 0){
                $('input[name=water_path]').val(result.data.water_path);
                $('input[name=water_name]').val(result.data.water_name);
                notifySuccess(result.desc);
            }else{
                notifyWarning(result.desc);
            }
            // fileDoneCallback(e, data, this);
        },
        fail: function (e, data) {
            // failProcess(e, data, this);
        }
    };
    return _cfg;
}


/**
 * 初始化上传
 */
function initUploadPanel() {
    var $up = $('#watermark');
    var fu_cfg = getConfig($up);
    $up.fileupload(fu_cfg);
}

/**
 * 添加文件到上传列表中.
 * @param e
 * @param data
 * @param that
 */
function addFile(e,data,that){
    var config = $(that).data('blueimp-fileupload') || $(that).data('fileupload');
    var $file = data.files;
    // 这里开始上传.
    if($file.length > 0){
        $file = $file[0];
        var preg= config.options.acceptFileTypes;
        if(preg.test($file.name)) {
            var _current_id = ['id_', (new Date()).getTime()].join('');
            data['id'] = _current_id;
            data['client_hash'] = md5(_current_id + uuid());
            data.submit(e,data);
        }else{
            notifyDanger('不允许上传的文件类型');
        }
    }else{
        notifyWarning('请选择一张图片,作为水印图片!');
    }
}

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
   });
});