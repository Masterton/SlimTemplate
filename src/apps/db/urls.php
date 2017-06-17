<?php
return [
    '/up[/[{table:\w+}[/]]]' => [
        'get' => [
            'handler' => 'App\Controllers\DBMigrationController:up',
            'name' => 'db_up',
            'auth' => false,
            'op_class' => '数据库迁移',
            'op_name' => '新建数据表',
        ]
    ],
    '/down[/[{table:\w+}[/]]]' => [
        'get' => [
            'handler' => 'App\Controllers\DBMigrationController:down',
            'name' => 'db_down',
            'auth' => false,
            'op_class' => '数据库迁移',
            'op_name' => '删除数据表',
        ]
    ],
];