/**
 * Created by whs on 17-4-7.
 */

(function(){
    $('#select').off('click').on('click',function(){
        var demo = $('#fs-picker-modal-move').find('#demo');
        // 所有的文件树.
        show_tree(demo);
        var modal  = $('#fs-picker-modal-move');
        modal.modal('show');
        modal.find('.kz-btn-submit').off('click').on('click',function(){
            if($('input[name=file_id]').val()){
                // 这里获得数据.组装到表格中,并显示下面表单
                $('.main-transform').show();
                // 重新获得填写的叙述  是否需要保存?
                modal.modal('hide');
            }else{
                modal.modal('hide');
            }
        });

        modal.find('.kz-btn-default').off('click').on('click',function(){
            $('.main-transform').hide();
            $('.file-info').removeAttr('data-id');
            $('.file-info').html('');
        });
    });
})();

$('#fs-picker-modal-move').off('show.bs.modal').on('show.bs.modal', function (event) {});

layui.config({
    dir: utils.mergeUrl(GLOBAL.SITE_BASE_URL, '/lib/layui/') //layui.js 所在路径
});

/**
 * 初始化上传插件.
 */
initUploadPanel();
/**
 * 提交表单.
 */
do_sumbit();

get_list();

bindEvent();

init_water();

get_progress();