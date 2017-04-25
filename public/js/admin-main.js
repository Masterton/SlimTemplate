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
            // metisMenu
            'metisMenu': 'lib/metisMenu/metisMenu' + App.min,
            // JavaScript-MD5
            'md5': 'lib/JavaScript-MD5/md5' + App.min,
            // bootstrap-select
            'bootstrap-select': 'lib/bootstrap-select/js/bootstrap-select' + App.min,
            // bootstrap-select-zh_CN
            'bootstrap-select-zh_CN': 'lib/bootstrap-select/js/i18n/defaults-zh_CN' + App.min,
            // jquery-ui
            'jquery-ui': 'lib/jquery-ui/jquery-ui-1.12.1' + App.min,

            // 工具
            'utils': 'js/utils',

            // 对话框
            'dialog': 'js/dialog',
            // 首页
            'index': 'assets/admin/js/index',
            // 用户列表
            'user-list': 'assets/admin/js/user-list',
            // 角色列表
            'role-list': 'assets/admin/js/role-list',
            // 权限分配
            'permission-assign': 'assets/admin/js/permission-assign',
            // 应用列表
            'app-list': 'assets/admin/js/app-list'
        },
        shim: {
            'bootstrap': {
                // 模块依赖
                deps: ['jquery'],
                // 输出模块内容
                exports: 'jQuery.fn.popover'
            },
            'bootstrap-select-zh_CN': {
                deps: ['jquery', 'bootstrap-select'],
                // 输出模块内容
                exports: 'jQuery.fn.selectpicker'
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
        ['/admin/?', ['index']],
        ['/admin/user[\-_]list/?', ['user-list']],
        ['/admin/role[\-_]list/?', ['role-list']],
        ['/admin/permission[\-_]assign/?', ['permission-assign']],
        ['/admin/app[\-_]list/?', ['app-list']]
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