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