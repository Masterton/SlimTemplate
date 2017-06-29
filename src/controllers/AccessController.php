<?php

namespace App\Controllers;

use \App\Models\Access;
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
     * 新增访问记录
     * @param $url 访问的页面地址
     * @param $ip 访问的ip地址
     * @return boolean
     *
     */
    public static function access($url, $ip=null)
    {
        $access = new Access;
        $access->url = $url;
        $access->year = date("Y");
        $access->month = date("m");
        $access->day = date("d");
        $access->hour = date("H");
        $access->minute = date("i");
        $access->second = date("s");
        list($usec, $sec) = explode(" ", microtime());
        $access->time = $sec;
        $access->microtime = $usec;
        $access->accurate_time = $usec + $sec;
        if ($ip != null) {
            $access->ip = $ip;
        }
        if ($access->save()) {
            return true;
        } else {
            return false;
        }
    }
}