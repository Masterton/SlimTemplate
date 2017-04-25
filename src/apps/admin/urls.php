<?php
return [
    '/aaa[/]' => [
        'map' => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $response->getBody()->write("pong");
                return $response;
            },
            'name' => 'api_ping',
            'methods' => ['GET', 'POST'],
            'auth' => false
        ],
    ],
    '[/]' => [
        'get' => [
            'handler' => 'App\Views\AdminView:index',
            'name' => 'admin_index',
            'auth' => true,
            'op_name' => '访问"管理后台-统计概况"'
        ],
    ],
];