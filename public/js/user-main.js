/**
 * requirejs配置
 * @type {String}
 */
define(function() {
    'use strict';
    // 是否开启debug模式
    window.App = {
        debug: false,
        baseUrl: GLOBAL.SITE_BASE_URL + '/',
        min: '.min',
        /**
         * 路由匹配
         * @param {[type]}
         * @param {[type]}
         */
        routeMatch: function(path) {
            /* ===============================
             * 网站路径(路由获取)
             * Copyright 2016 kz, Inc.
             * =============================== */
            var route = window.location.pathname;
            var baseUrl = App.baseUrl.replace(/\/+$/, '');
            path = path.replace(/^\/+/, '');
            var url = baseUrl + '/' + path;
            url = url.replace(/\/\//g, '');
            url = url.replace(/\/\//g, '/');
            return new RegExp('^' + url + '$', 'i').test(route);
        },
        /**
         * 合并路径
         */
        mergePath: function(path) {
            var baseUrl = App.baseUrl.replace(/\/+$/, '');
            path = path.toString().replace(/^\/+/, '');
            var url = baseUrl + '/' + path;
            return url.replace(/\/\//g, '').replace(/\/\//g, '');
        }
    };
    require.config({
        baseUrl: App.baseUrl,
        paths: {
            /* ===============================
             * 项目公用库类文件
             * Copyright 2016 kz, Inc.
             * =============================== */
            // jQuery
            'jquery': 'lib/jquery/jquery-1.12.4' + App.min,
            // bootstrap
            'bootstrap': 'lib/bootstrap/js/bootstrap' + App.min,
            // bootstrap-notify
            'bootstrap-notify': 'lib/bootstrap-notify/bootstrap-notify' + App.min,
            // jquery.mousewheel
            'mousewheel': 'lib/jquery-mousewheel/jquery.mousewheel' + App.min,
            // malihu-custom-scrollbar-plugin
            'scrollbar': 'lib/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar' + App.min,
            // bootstrap-treeviw
            'treeview': 'lib/bootstrap-treeview/bootstrap-treeview' + App.min,

            // jquery.ui.position
            'jquery-ui-position': 'lib/jquery.contextMenu/jquery.ui.position' + App.min,

            // jquery.contextMenu
            'contextmenu': 'lib/jquery.contextMenu/jquery.contextMenu' + App.min,

            // jquery-ui/ui/widget
            'jquery-ui/ui/widget': 'lib/jquery-file-upload/js/vendor/jquery.ui.widget',

            // jquery.fileupload
            'jquery-fileupload': 'lib/jquery-file-upload/js/jquery.fileupload',

            // JavaScript-MD5
            'md5': 'lib/JavaScript-MD5/md5' + App.min,

            // store.js
            'store': 'lib/storejs/dist/store.legacy' + App.min,

            // layui
            'layui': 'lib/layui/layui',

            // 工具
            'utils': 'js/utils',

            // 对话框
            'dialog': 'js/dialog',

            // 布局
            'layout': 'assets/user/js/layout',
            // 首页
            'index': 'assets/user/js/index',
            // 开放资源
            'asset': 'assets/user/js/asset',
            // 开放资源
            'version': 'assets/user/js/version'
        },
        shim: {
            'bootstrap': {
                // 模块依赖
                deps: ['jquery'],
                // 输出模块内容
                exports: 'jQuery.fn.popover'
            },
            'layui': {
                // 模块依赖
                deps: ['jquery'],
                // 输出模块内容
                exports: 'layui'
            }
        },
        // 强制使用define函数来加载模块
        enforceDefine: true,
        // 设置请求超时
        // 为0时,关闭超时功能
        // 防止加载失败
        waitSeconds: 0,
        // 控制缓存
        urlArgs: App.debug ? 'debug=' + Math.random() : ''
    });

    var includes = [
        ['/user/?', ['layout', 'index']],
        ['/user/asset/?', ['layout', 'asset']],
        ['/user/version/?', ['layout', 'version']]
    ];
    // 全局调用 jquery, bootstrap
    require(['jquery', 'bootstrap'], function($) {
        $.ajaxSetup({
            cache: false
        });

        for (var i = 0; i < includes.length; i++) {
            var item = includes[i];
            if(item && item.length >= 2) {
                if(App.routeMatch(item[0])) {
                    require(item[1], item[2]);
                    break;
                }
            }
            else {
                if(App.debug) {
                    console.log('route config error');
                    break;
                }
            }
        }
    });
});