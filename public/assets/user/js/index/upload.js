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