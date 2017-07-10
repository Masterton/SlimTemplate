<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * UserController 用户管理（普通）
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 0.0.1
 * @since 1.0
 * @time 2017-6-17 23:46:05
 */
class UserController extends ControllerBase
{
    //-------------------------------------------------------------------------------------------
    // 前后台不分离
    /**
     * 添加用户 /admin/user post
     * @param $user 用户名
     * @param $password 密码
     * @param $.. 其他参数
     *
     */
    public function addUser(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 修改用户资料 /admin/user put
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function modifyUser(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 删除用户 /admin/user delete
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function deleteUser(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 查看用户资料（列表） /admin/user get
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function queryUser(Request $request, Response $response, $args=[])
    {
        $result = [
            'title' => '普通用户列表',
        ];
        return $this->container->get('twig')->render($response, 'admin/pages/user.twig', $result);
    }

    /**
     * 添加用户页面 /admin/add_user get
     * @param $.. 其他参数
     *
     */
    public function addUserIndex(Request $request, Response $response, $args=[])
    {
        $result = [
            'title' => '添加普通用户',
        ];
        return $this->container->get('twig')->render($response, 'admin/pages/add-user.twig', $result);
    }

    /**
     * 查看用户资料（个人） /admin/user/personal get
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function queryUserPersonal(Request $request, Response $response, $args=[])
    {

    }















    //-------------------------------------------------------------------------------------------
    // 前后台分离（api接口）
    /**
     * 添加用户 /api/user post
     * @param $user 用户名
     * @param $password 密码
     * @param $.. 其他参数
     *
     */
    public function addUserAPI(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 修改用户资料 /api/user put
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function modifyUserAPI(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 删除用户 /api/user delete
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function deleteUserAPI(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 查看用户资料（列表） /api/user get
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function queryUserAPI(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 查看用户资料（个人） /api/user/personal get
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function queryUserPersonalAPI(Request $request, Response $response, $args=[])
    {

    }
}