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
