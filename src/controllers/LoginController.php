<?php

namespace App\Controllers;

use \App\Models\User;
use \App\Models\Admin;
use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * LoginController 用户登录、登出
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 0.0.1
 * @since 1.0
 * @time 2017-6-17 23:46:05
 */
class LoginController extends ControllerBase
{

    /**
     * 显示后台登录界面 /admin/login get
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function index(Request $request, Response $response, $args=[])
    {
        $params = [
            'title' => '登录界面',
        ];
        return $this->container->get('twig')->render($response, 'admin/pages/login.twig', $params);
    }

    /**
     * 用户登录 /admin/login post
     * @param $user 用户名
     * @param $password 密码
     *
     */
    public function login(Request $request, Response $response, $args=[])
    {
        $params = $request->getParams();
        if (!empty($params['username']) && !empty($params['password'])) {
            $admin = Admin::where('user', $params['username'])->first()->toArray();
            if (!empty($admin)) {
                $encryString = $this->container->get('settings')->get('encryString');
                $encryPassword = AdminController::passwordMD5($params['password'], $encryString);
                if ($admin['password'] == $encryPassword) {
                    $_SESSION['user_info'] = $admin;
                    $ret = msg([], '登录成功', 0, '/admin/home');
                } else {
                    $ret = msg([], '用户名或密码错误', 2);
                }
            } else {
                $ret = msg([], '用户名或密码错误', 1);
            }
        } else {
            $ret = msg([], '参数错误', 1);
        }
        return $response->withJson($ret);
    }

    /**
     * 用户登出 /admin/logout post
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function logout(Request $request, Response $response, $args=[])
    {
        $params = $request->getParams();
        unset($_SESSION['user_info']);
        if (empty($_SESSION['user_info'])) {
            $ret = msg([], '退出成功', 0, '/admin/login');
        } else {
            $ret = msg([], '退出失败', 1);
        }
        return $response->withJson($ret);
    }

    // token验证方式的登录
    /**
     * 生成token
     *
     */
    public function generateToken()
    {

    }

    /**
     * 生成原始token
     *
     */
    public function originToken()
    {

    }

    /**
     * 加密成返回给前台保存的加密token
     *
     */
    public function encryptToken()
    {

    }

    /**
     * 解密前台传来的经过加密了的token
     *
     */
    public function decryptToken()
    {

    }
}