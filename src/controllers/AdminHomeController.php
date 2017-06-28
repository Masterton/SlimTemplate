<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * AdminHomeController 后台主页
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 0.0.1
 * @since 1.0
 * @time 2017-6-17 23:46:05
 */
class AdminHomeController extends ControllerBase
{
    //-------------------------------------------------------------------------------------------
    // 前后台不分离
    /**
     * 主页显示 /admin/home get
     * @param $.. 其他参数
     *
     */
    public function index(Request $request, Response $response, $args=[])
    {
        $result = [
            'title' => '后台主页',
        ];
        return $this->container->get('twig')->render($response, 'admin/pages/index.twig', $result);
        // 判断是否登录
        /*if (empty($_SESSION['user_info'])) {
            print_r($_SESSION['user_info']);
            exit;
            return $response->withRedirect('/admin/login')->withStatus(301);
        } else {
            $result = [
                'title' => '后台主页',
                'user_info' => $_SESSION['user_info']
            ];
            return $this->container->get('twig')->render($response, 'admin/pages/index.twig', $result);
        }*/
    }
}