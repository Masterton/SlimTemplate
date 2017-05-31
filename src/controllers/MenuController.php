<?php

namespace App\Controllers;

/**
 * MenuController
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @since 1.0
 *
 */
class MenuController extends ControllerBase
{

    /**
     * 获取菜单列表
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function query_menu(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[])
    {
        echo "11111122222";
    }

    /**
     * 添加菜单项
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function add_menu(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[])
    {

    }

    /**
     * 修改菜单项
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function modify_menu(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[])
    {
   
    }

    /**
     * 删除菜单项
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function delete_menu(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[])
    {

    }
}