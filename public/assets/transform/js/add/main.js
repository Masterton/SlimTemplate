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
