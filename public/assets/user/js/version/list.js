/**
 * 获取文件信息
 */
function getFileInfo() {
    return {
        id: parseInt(utils.getUrlParam('file')),
        hash: utils.getUrlParam('hash'),
        name: decodeURI(utils.getUrlParam('name')),
        versions: GLOBAL.FILE_VERSIONS
    };
}

/**
 * 显示文件版本
 */
function showFileVersions(info) {
    var iv = info.versions;
    var $tb = $('#tb-versions');
    var $tbody = $tb.children('tbody');
    $tbody.empty();
    $tb.removeData('data-version-info');
    if(iv && iv.length > 0) {
        $tb.data('data-version-info', info);
        for (var i = 0; i < iv.length; i++) {
            var $tr = wrapperVersionLine(iv[i]);
            $tbody.append($tr);
        }
    }
    else {
        $tbody.append([
            '<tr>',
                '<td colspan="7">',
                    '<span class="text-center>获取数据失败</span>',
                '</td>',
            '</tr>'
        ].join(''));
    }
}

/**
 * 版本信息每一行的html生成
 */
function wrapperVersionLine(version_item) {
    var $tr = $([
        '<tr data-id="', version_item.id, '">',
            '<td data-version="', version_item.number, '">', version_item.number, '</td>',
            '<td>', (!isNaN(version_item.size) ? utils.formatFileSize(version_item.size) : '-'), '</td>',
            '<td>', version_item.md5, '</td>',
            '<td>', version_item.upload_time, '</td>',
            '<td class="col-view">',
                '<a href="javascript:;">查看</a>',
            '</td>',
            '<td class="col-use">',
                '<a href="javascript:;">重用</a>',
            '</td>',
            '<td class="col-delete">',
                '<a href="javascript:;">删除</a>',
            '</td>',
        '</tr>'
    ].join(''));
    return $tr;
}

/**
 * 重新(获取数据)显示版本信息
 */
function reShowVersions(file_id) {
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/version/'),
        type: 'GET',
        dataType: 'json',
        data: {
            file: file_id
        },
        success: function(data) {
            if(data.error == 0) {
                GLOBAL.FILE_VERSIONS = data.data;
                var info = getFileInfo();
                showFileVersions(info);
            }
            else {
                notifyDanger(data.desc);
            }
        },
        error: function(data) {
            notifyDanger(data.desc);
        }
    });
}