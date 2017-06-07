<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * Download 文件下载
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @since 1.0
 * @time 2017-6-7 13:51:47
 */
class HomeController extends ControllerBase
{

    /**
     * 主页显示
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function index(Request $request, Response $response, $args=[])
    {
        $aa = $request->getParams();
        $params = [
            'title' => '我是一个测试',
            'user' => [
                [
                    'name' => 'master',
                    'sex' => 'male',
                    'qq' => '111111',
                    'phone' => '18833333333',
                ],
                [
                    'name' => 'tom',
                    'sex' => 'female',
                    'qq' => '222222',
                    'phone' => '18866666666',
                ],
                [
                    'name' => 'jeck',
                    'sex' => 'male',
                    'qq' => '333333',
                    'phone' => '18877777777',
                ],
                [
                    'name' => 'zues',
                    'sex' => 'male',
                    'qq' => '444444',
                    'phone' => '18888888888',
                ],
            ],
            'base_path' => $this->ci->get('settings')->get('base_path'),
        ];

        $paramss = [
            'title' => '我是一个测试',
            'user' => [
                [
                    'name' => 'master',
                    'sex' => 'male',
                    'qq' => '555555',
                    'phone' => '18833333333',
                ],
                [
                    'name' => 'tom',
                    'sex' => 'female',
                    'qq' => '666666',
                    'phone' => '18866666666',
                ],
                [
                    'name' => 'jeck',
                    'sex' => 'male',
                    'qq' => '777777',
                    'phone' => '18877777777',
                ],
                [
                    'name' => 'zues',
                    'sex' => 'male',
                    'qq' => '888888',
                    'phone' => '18888888888',
                ],
            ],
            'base_path' => $this->ci->get('settings')->get('base_path'),
        ];
        if (!empty($aa['page']) && $aa['page'] == 2) {
            $result = $params;
        } else {
            $result = $paramss;
        }
        /*print_r("<pre>");
        print_r($this->ci);
        exit;*/
        //return $response->withJson($params);
        return $this->ci->get('twig')->render($response, 'home/pages/home.twig', $result);
    }
}