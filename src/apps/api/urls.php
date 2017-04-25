<?php

return [
    '/ping[/]' => [
        'map' => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $response->getBody()->write("45465465");
                return $response;
            },
            'name' => 'api_ping',
            'methods' => ['GET', 'POST'],
            'auth' => false
        ],
    ],
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
];