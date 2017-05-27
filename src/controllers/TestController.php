<?php

namespace App\Controllers;


use plugin\Node;
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
        $node = new Node(['driver'=>'Edit'],['work_num'=>'0000000000000025','user_id'=>1,'content'=>null]);
        var_dump($node->prev());exit;
    }
}