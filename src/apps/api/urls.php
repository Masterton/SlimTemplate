<?php

return [
    '/ping[/]' => [
        'get' => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $response->getBody()->write("45465465");
                return $response;
            },
            'name' => 'api_ping',
            'auth' => false
        ],
    ],
    '/node_method[/]' => [
        'get' => [
            'handler' => 'App\Controllers\TestController:test_node_method',
            'name' => 'api_node_method',
            'auth' => false
        ],
    ],
    '/menu[/]' => [
        'get' => [
            'handler' => "App\Controllers\MenuController:query_menu",
            'name'    => 'api_get_menu',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '查询菜单',
        ],
        'post' => [
            'handler' => "App\Controllers\MenuController:add_menu",
            'name'    => 'api_post_menu',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '添加菜单',
        ],
        'put' => [
            'handler' => "App\Controllers\MenuController:modify_menu",
            'name'    => 'api_put_menu',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改菜单',
        ],
        'delete' => [
            'handler' => "App\Controllers\MenuController:delete_menu",
            'name'    => 'api_delete_menu',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除菜单',
        ],
    ],
];