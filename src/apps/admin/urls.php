<?php
return [
    '/aaa[/]' => [
        'map' => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $response->getBody()->write("pong");
                return $response;
            },
            'name' => 'admin_aaa',
            'methods' => ['GET', 'POST'],
            'auth' => false
        ],
    ],
    '[/]' => [
        'get' => [
            'handler' => 'App\Views\AdminView:index',
            'name' => 'admin_index',
            'auth' => true,
            'op_class' => '后台管理接口',
            'op_name' => '主页',
        ],
    ],
];