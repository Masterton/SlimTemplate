/**
 * 绑定操作
 */
function bindOperation() {
    var $tb = $('#tb-versions');
    var $tbody = $tb.children('tbody');
    var info = $tb.data('data-version-info');
    $tbody.off('click').on('click', 'tr > td > a[href="javascript:;"]', function(event) {
        var $td = $(this).parent();
        var $tr = utils.latestParent($td, 'tr');
        var version_number = parseInt($tr.find('td[data-version]').attr('data-version'));
        var version_id = parseInt($tr.attr('data-id'));
        if($td.hasClass('col-view')) {
            viewVersion(info.hash, version_number);
        }
        else if($td.hasClass('col-use')) {
            useVersion(info.id, version_id);
        }
        else if($td.hasClass('col-delete')) {
            deleteVersion(info.id, version_id);
        }
    });
}

/**
 * 查看某个版本的文件
 */
function viewVersion(file_hash, version_number) {
    if ($('#redirect-from').length < 1) {
        $(document.body).append([
            '<div style="display: none;">',
                '<form id="redirect-from" target="_blank" method="GET" action="', GLOBAL.FILE_VIEW_URL, '">',
                    '<input type="hidden" name="file" value="', file_hash, '" />',
                    '<input type="hidden" name="version" value="', version_number, '" />',
                '</form>',
            '</div>'
        ].join(''));
    } else {
        $('#redirect-from').attr('action', GLOBAL.FILE_VIEW_URL);
        $('#redirect-from').find('input[name="file"]').val(file_hash);
        $('#redirect-from').find('input[name="version"]').val(version_number);
    }
    setTimeout(function() {
        $('#redirect-from').submit();
    }, 50);
}

/**
 * 使用某个版本作为文件的最新版本
 */
function useVersion(file_id, version_id) {
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/version/'),
        type: 'POST',
        dataType: 'json',
        data: {
            file: file_id,
            version: version_id
        },
        success: function(data) {
            if(data.error == 0) {
                notifySuccess(data.desc);
                reShowVersions(file_id);
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

/**
 * 删除文件的某个版本
 */
function deleteVersion(file_id, version_id) {
    $.ajax({
        url: utils.mergeUrl(App.baseUrl, '/api/fs/version/'),
        type: 'DELETE',
        dataType: 'json',
        data: {
            file: file_id,
            version: version_id
        },
        success: function(data) {
            if(data.error == 0) {
                notifySuccess(data.desc);
                reShowVersions(file_id);
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