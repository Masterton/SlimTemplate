<?php

return [
    '/test[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'test.twig', $params);
            },
            'name'    => 'view_test',
            'auth'    => true,
            'op_class' => '视图接口',
            'op_name' => '视图测试',
        ],
    ],
    '/400[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/400.twig', $params);
            },
            'name'    => 'view_400',
            'auth'    => true,
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
            'auth'    => true,
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
            'auth'    => true,
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
            'auth'    => true,
            'op_class' => '视图接口',
            'op_name' => '500错误',
        ],
    ],

];