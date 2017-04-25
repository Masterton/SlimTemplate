define(['jquery', 'utils', 'dialog', 'scrollbar', 'bootstrap-notify'], function($, utils, dialog) {
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
// merge-common/js/fs-picker.js
/**
 * 文件目录选择　组件
 */
function FSPicker(options) {
    var _default = {
    };
    this.cfg = $.extend(true, _default, options);
    self.inited = false;
}

FSPicker.prototype = {
    init: function() {
        // 初始化
        var self = this;
        self.inited = true;
        self.cfg.modal.off('show.bs.modal').on('show.bs.modal', function (e) {
            self._showLoading();
        });
        self.listview = self.cfg.modal.find('.modal-body').find('ul.list-group');
        self._bindListView();
        self._bindOK();
        self._bindGotoTop();
    },
    _showLoading: function() {
        // 显示加载动画
        ;
    },
    _removeLoading: function() {
        // 移除加载动画
        ;
    },
    _getList: function(path, type, ignore) {
        // (发请求)获取数据列表
        var self = this;
        self.listview.removeData('data-type');
        self.listview.data('data-type', type);
        if(!path && !ignore) {
            var old_path = self.listview.attr('data-path');
            if(old_path) {
                path = old_path;
            }
        }
        // 获取目录下面的内容
        $.ajax({
            url: self.cfg.url,
            type: 'POST',
            dataType: 'json',
            data: {
                path: path
            },
            success: function(data) {
                self._removeLoading();
                self.listview.attr('data-path', path ? path : '');
                if(data.data && data.data.length > 0) {
                    self._render(data.data, type);
                }
                else {
                    self._showEmpty();
                }
                self._maybeShowParent(path);
            },
            error: function(data) {
                console.log(data);
            }
        });
    },
    _maybeShowParent: function(path) {
        // 显示返回上层(根据　path　判断是否显示)
        var self = this;
        var $line = $('#fs-picker-modal-content .current-info-line');
        if(!path) {
            path = '';
        }
        $line.find('.current-path .current-folder').text('/' + path);
        if(path.length > 0) {
            $line.find('.goto-top').show();
        }
        else {
            $line.find('.goto-top').hide();
        }
    },
    _showEmpty: function() {
        // 数据为空时显示　没有数据的信息提示
        var self = this;
        self.listview.empty();
        var li = [
            '<li class="list-group-item">',
                '<div class="empty-item">',
                    '<span>空空如也</span>',
                '</div>',
            '</li>'
        ].join('');
        self.listview.append(li);
    },
    _wrapperData: function(data, type) {
        // 包装数据
        var self = this;
        var list_data = [];
        var icon = '';
        if(type == 'folder') {
            icon = 'fa-folder';
        }
        else if(type == 'file') {
            icon = 'fa-file-o';
        }
        for(var i = 0; i < data.length; i ++) {
            var item = data[i];
            if(type == 'folder') {
                if(item.type == 'dir') {
                    list_data.push({
                        id: item.id,
                        type: 'folder',
                        icon: icon,
                        name: item.basename,
                        path: item.path
                    });
                }
            }
            else {
                list_data.push({
                    id: item.id,
                    type: item.type == 'file' ? 'file' : 'folder',
                    icon: item.type == 'file' ? 'fa-file-o' : 'fa-folder',
                    name: item.basename,
                    path: item.path
                });
            }
        }
        return list_data;
    },
    _render: function(data, type) {
        // 渲染数据
        var self = this;
        // TODO 包装数据
        self._renderList(self._wrapperData(data, type), type);
    },
    _renderList: function(data, type) {
        // 渲染数据列表
        var self = this;
        self.listview.empty();
        if(!type) {
            type = '';
        }
        var select =self.cfg.getDataList();
        console.dir(select);
        for(var i = 0; i < data.length; i ++) {
            var item = data[i];
            var checked ='';
            var disabled='';
            if($.inArray(item.id+item.type,select) >= 0){
                checked='checked="checked"';
                disabled='disabled';
            }
            var input_picker = '<span class="picker-empty"></span>';
            if(type == 'folder') {
                input_picker = '<input type="radio" '+checked+' '+disabled+' name="item-picker" />';
            }
            else if(type == 'file') {
                if(item.type == 'file') {
                    input_picker = '<input type="radio" '+checked+' '+disabled+' name="item-picker" />';
                }
            }
            else {
                input_picker = '<input type="checkbox" '+checked+' '+disabled+' name="item-picker" />';
            }
            var li = [
                '<li class="list-group-item">',
                    '<div data-id="', item.id, '" data-type="', item.type, '" data-path="', item.path, '" data-name="', item.name, '">',
                        input_picker,
                        '<i class="fa ', item.icon, '"></i>',
                        '<span class="item-text">', item.name, '</span>',
                    '</div>',
                '</li>'
            ].join('');
            self.listview.append(li);
        }
    },
    pickMulti: function(path) {
        // 选择文件或文件夹(允许多选)
        var self = this;
        if(!self.inited) {
            self.init();
        }
        self._showDialog({
            title: '选择文件或文件夹'
        });
        self._getList(path);
    },
    pickFile: function(path) {
        // 选择文件
        var self = this;
        if(!self.inited) {
            self.init();
        }
        self._showDialog({
            title: '选择文件'
        });
        self._getList(path, 'file');
    },
    pickFolder: function(path) {
        // 选择文件夹
        var self = this;
        if(!self.inited) {
            self.init();
        }
        self._showDialog({
            title: '选择文件夹'
        });
        self._getList(path, 'folder');
    },
    _showDialog: function(options) {
        // 显示　对话框
        var self = this;
        self.cfg.modal.find('.modal-title').html(options.title);
        self.cfg.modal.modal('show');
    },
    _closeDialog: function() {
        // 关闭对话框
        var self = this;
        self.cfg.modal.modal('hide');
    },
    _bindGotoTop: function() {
        // 绑定返回上层
        var self = this;
        var $elem = $('#fs-picker-modal-content .current-info-line').find('.goto-top');
        $elem.off('click').on('click', function() {
            var req_type = self.listview.data('data-type');
            var current_path = self.listview.attr('data-path');
            var req_path = null;
            if(current_path) {
                if(current_path.length > 0) {
                    if(current_path.indexOf('/') > 0) {
                        var arr = current_path.split('/');
                        arr.pop();
                        req_path = arr.join('/');
                    }
                }
            }
            self._getList(req_path, req_type, true);
        });
    },
    _mergeFolder: function(folder_name) {
        // 合并文件夹到路径
        var self = this;
        var current_path = self.listview.attr('data-path');
        var req_path = '';
        function reverse(s) {
            return s.split('').reverse().join('');
        }
        while((/^\//i).test(folder_name) && folder_name.length > 1) {
            folder_name = folder_name.substr(1);
        }
        req_path = folder_name;
        if(current_path) {
            while((/\/$/i).test(current_path) && current_path.length > 1) {
                current_path = reverse(current_path);
                current_path = current_path.substr(1);
                current_path = reverse(current_path);
            }
            if(current_path > 0) {
                req_path = current_path + '/' + req_path;
            }
        }
        return req_path;
    },
    _bindListView: function() {
        // 数据显示部分，事件绑定
        var self = this;
        self.listview.off('click').on('click', '.list-group-item', function(event) {
            var $handler = $(event.target);
            if($handler.is('input[name="item-picker"] + i.fa, span.item-text')) {
                var $elem = $handler.parents('.list-group-item > [data-type]');
                var item_type = $elem.attr('data-type');
                switch(item_type) {
                    case 'file':
                        var $picker = $elem.find('input[name="item-picker"]');
                        if($picker.is('input[type="radio"]') && $picker.prop('checked')) {
                            // nothing need to do
                        }
                        else {
                            $picker.prop('checked', $picker.prop('checked') == false);
                        }
                        break;
                    case 'folder':
                    default:
                        var item_text = $elem.attr('data-path');
                        var req_type = self.listview.data('data-type');
                        self._getList(self._mergeFolder(item_text), req_type);
                        break;
                }
            }
        });
    },
    _bindOK: function(event) {
        // 绑定　确定　按钮点击
        var self = this;
        self.cfg.modal.find('.kz-btn-submit').off('click').on('click', function() {
            var $items = self.listview.find('input[name="item-picker"]').filter(':checked');
            var files = [],
                folders = [];
            var data=self.cfg.getDataList();
            $items.each(function(index, el) {
                var $item = $(el).parents('.list-group-item > [data-type]');
                var item_id = $item.attr('data-id');
                var item_text = $item.attr('data-path');
                var item_type = $item.attr('data-type');
                var full_path = self._mergeFolder(item_text);
                if(data.length <= 0 || $.inArray(item_id+item_type,data)<0 ){
                    if(item_type == 'file') {
                        files.push({
                            id: item_id,
                            type: 'file',
                            path: full_path
                        });
                    }
                    else if(item_type == 'folder') {
                        folders.push({
                            id: item_id,
                            type: 'folder',
                            path: full_path
                        });
                    }
                }
            });
            if(files.length || folders.length > 0) {
                if(self.cfg.okHook) {
                    if(typeof self.cfg.okHook == 'function') {
                        self.cfg.okHook({
                            files: files,
                            folders: folders
                        });
                    }
                }
                self.cfg.modal.modal('hide');
            }else{
                // 防止万一已经被选中了.
                if($items.length > 0){
                    notifyDanger('已经选择了已使用的文件夹,请重新选择.');
                }else{
                    notifyWarning('请选中所需要展示的文件夹!');
                }
            }
        });
    }
};
// asset/common.js
/**
 * 通过表单方式在新窗口中打开资源
 */
function openAsset(asset_id) {
    if ($('#redirect-from').length < 1) {
        $(document.body).append([
            '<div style="display: none;">',
                '<form id="redirect-from" target="_blank" method="GET" action="', GLOBAL.ASSET_BASE_URL, '">',
                    '<input type="hidden" name="id" value="', asset_id, '" />',
                '</form>',
            '</div>'
        ].join(''));
    } else {
        $('#redirect-from').attr('action', GLOBAL.ASSET_BASE_URL);
        $('#redirect-from').find('input[name="id"]').val(asset_id);
    }
    setTimeout(function() {
        $('#redirect-from').submit();
    }, 50);
}
// asset/overview.js
function getList() {
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/asset/'),
        type: 'GET',
        dataType: 'json',
        data: {},
        success: function(data) {
            if(data.error == 0) {
                showList(data.data);
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            console.log(data);
        }
    });
}

function wrapperListItem(data_item) {
    return [
        '<tr data-id="', data_item.id, '">',
            /*'<td class="col-chk">',
                '<label>',
                    '<input type="checkbox" name="chk-item" />选中',
                '</label>',
            '</td>',*/
            '<td>', data_item.id, '</td>',
            '<td class="cell-name">', data_item.name, '</td>',
            '<td>', data_item.type, '</td>',
            '<td>', data_item.open_time, '</td>',
            '<td>', data_item.open_expires, '</td>',
            '<td>', data_item.download, '</td>',
            '<td>', data_item.count_limit, '</td>',
            '<td>', data_item.code, '</td>',
            '<td class="col-edit">',
                '<a href="javascript:;">编辑</a>',
            '</td>',
            '<td class="col-delete">',
                '<a href="javascript:;">删除</a>',
            '</td>',
        '</tr>'
    ].join('');
}

function showList(data) {
    var $table = $('.list-mode .tb-asset-list');
    var $tbody = $table.find('tbody');
    $tbody.empty();
    for (var i = 0; i < data.length; i++) {
        $tbody.append(wrapperListItem(data[i]));
    }
}

function bindTBodyEvent() {
    var $table = $('.list-mode .tb-asset-list');
    var $tbody = $table.find('tbody');
    // $tbody.off('click').on('click', 'td.cell-name', function(event) {
    //
    // });

    $tbody.off('click').on('click','td',function(event){
        var $td = $(this);
        if($td.hasClass('cell-name')) {
            // var $tr = utils.getLatestParent($td, 'tr');
            var $handler = $(event.target);
            openAsset($handler.parents('tr[data-id]').attr('data-id'));
        }else if($td.hasClass('col-edit')) {
            var item_id=$td.parent('tr').attr('data-id');
            // getRowData(item_id);
            $('#fs-picker-modal-edit').attr('data-current', item_id);
            $('#fs-picker-modal-edit').modal('show');
        } else if($td.hasClass('col-delete')) {
            var tr=$(this).parent('tr');
            var flag = tr.attr('isworking');
            if(flag == 'true'){
                notifyWarning('请勿重复删除同一个资源.');
                return;
            }
            var item_id=tr.attr('data-id');
            deleteResource(item_id,tr);
        }
    });

}


(function(){
    $('#fs-picker-modal-edit').on('show.bs.modal', function (event) {
        var recipient = '编辑';
        var modal = $(this);
        var item_id = parseInt(modal.attr('data-current'));
        getRowData(item_id);
        modal.find('.modal-title').text(recipient);
        // 注册点击事件.
        modal.find('.kz-btn-submit').off('click').on('click',function(){
            uploadResource(modal);
        });
    });
})();

getList();
bindTBodyEvent();

// asset/add.js
// 判断path是否是包含在folder下面
function isContain(folder, path) {
    var pattern = '^' + folder.replace(/[\\]/g, "\\\\") + '\/[^\/]+$';
    var re = new RegExp(pattern, 'ig');
    return re.test(path);                            
}

// 避免递归(如果选择了文件夹，也选择了该文件夹下面的文件或文件夹，则只取其下面的内容，取消该文件夹)
function avoidRecursion(data) {
    var new_data = {
        files: data.files,
        folders: data.folders
    };
    // 根据文件包含去掉父级文件夹
    for(var i = 0; i < data.files.length; i++) {
        var fi = data.files[i];
        var temp = [];
        for(var j = 0; j < new_data.folders.length; j++) {
            var nfo = new_data.folders[j];
            if(!isContain(nfo.path, fi.path)) {
                temp.push(nfo);
            }
        }
        new_data.folders = temp;
    }
    // 根据文件夹包含去掉父级文件夹
    while(new_data.folders.length > 0) {
        var fo = new_data.folders[0];
        var temp = [];
        var has_recursion = false;
        for(var j = 0; j < new_data.folders.length; j++) {
            var nfo = new_data.folders[j];
            if(!isContain(nfo.path, fo.path)) {
                temp.push(nfo);
            }
            else {
                has_recursion = true;
            }
        }
        new_data.folders = temp;
        if(!has_recursion) {
            break;
        }
    }
    
    return new_data;
}

//　显示选择的数据
function showSelected(data) {
    var _type = $('#sel-type').val();
    var is_single = _type != 'package';
    var $selected_items = $('#form1 .selected-items');
    if(!is_single) {
        // 如果不是选择单个，则将已经选择了的条目照搬过来
        var $old_items = $selected_items.find('.list-group-item');
        $old_items.each(function(index, el) {
            var $old_item = $(el);
            var old_type = $old_item.attr('data-type'),
                old_path = $old_item.attr('data-path'),
                old_id = $old_item.attr('data-id');
            if(old_type == 'file') {
                data.files.push({
                    id: old_id,
                    type: 'file',
                    path: old_path
                });
            }
            else if(old_type == 'folder') {
                data.folders.push({
                    id: old_id,
                    type: 'folder',
                    path: old_path
                });
            }
        });
    }
    $selected_items.empty();
    data = avoidRecursion(data);
    var sorted_files = data.files.sort(utils.sort('path asc')),
        sorted_folders = data.folders.sort(utils.sort('path asc'));
    $selected_items.data('data-items', {
        files: sorted_files,
        folders: sorted_folders
    });
    $.each(sorted_folders, function(i, item) {
        $selected_items.append(wrapperSelectedItem(item));
    });
    $.each(sorted_files, function(i, item) {
        $selected_items.append(wrapperSelectedItem(item));
    });
}

// 包装数据
function wrapperSelectedItem(item_data) {
    return [
        '<li class="list-group-item" data-id="', item_data.id, '" data-type="', item_data.type, '" data-path="', item_data.path, '">',
            '<i class="item-icon fa fa-', (item_data.type == 'file' ? 'file-o' : 'folder'), '"></i>',
            '/<span class="selected-item-text">', item_data.path, '</span>',
            '<i class="fa fa-times btn-item-remove"></i>',
        '</li>'
    ].join('');
}

// 发送添加资源的请求
function addAsset(type, items, name, expires, expire_unit, count, code, download) {
    var content = {
        files: [],
        folders: []
    };
    for (var i = 0; i < items.files.length; i++) {
        content.files.push(parseInt(items.files[i].id));
    }
    for (var i = 0; i < items.folders.length; i++) {
        content.folders.push(parseInt(items.folders[i].id));
    }
    if(content.files.length > 0 || content.folders.length > 0) {
        // TODO 数据验证
        $.ajax({
            url: utils.mergeUrl(App.baseUrl, '/api/asset'),
            type: 'POST',
            dataType: 'json',
            data: {
                type: type,
                content: JSON.stringify(content),
                name: name,
                expires: expires,
                expire_unit: expire_unit,
                count: count,
                code: code,
                download: download
            },
            success: function(data) {
                if(data.error == 0) {
                    notifySuccess(data.desc);
                }
                else {
                    notifyDanger(data.desc);
                }
            },
            error: function(data) {
                console.log(data);
            }
        });
    }
    else {
        notifyWarning('缺少资源: 请至少选择一个文件或一个文件夹');
    }
}

var picker = new FSPicker({
    url: utils.mergeUrl(App.baseUrl, '/api/fs/list'),
    modal: $('#fs-picker-modal'),
    okHook: showSelected,
    getDataList:function(){
        var groups=$('#form1 .selected-items .list-group-item');
        var items=[];
        if(groups.length >=1){
            $.each(groups,function(index,item){
                items.push($(item).attr('data-id')+$(item).attr('data-type'));
            });
        }
        return items;
    }
});

$('#form1 .btn-fs-picker').off('click').on('click', function() {
    switch($('#sel-type').val()) {
        case 'file':
            picker.pickFile();
            break;
        case 'folder':
            picker.pickFolder();
            break;
        case 'package':
        default:
            picker.pickMulti();
            break;
    }
});
$('.form-add .selected-items').off('click').on('click', '.btn-item-remove', function(event) {
    $(event.target).parents('.selected-items > .list-group-item').remove();
});
$('.form-add .btn-asset-submit').off('click').on('click', function() {
    var $form = $('#form1');
    var type = $('#sel-type').val(),
        items = $('#form1 .selected-items').data('data-items'),
        name = $('#txt-name').val(),
        expires = $('#txt-expires').val(),
        expire_unit = $('#sel-expires').val(),
        count = $('#txt-count').val(),
        count_limit = $('#sel-count').val() == 'times',
        code = $('#txt-code').val(),
        download = $('#chk-download').prop('checked');
    if(name.length < 1) {
        notifyWarning('名称必填');
        $('#txt-name').focus();
        return;
    }
    if(!items) {
        items = {
            files: [],
            folders: []
        };
    }
    if(!count_limit) {
        count = -1;
    }
    else {
        count = parseInt(count);
    }
    addAsset(type, items, name, expires, expire_unit, count, code, download);
});


// asset/operation.js
/**
 * Created by yuyuangang on 17-3-29.
 */
/**
 * 删除资源.
 * @param item_id
 * @param tr
 */
function deleteResource(item_id,tr){
    var data={
        'item_id':item_id,
        '_method':'delete'
    };
    $.ajax({
        'url': utils.mergeUrl(App.baseUrl,'/api/asset'),
        'data':JSON.stringify(data),
        'dataType':'json',
        'type':'post',
        'beforeSend':function(){
            // 阻止重复提交代码.
            tr.attr({'isworking':true});
        },
        'headers':{
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "DELETE"
        },
        'success':function(data){
            tr.attr({'isworking':false});
            if(data.error == 0){
                // 这里要清除掉刚刚删除的数据.
                $('.table-responsive').find('tr[data-id='+item_id+']').remove();
                notifySuccess(data.msg);
            }else{
                notifyDanger(data.desc);
            }
        },
        'error':function(data){
            console.dir(data);
        }
    });
}
/**
 * 获取准确的开放时间.
 * @param open_expires
 * @returns {{unit: number, value: *}}
 */
function getTime(open_expires){
    var _unit = -1,
        _value = null;
    if(! (open_expires % 2592000)) {
        _unit = 2592000;
        _value = parseInt(open_expires / _unit);
    }else if(!(open_expires % 86400)) {
        _unit = 86400;
        _value = parseInt(open_expires / _unit);
    }else if(!(open_expires % 3600)) {
        _unit = 3600;
        _value = parseInt(open_expires / _unit);
    }else if(!(open_expires % 60)) {
        _unit = 60;
        _value = parseInt(open_expires / _unit);
    }
    return {
        "unit": _unit,
        "value": _value
    };
}
/**
 * 获取一条资源.并且回显出来.
 * @param item_id
 */
function getRowData(item_id){
    $.ajax({
        'type':'get',
        'data':{'id':item_id,'type':'all'},
        'url':utils.mergeUrl(App.baseUrl,'/api/asset/'),
        'success':function (data) {
            if(data.error == 0){
                var data=data.data;
                // 设置类型.
                $('#sel-type-edit').val(data.type);
                // 设置名字
                $('#txt-name-edit').val(data.name);
                // 设置是否允许下载
                if(data.download >= 1){
                    $('#chk-download-edit').prop({'checked':true});
                }
                // 设置访问码
                $('#txt-code-edit').val(data.code);
                // 设置访问次数
                if(data.count_limit > 0){
                    $('#txt-count-edit').val(data.count_limit);
                    $('#sel-count-edit').val('times');
                }
                // 设置开放时长
                if(data.open_expires > 0){
                    var time= getTime(data.open_expires);
                    $('#sel-expires-edit').val(time.unit);
                    $('#txt-expires-edit').val(time.value);
                }else{
                    $('#sel-expires-edit').val(data.open_expires);
                }
                // 设置文件夹.
                setMenuResource(data.file_info);
                $('#form2').find('.modal-body').attr({'data-id':data.id});
            }
        },
        'error':function(){

        },
    });
}

var edit_picker = new FSPicker({
    url: utils.mergeUrl(App.baseUrl, '/api/fs/list'),
    modal: $('#fs-picker-modal'),
    okHook: function showSelected(data) {
        var _type = $('#sel-type').val();
        var is_single = _type != 'package';
        var $selected_items = $('#form2 .selected-items');
        if(!is_single) {
            // 如果不是选择单个，则将已经选择了的条目照搬过来
            var $old_items = $selected_items.find('.list-group-item');
            $old_items.each(function(index, el) {
                var $old_item = $(el);
                var old_type = $old_item.attr('data-type'),
                    old_path = $old_item.attr('data-path'),
                    old_id = $old_item.attr('data-id');
                if(old_type == 'file') {
                    data.files.push({
                        id: old_id,
                        type: 'file',
                        path: old_path
                    });
                }
                else if(old_type == 'folder') {
                    data.folders.push({
                        id: old_id,
                        type: 'folder',
                        path: old_path
                    });
                }
            });
        }
        $selected_items.empty();
        data = avoidRecursion(data);
        var sorted_files = data.files.sort(utils.sort('path asc')),
            sorted_folders = data.folders.sort(utils.sort('path asc'));
        $selected_items.data('data-items', {
            files: sorted_files,
            folders: sorted_folders
        });
        $.each(sorted_folders, function(i, item) {
            $selected_items.append(wrapperSelectedItem(item));
        });
        $.each(sorted_files, function(i, item) {
            $selected_items.append(wrapperSelectedItem(item));
        });
    },
    getDataList:function(){
        var groups=$('#form2 .selected-items .list-group-item');
        var items=[];
        if(groups.length >=1){
            $.each(groups,function(index,item){
                items.push($(item).attr('data-id')+$(item).attr('data-type'));
            });
        }
        return items;
    }
});

$('#form2 .btn-fs-picker').off('click').on('click', function() {
    switch($('#sel-type-edit').val()) {
        case 'file':
            edit_picker.pickFile();
            break;
        case 'folder':
            edit_picker.pickFolder();
            break;
        case 'package':
        default:
            edit_picker.pickMulti();
            break;
    }
});

function setMenuResource(data){
    if(data == null){
        return false;
    }
    if(data.files.length >= 1){
        data.files.sort(utils.sort('path asc'));
    }
    if(data.folders.length >= 1){
        data.folders.sort(utils.sort('path asc'));
    }
    var html='';
    $.each(data.folders,function(index,item){
        item.type='folder';
        html += wrapperSelectedItem(item);
    });
    $.each(data.files,function(index,item){
        item.type='file';
        if(item.path){
            item.path = item.path + item.name;
        }else{
            item.path = item.name;
        }
        html += wrapperSelectedItem(item);
    });
    $('.selected-items').html(html);
}
/**
 * 更新资源事件.
 */
function uploadResource(modal){
    // 获取数据.
    var data = getParam(modal);
    if(!data){
        return;
    }
    $.ajax({
        'url':utils.mergeUrl(App.baseUrl,'/api/asset'),
        'type':'POST',
        'data':JSON.stringify(data),
        'dataType':'json',
        'headers':{
            "Content-Type": "application/json",
            "X-HTTP-Method-Override": "PUT"
        },
        'beforeSend':function(){

        },
        'success':function(data){
            if(data.error == 0){
                notifySuccess(data.desc);
                $('#fs-picker-modal-edit').modal('hide');
                getList();
            }else{
                notifyDanger(data.desc);
            }
        }
    });
}
/**
 * 获取正确的文件信息.
 * @param items
 * @returns {{files: Array, folders: Array}}
 */
function getContent(items){
    var content = {
        files: [],
        folders: []
    };
    $.each(items,function(index,item){
        var data_id = $(item).attr('data-id');
        var type = $(item).attr('data-type');
        if(type == 'file'){
            content.files.push(data_id);
        }
        if(type == 'folder'){
            content.folders.push(data_id);
        }
    });
    return JSON.stringify(content);
}
/**
 * 获取修改文件的数据.
 * @param modal
 */
function getParam(modal){
    var type=modal.find('#sel-type-edit').val();
    var name=modal.find('#txt-name-edit').val();
    var expires=modal.find('#txt-expires-edit').val();
    var expires_area=modal.find('#sel-expires-edit').val();
    var count_limit=modal.find('#txt-count-edit').val();
    var count_type=modal.find('#sel-count-edit').val() == 'times';
    if(count_type){
        count_limit = parseInt(count_limit);
    }else{
        count_limit = -1;
    }
    var code=modal.find('#txt-code-edit').val();
    var download=0;
    if(modal.find('#chk-download-edit').is(':checked')){
        download=1;
    }

    var items = modal.find('.list-group-item');
    if(items.length <=0){
        notifyDanger('请至少选择一个文件或文件夹!');
        return false;
    }
    if($.inArray(type,['file','folder','package']) < 0){
        notifyDanger('请选择正确的文件类型.');
        return false;
    }
    if(!name){
        notifyDanger('请输入文件夹名字!');
        return false;
    }
    var content = getContent(items);
    // 这里是主键ID
    var id = modal.find('.modal-body').attr('data-id');
    // 开始归档.
    var data={
        '_method':'put',
        'type':type,
        'content':content,
        'name':name,
        'expires':expires,
        'expire_unit':expires_area,
        'count':count_limit,
        'code':code,
        'download':download,
        'id':id
    };
    return data;
}
// asset/__call__.js

   });
});