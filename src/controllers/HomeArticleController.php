<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * HomeArticleController 前台文章管理
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @since 1.0
 * @time 2017-6-28 20:50:40
 */

/**
 * class HomeArticleController
 */
class HomeArticleController extends ControllerBase
{
    /**
     * 文章详情页面
     * @param $.. 参数
     * @return $result 结果
     *
     */
    public function index(Request $request, Response $response, $args=[])
    {
        $params = [];
        return $this->container->get('twig')->render($response, 'home/pages/single.twig', $params);
    }
}