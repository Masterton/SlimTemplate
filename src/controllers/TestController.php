<?php

namespace App\Controllers;

/**
* TestController
*/
class TestController extends ControllerBase {

    /**
     * 获取菜单列表
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function test_node_method(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
        echo "11111122222";
    }
}