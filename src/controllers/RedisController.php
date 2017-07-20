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
        $redis = new \Redis();
        $redis->connect('localhost', 6379);
        $redis->set('ucode', 'A1234567890');
        //查看服务是否运行
        echo $redis->get('ucode');
    }
}