<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * AccessController 网站访问统计
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @since 1.0
 * @time 2017-6-28 21:10:09
 *
 */

/**
 * class AccessController
 */
class AccessController extends ControllerBase
{

    /**
     * 访问统计页面展示
     * @param $.. 参数
     * @return $result 结果
     *
     */
    public function index(Request $request, Response $response, $args=[])
    {
        $result = [
            'title' => '流量统计',
        ];
        return $this->container->get('twig')->render($response, 'admin/pages/index.twig', $result);
    }
}