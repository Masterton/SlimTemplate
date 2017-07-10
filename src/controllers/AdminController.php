<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * AdminController 管理员管理
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 0.0.1
 * @since 1.0
 * @time 2017-6-17 23:46:05
 */
class AdminController extends ControllerBase
{
    //-------------------------------------------------------------------------------------------
    // 前后台不分离
    /**
     * 添加用户 /admin/admin post
     * @param $.. 其他参数
     *
     */
    public function addAdmin(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 修改用户资料 /admin/admin put
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function modifyAdmin(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 删除用户 /admin/admin delete
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function deleteAdmin(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 查看用户资料（列表） /admin/admin get
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function queryAdmin(Request $request, Response $response, $args=[])
    {
        $result = [
            'title' => '管理员列表',
        ];
        return $this->container->get('twig')->render($response, 'admin/pages/admin.twig', $result);
    }

    /**
     * 添加管理员页面 /admin/add_admin get
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function addAdminIndex(Request $request, Response $response, $args=[])
    {
        $result = [
            'title' => '添加管理员',
        ];
        return $this->container->get('twig')->render($response, 'admin/pages/add-admin.twig', $result);
    }







    //-------------------------------------------------------------------------------------------
    // 前后台分离（api接口）
    /**
     * 添加用户 /api/admin post
     * @param $Admin 用户名
     * @param $password 密码
     * @param $.. 其他参数
     *
     */
    public function addAdminAPI(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 修改用户资料 /api/admin put
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function modifyAdminAPI(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 删除用户 /api/admin delete
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function deleteAdminAPI(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 查看用户资料（列表） /api/admin get
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function queryAdminAPI(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 密码md5加密
     * @param string $password 密码
     * @param string $encryString 字符串
     */
    public static function passwordMD5($password, $encryString)
    {
        $md5PassOne = md5($password);
        $md5PassOne = $md5PassOne . $encryString;
        $md5PassTwo = md5($md5PassOne);
        return $md5PassTwo;
    }
}