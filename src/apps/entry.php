<?php

return [
    //api 接口
    'api' => [
        'prefix' => '/api',
        'urls' => require __DIR__ . '/api/urls.php'
    ],
    // 视图接口
    'view' => [
        'prefix' => '/view',
        'urls' => require __DIR__ . '/view/urls.php'
    ],
    // 主页接口
    'home' => [
        'prefix' => '/',
        'urls' => require __DIR__ . '/home/urls.php'
    ],
    // 数据库迁移接口
    'db' => [
        'prefix' => '/db',
        'urls' => require __DIR__ . '/db/urls.php'
    ],
    // 后台接口
    'admin' => [
        'prefix' => '/admin',
        'urls' => require __DIR__ . '/admin/urls.php'
    ],
    /*'db' => [
        'prefix' => '/db',
        'urls' => [
            '/up[/[{table:\w+}[/]]]' => [
                'get' => [
                    'handler' => '\App\Tests\Dev\DBMigration:up',
                    'name' => 'db_up',
                    'auth' => true
                ]
            ],
            '/down[/[{table:\w+}[/]]]' => [
                'get' => [
                    'handler' => '\App\Tests\Dev\DBMigration:down',
                    'name' => 'db_down',
                    'auth' => true
                ]
            ],
        ]
    ],*/
];