<?php

namespace App\Controllers;

use \App\Models\Access;
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
        /*return $this->container->get('twig')->render($response, 'admin/pages/index.twig', $result);*/
        // 判断是否登录
        if (empty($_SESSION['user_info'])) {
            return $response->withRedirect('/admin/login')->withStatus(301);
        } else {
            $year = date("Y");
            $month = date("m");
            $day = date("d");
            $query = [
                ['id', '>', 0]
            ];
            $access_total = Access::where($query)->count();
            array_push($query, ['year', '=', $year]);
            $access_year = Access::where($query)->count();
            array_push($query, ['month', '=', $month]);
            $access_month = Access::where($query)->count();
            array_push($query, ['day', '=', $day]);
            $access_day = Access::where($query)->count();
            $result = [
                'title' => '后台主页',
                'user_info' => $_SESSION['user_info'],
                'access' => [
                    'access_total' => $access_total, // 总访问量
                    'access_year' => $access_year, // 年访问量
                    'access_month' => $access_month, // 月访问量
                    'access_day' => $access_day, // 日访问量
                ],
            ];
            return $this->container->get('twig')->render($response, 'admin/pages/index.twig', $result);
        }
    }
}