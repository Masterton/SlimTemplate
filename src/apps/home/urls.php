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
    // 主页
    'login[/]' => [
        'get'    => [
            'handler' => 'App\Controllers\HomeController:login',
            'name'    => 'home_login',
            'auth'    => true,
            'op_class' => '前台接口',
            'op_name' => '登录',
        ],
    ],
];