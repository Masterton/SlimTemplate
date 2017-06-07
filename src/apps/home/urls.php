<?php

return [
    // 主页
    '[/]' => [
        'get'    => [
            'handler' => 'App\Controllers\HomeController:index',
            'name'    => 'home_index',
            'auth'    => false,
            'op_class' => '前台接口',
            'op_name' => '主页',
        ],
    ],
];