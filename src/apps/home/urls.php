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
];