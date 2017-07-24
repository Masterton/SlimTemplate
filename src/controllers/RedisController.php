<?php
/**
 * RedisController
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @since 1.0
 * @date 2017-7-20
 * @time 09:15:09
 *
 */

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

class RedisController extends ControllerBase
{

    /**
     * 获取菜单列表
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function registerRedis(Request $request, Response $response, $args=[])
    {
        $count = 100;
        $redis = new \Redis();
        $redis->connect('localhost', 6379);
        if ($redis->llen('ucode') < $count) {
            $redis->lpush('ucode', time());
            print_r($redis->llen('ucode'));
        } else {
            print_r("商品已被抢完");
            print_r($redis->llen('ucode'));
            print_r("<pre>");
            print_r($redis->lrange('ucode'));
        }
    }
}