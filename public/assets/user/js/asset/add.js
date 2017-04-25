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

