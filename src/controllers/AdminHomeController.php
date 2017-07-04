<?php

namespace App\Controllers;

use \App\Models\Access;
use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * AdminHomeController 后台主页 Traffic statistics
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

            // 网站是访问量统计
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

            // 获取季度访问量
            if ($month >=1 && $month <= 3) {
                $access_quarter = Access::where('year', $year)->whereIn('month', [1, 2, 3])->count();
            } else if ($month >=4 && $month <= 6) {
                $access_quarter = Access::where('year', $year)->whereIn('month', [4, 5, 6])->count();
            } else if ($month >=7 && $month <= 9) {
                $access_quarter = Access::where('year', $year)->whereIn('month', [7, 8, 9])->count();
            } else {
                $access_quarter = Access::where('year', $year)->whereIn('month', [10, 11, 12])->count();
            }

            // 最近14天访问量
            $this_week = 0; // 这一周的访问量
            $last_week = 0; // 上一周的访问量
            $weekArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            for ($i = 0; $i < 14; $i++) { 
                $date = date("Y-m-d",strtotime("-".$i." day"));
                $week = date("w", strtotime($date));
                $date = explode('-', $date);
                $query_date = [
                    ['year', '=', $date[0]],
                    ['month', '=', str_replace("0","", $date[1])],
                    ['day', '=', str_replace("0","", $date[2])],
                ];
                $access_lately[$i]['week'] = $weekArr[$week];
                $access_lately[$i]['total'] = Access::where($query_date)->count();
                if ($i < 7 ) {
                    $this_week += $access_lately[$i]['total'];
                } else {
                    $last_week += $access_lately[$i]['total'];
                }
            }

            // 访问量同期百分比
            // 日访问比
            $this_day = $access_lately[0]['total'];
            $last_day = $access_lately[1]['total'];
            if ($last_day == 0) {
                $day_percentage = 0;
            } else {
                $day_percentage = round(($this_day - $last_day)/$last_day*100, 2);
            }
            $day_percentage = round(($this_day - $last_day)/$last_day*100, 2);
            $access_contrast_day['total'] = number_format($access_lately[0]['total']);
            if ($day_percentage >= 0) {
                $access_contrast_day['type'] = 'up';
                $access_contrast_day['percentage'] = $day_percentage . '%';
            } else {
                $access_contrast_day['type'] = 'down';
                $access_contrast_day['percentage'] = str_replace("-", "", $day_percentage) . '%';
            }

            //周访问比
            if ($last_week == 0) {
                $week_percentage = 0;
            } else {
                $week_percentage = round(($this_week - $last_week)/$last_week*100, 2);
            }
            $access_contrast_week['total'] = number_format($this_week);
            if ($week_percentage >= 0) {
                $access_contrast_week['type'] = 'up';
                $access_contrast_week['percentage'] = $week_percentage . '%';
            } else {
                $access_contrast_week['type'] = 'down';
                $access_contrast_week['percentage'] = str_replace("-", "", $week_percentage) . '%';
            }

            //月访问比
            $this_month_query = [
                ['year', '=', $year],
                ['month', '=', $month],
            ];
            if ($month == 1) {
                $last_month_query = [
                    ['year', '=', $year-1],
                    ['month', '=', 12],
                ];
            } else {
                $last_month_query = [
                    ['year', '=', $year],
                    ['month', '=', $month-1],
                ];
            }
            $this_month = Access::where($this_month_query)->count();
            $last_month = Access::where($last_month_query)->count();
            if ($last_month == 0) {
                $month_percentage = 0;
            } else {
                $month_percentage = round(($this_month - $last_month)/$last_month*100, 2);
            }
            $access_contrast_month['total'] = number_format($this_month);
            if ($month_percentage >= 0) {
                $access_contrast_month['type'] = 'up';
                $access_contrast_month['percentage'] = $month_percentage . '%';
            } else {
                $access_contrast_month['type'] = 'down';
                $access_contrast_month['percentage'] = str_replace("-", "", $month_percentage) . '%';
            }

            $result = [
                'title' => '后台主页',
                'user_info' => $_SESSION['user_info'],
                'access' => [
                    'access_total' => number_format($access_total), // 总访问量
                    'access_year' => number_format($access_year), // 年访问量
                    'access_quarter' => number_format($access_quarter), // 年访问量
                    'access_month' => number_format($access_month), // 月访问量
                    'access_day' => number_format($access_day), // 日访问量
                    'access_lately' => $access_lately, // 最近两周访问量
                    'access_contrast_day' => $access_contrast_day, // 日访问量对比
                    'access_contrast_week' => $access_contrast_week, // 周访问量对比
                    'access_contrast_month' => $access_contrast_month, // 月访问量对比
                ],
            ];
            return $this->container->get('twig')->render($response, 'admin/pages/index.twig', $result);
        }
    }
}