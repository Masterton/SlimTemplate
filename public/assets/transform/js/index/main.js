/**
 * Created by whs on 17-4-24.
 */



(function(){
    $.ajax({
        'type':'get',
        'url':utils.mergeUrl(App.baseUrl,'/api/video/progress'),
        'data':{'status':2},
        'success':function(data){
            data = data.data;
            if(data.length == 0){
                $('tbody').html(
                    [
                        '<tr><td colspan="7" style="text-align: center;">暂无数据</td></tr>'
                    ].join('')
                );
            }else{
                var html = '';
                $.each(data,function(index,item){
                    var tr = [
                        '<td>',item.id,'</td>',
                        '<td>',item.file_name,'</td>',
                        '<td>',item.file_type,'</td>',
                        '<td>',item.create_at,'</td>',
                        '<td>',item.hash+'.'+item.file_type,'</td>',
                        '<td class="check" data-hash="'+item.hash+'">' +
                        '   <a href="javascript:;">查看</a>' +
                        '</td>',
                        '<td class="download" data-hash="'+item.hash+'">' +
                        '   <a href="javascript:;">下载</a>' +
                        '</td>',
                    ].join('');
                    html += tr;
                });
                html = '<tr>'+ html + '</tr>';
                $('tbody').html(html);
                $('tbody').find('.check').off('click').on('click',function(){
                    location.href=utils.mergeUrl(App.baseUrl,'/file/transform')+'/?file='+$(this).attr('data-hash');
                });
                $('tbody').find('.download').off('click').on('click',function(){
                    location.href=utils.mergeUrl(App.baseUrl,'/file/transform')+'/?file='+$(this).attr('data-hash')+'&download=1';
                })
            }
        }
    });


    $('.btn-success').off('click').on('click',function(){
        location.href = utils.mergeUrl(App.baseUrl,'/transform/add');
    });
})();
