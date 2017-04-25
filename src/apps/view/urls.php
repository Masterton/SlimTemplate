<?php

return [
    '/test[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'test.twig', $params);
            },
            'name'    => 'api_get_node',
            'auth'    => true,
            'op_class' => '节点',
            'op_name' => '查询',
        ],
    ],
    '/400[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/400.twig', $params);
            },
            'name'    => 'api_get_node',
            'auth'    => true,
            'op_class' => '节点',
            'op_name' => '查询',
        ],
    ],
    '/403[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/403.twig', $params);
            },
            'name'    => 'api_get_node',
            'auth'    => true,
            'op_class' => '节点',
            'op_name' => '查询',
        ],
    ],
    '/404[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/404.twig', $params);
            },
            'name'    => 'api_get_node',
            'auth'    => true,
            'op_class' => '节点',
            'op_name' => '查询',
        ],
    ],
    '/500[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [];
                return $this->twig->render($response, 'error/500.twig', $params);
            },
            'name'    => 'api_get_node',
            'auth'    => true,
            'op_class' => '节点',
            'op_name' => '查询',
        ],
    ],

];