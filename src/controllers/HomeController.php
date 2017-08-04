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
        $params = [
            'title' => 'Ping Blog'
        ];
        $url = $request->getUri()->getHost() . $request->getUri()->getPath();
        AccessController::access($url);
        return $this->container->get('twig')->render($response, 'home/pages/index.twig', $params);
    }

    /**
     * 授权登录页面
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function Authorization(Request $request, Response $response, $args=[])
    {
        $params = [
            'title' => '授权登录页面'
        ];
        $url = $request->getUri()->getHost() . $request->getUri()->getPath();
        AccessController::access($url);
        return $this->container->get('twig')->render($response, 'home/pages/login.twig', $params);
    }
}