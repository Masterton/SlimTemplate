define(['jquery', 'bootstrap'], function($) {
    'use strict';
    /**
     * 通用modal弹出框
     * @param content 弹出框中要显示的内容
     * @param title 弹出框的标题
     * @param callback 回调函数
     * @param close_call 无论是否是点击按钮，只要是关闭窗体就调用
     */
    function alert(content, title, callback, close_call) {
        var alertModal = $('#alert-modal');
        alertModal.find('#alert-modal-content').html(content);
        if(title) {
            alertModal.find('.alert-modal-title').html(title);
        }
        alertModal.modal('show');
        alertModal.removeData('btn-ok-click');
        alertModal.find('button[data-action="button-ok-click"]').off('click').on('click', function() {
            alertModal.data('btn-ok-click', true);
        });
        alertModal.off('hidden.bs.modal').on('hidden.bs.modal', function() {
            if(typeof callback == "function" && callback){
                if(alertModal.data('btn-ok-click') || close_call) {
                    // 当点击确认按钮关闭对话框后调用
                    callback();
                }
            }
        });
    };

    /**
     * 通用modal弹出框
     * @param content 弹出框中要显示的内容
     * @param title 弹出框的标题
     * @param okCallback 确定.回调函数
     * @param cancelCallback 取消.回调函数
     * @param close_as_cancel 默认的关闭是否算作是取消
     */
    function confirm(content, title, okCallback, cancelCallback, close_as_cancel) {
        var confirmModal = $('#confirm-modal');
        $('#confirm-modal-content').html(content);
        if(title) {
            confirmModal.find('.modal-title').html(title);
        }
        confirmModal.modal('show');
        confirmModal.removeData('btn-ok-click');
        confirmModal.removeData('btn-cancel-click');
        confirmModal.find('button[data-action="button-ok-click"]').off('click').on('click', function() {
            confirmModal.data('btn-ok-click', true);
        });
        confirmModal.find('button[data-action="button-cancel-click"]').off('click').on('click', function() {
            confirmModal.data('btn-cancel-click', true);
        });
        confirmModal.off('hidden.bs.modal').on('hidden.bs.modal', function() {
            if(typeof okCallback == "function" && okCallback) {
                if(confirmModal.data('btn-ok-click')) {
                    // 当点击确认按钮关闭对话框后调用
                    okCallback();
                }
            }
            if(typeof cancelCallback == "function" && cancelCallback) {
                if(!confirmModal.data('btn-ok-click') && (confirmModal.data('btn-cancel-click') || close_as_cancel)) {
                    // 当点击取消按钮关闭对话框后调用
                    cancelCallback();
                }
            }
        });
    };

    /**
     * 通用modal弹出框
     * @param default_content 弹出框中的文本框中默认显示的内容
     * @param title 弹出框的标题
     * @param okCallback 确定.回调函数
     * @param cancelCallback 取消.回调函数
     * @param close_as_cancel 默认的关闭是否算作是取消
     * @param check_func 数值的合法性检验函数
     */
    function prompt(default_content, title, okCallback, cancelCallback, close_as_cancel, check_func) {
        var promptModal = $('#prompt-modal');
        if(!default_content) {
            default_content = '';
        }
        promptModal.find('input[data-field="input-text"]').val(default_content)
        if(title) {
            promptModal.find('.modal-title').html(title);
        }
        promptModal.modal('show');
        promptModal.removeData('btn-ok-click');
        promptModal.removeData('btn-cancel-click');
        promptModal.find('button[data-action="button-ok-click"]').off('click').click(function() {
            var check_ok = true;
            if(typeof check_func == "function" && check_func){
                var _val = promptModal.find('input[data-field="input-text"]').val();
                check_ok = check_func(_val);
            }
            if(check_ok) {
                promptModal.modal('hide');
                promptModal.data('btn-ok-click', true);
            }
        });
        promptModal.find('button[data-action="button-cancel-click"]').off('click').on('click', function() {
            promptModal.data('btn-cancel-click', true);
        });
        promptModal.off('shown.bs.modal').on('shown.bs.modal', function() {
            promptModal.find('input[data-field="input-text"]').select();
        });
        promptModal.off('hidden.bs.modal').on('hidden.bs.modal', function() {
            if(typeof okCallback == "function" && okCallback){
                if(promptModal.data('btn-ok-click')) {
                    // 当点击确认按钮关闭对话框后调用
                    okCallback(promptModal.find('input[data-field="input-text"]').val());
                }
            }
            if(typeof cancelCallback == "function" && cancelCallback) {
                if(!promptModal.data('btn-ok-click') && (promptModal.data('btn-cancel-click') || close_as_cancel)) {
                    // 当点击取消按钮关闭对话框后调用
                    cancelCallback();
                }
            }
        });
    };

    /**
     * 通用modal弹出框
     * @param how_long 显示多久(当为字符串'hide'时，关闭)
     */
    function loading(how_long) {
        var loadingModal = $('#loading-modal');
        if(how_long == 'hide') {
            loadingModal.modal('hide');
            var _tmo = loadingModal.data('timeout-hander');
            if(_tmo) {
                clearTimeout(_tmo);
                loadingModal.removeData('timeout-hander');
            }
            return;
        }
        loadingModal.modal('show');
        if(!isNaN(Number(how_long))) {
            var timeout_handler = setTimeout(function() {
                $('#loading-modal').modal('hide');

            }, how_long);
            loadingModal.data('timeout-hander', timeout_handler);
        }
    };

    return {
        alert: alert,
        confirm: confirm,
        prompt: prompt,
        loading: loading
    };
});