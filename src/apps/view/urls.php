<?php

return [
    '/test[/]' => [
        'get'    => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $params = [
                    'name' => 'i am home.',
                    'data' => [
                        [
                            'aa' => 11,
                            'bb' => 22,
                        ],
                        [
                            'aa' => 33,
                            'bb' => 44,
                        ],
                    ],
                ];
                return $this->view->render($response, 'test.twig', $params);
            },
            'name'    => 'api_get_node',
            'auth'    => true,
            'op_class' => '节点',
            'op_name' => '查询',
        ],
    ],
];