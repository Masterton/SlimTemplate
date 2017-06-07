<?php

return [
    '/test[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'test.twig', $params);
            },
            'name'    => 'view_test',
            'auth'    => false,
            'op_class' => '视图接口',
            'op_name' => '视图测试',
        ],
    ],

    // 上传页面
    '/upload[/]' => [
        'get'    => [
            'handler' => 'App\Controllers\TestController:test_node_method',
            'name'    => 'view_upload',
            'auth'    => false,
            'op_class' => '上传接口',
            'op_name' => '文件上传界面',
        ],
    ],

    // 错误页面
    '/400[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/400.twig', $params);
            },
            'name'    => 'view_400',
            'auth'    => false,
            'op_class' => '视图接口',
            'op_name' => '400错误',
        ],
    ],
    '/403[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/403.twig', $params);
            },
            'name'    => 'view_403',
            'auth'    => false,
            'op_class' => '视图接口',
            'op_name' => '403错误',
        ],
    ],
    '/404[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/404.twig', $params);
            },
            'name'    => 'view_404',
            'auth'    => false,
            'op_class' => '视图接口',
            'op_name' => '404错误',
        ],
    ],
    '/500[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/500.twig', $params);
            },
            'name'    => 'view_500',
            'auth'    => false,
            'op_class' => '视图接口',
            'op_name' => '500错误',
        ],
    ],
];