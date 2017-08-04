<?php

return [
    // 主页
    '' => [
        'get'    => [
            'handler' => 'App\Controllers\HomeController:index',
            'name'    => 'home_index',
            'auth'    => false,
            'op_class' => '前台接口',
            'op_name' => '主页',
        ],
    ],
    // 文章页
    'article[/]' => [
        'get'    => [
            'handler' => 'App\Controllers\HomeArticleController:index',
            'name'    => 'home_article',
            'auth'    => true,
            'op_class' => '前台接口',
            'op_name' => '文章详情页',
        ],
    ],
    // 前台登录
    'login[/]' => [
        'get'    => [
            'handler' => 'App\Controllers\HomeController:Authorization',
            'name'    => 'home_login',
            'auth'    => true,
            'op_class' => '前台接口',
            'op_name' => '授权登录页',
        ],
    ],

    // 第三方登录
    // 微博授权
    'login/weibo[/]' => [
        'get'    => [
            'handler' => 'App\Controllers\ThirdPartyController:weiboAuthor',
            'name'    => 'home_login_weibo',
            'auth'    => true,
            'op_class' => '第三方登录',
            'op_name' => '微博授权',
        ],
    ],
    // 微信授权
    'login/wechat' => [
        'get'    => [
            'handler' => 'App\Controllers\ThirdPartyController:wechartAuthor',
            'name'    => 'home_login_wechat',
            'auth'    => true,
            'op_class' => '第三方登录',
            'op_name' => '微信授权',
        ],
    ],
    // QQ授权
    'login/wechat' => [
        'get'    => [
            'handler' => 'App\Controllers\ThirdPartyController:qqAuthor',
            'name'    => 'home_login_qq',
            'auth'    => true,
            'op_class' => '第三方登录',
            'op_name' => 'QQ授权',
        ],
    ],
];