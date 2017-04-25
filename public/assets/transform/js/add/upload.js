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