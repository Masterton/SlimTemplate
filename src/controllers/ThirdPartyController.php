<?php

namespace App\Controllers;

use \App\Models\User;
use \App\Models\Admin;
use \Slim\Http\Request;
use \Slim\Http\Response;
use \GuzzleHttp\Client;

/**
 * ThirdPartyController 第三方登录
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 0.0.1
 * @since 1.0
 * @time 2017-8-4 10:17:40
 */
class ThirdPartyController extends ControllerBase
{
    /**
     * 微博授权 /login/weibo get
     * @param $request
     * @param $response
     *
     */
    public function weiboAuthor(Request $request, Response $response, $args=[])
    {
        $params = $request->getParams();
        if (!empty($params['code'])) {
            $client = new Client();

            // 用户同意授权，拿到code，再用code 去换取 Access Token 和用户id
            $ret = $client->request('POST', 'https://api.weibo.com/oauth2/access_token?client_id=2752402689&client_secret=1b0b2b9dd12d41b56d454129418e1f37&grant_type=authorization_code&redirect_uri=http://slim.zhengss.com/login/weibo&code=' . $params['code']);

            $item = json_decode($ret->getBody(), true);

            // 获取 Access Token 和用户id，去获取用户信息
            $rets = $client->request('GET', 'https://api.weibo.com/2/users/show.json?access_token='.$item['access_token'].'&uid=' . $item['uid']);

            $info = json_decode($rets->getBody(), true);

            // 如果没用用户，就新建一个用户
            $user = User::where('weibo', $info['id'])->get();
            if ($user->count() == 1) {
                //$_SESSION['user_info'] = $user[0];
                return $response->withRedirect('/')->withStatus(301);
            } else {
                $newUser = new User;
                $newUser->name = $info['name'];
                $newUser->weibo = $info['id'];
                $newUser->ucode = 'fafafafafafafafa';
                $newUser->save();

                $userinfo = User::where('weibo', $info['id'])->get();
                //$_SESSION['user_info'] = $userinfo[0];
                return $response->withRedirect('/article')->withStatus(301);
            }
        }
    }

    /**
     * 微信授权 /log/wechat get
     * @param $request
     * @param $response
     *
     */
    public function wechatAuthor(Request $request, Response $response, $args=[])
    {

    }

    /**
     * QQ授权 /log/qq get
     * @param $request
     * @param $response
     *
     */
    public function qqAuthor(Request $request, Response $response, $args=[])
    {

    }
}