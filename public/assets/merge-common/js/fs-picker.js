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