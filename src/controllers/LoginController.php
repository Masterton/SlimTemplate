<?php

namespace App\Controllers;

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
     * 显示登录界面 /login get
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function index(Request $request, Response $response, $args=[])
    {
        $result = [];
        return $this->ci->get('twig')->render($response, 'home/pages/home.twig', $result);
    }

    /**
     * 用户登录 /api/login post
     * @param $user 用户名
     * @param $password 密码
     *
     */
    public function login(Request $request, Response $response, $args=[])
    {

    }

    /**
     * 用户登出 /api/logout post
     * @param $id 用户id
     * @param $.. 其他参数
     *
     */
    public function logout(Request $request, Response $response, $args=[])
    {

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