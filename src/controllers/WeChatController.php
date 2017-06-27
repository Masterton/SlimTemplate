<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \EasyWeChat\Foundation\Application;
use \EasyWeChat\Message\Text;
use \App\Handlers\WeChat;

/**
* WeChatController
* 微信控制器
* @author Masterton <zhengcloud@foxmail.com>
* @version 1.0
* @since 1.0
* @time 2017-6-12 09:35:44
*/
class WeChatController extends ControllerBase
{
	/**
	 * 接收微信验证消息 api/wechat get
	 *
	 *
	 *
	 */
    public function receive(Request $request, Response $response, $args=[])
    {
    	// 查看关注公众号的用户列表openid
        $config = $this->container->get('settings')['wechat'];
        $app = new Application($config);

        $menu = $app->menu;

        $buttons = [
            [
                "type" => "click",
                "name" => "今日歌曲",
                "key"  => "V1001_TODAY_MUSIC"
            ],
            [
                "name"       => "菜单",
                "sub_button" => [
                    [
                        "type" => "view",
                        "name" => "搜索",
                        "url"  => "http://www.zhengss.com/"
                    ],
                    [
                        "type" => "view",
                        "name" => "视频",
                        "url"  => "http://slim.zhengss.com/"
                    ],
                    [
                        "type" => "click",
                        "name" => "赞一下我们",
                        "key" => "V1001_GOOD"
                    ],
                ],
            ],
            [
                "name"       => "菜单",
                "sub_button" => [
                    [
                        "type" => "view",
                        "name" => "搜索",
                        "url"  => "http://www.zhengss.com/"
                    ],
                    [
                        "type" => "view",
                        "name" => "视频",
                        "url"  => "http://slim.zhengss.com/"
                    ],
                    [
                        "type" => "click",
                        "name" => "赞一下我们",
                        "key" => "V1001_GOOD"
                    ],
                ],
            ],
        ];

        $matchRule = [
            "tag_id" => "2",
            "sex" => "1",
            "country" => "中国",
            "province" => "广东",
            "city" => "广州",
            "client_platform_type" => "2",
            "language" => "zh_CN"
        ];
        //$menu->destroy();
        //$menu->add($buttons, $matchRule);

        print_r("<pre>");
        print_r($menu->all());
        exit;
    }

    /**
     * 第一次接入微信的验证
     * @param $signature 微信加密签名，signature结合了开发者填写的token参数和请求中的timestamp参数、nonce参数。
     * @param $timestamp 时间戳
     * @param $nonce 随机数
     * @param $echostr 随机字符串
     * @return $echostr
     */
    public function accessWeChatVerification(Request $request, Response $response, $args=[])
    {
    	$params = $request->getParams();

    	$signature = array_get($params, 'signature');
    	$timestamp = array_get($params, 'timestamp');
    	$nonce = array_get($params, 'nonce');
    	$echostr = array_get($params, 'echostr');
    	$token = $this->ci->get('settings')->get('wx_token'); // 自己设置的token值


    	 //组合数组
	    $tmpArr = array($token, $timestamp, $nonce);

	    //字典序排序
	    sort($tmpArr, SORT_STRING);

	    //链接起来返回字符串
	    $tmpStr = implode($tmpArr);
	    //加密
	    $tmpStr = sha1($tmpStr);  
	    //第一次接入微信消息接口
	    if ($tmpStr == $signature && !empty($echostr)) {
	      return $echostr;
	    } else {
	      //开始接收微信消息
	      return '验证失败';
	    }
    }

    /**
	 * 接受微信服务器发送来的数据，并保存到本地数据库中 api/wechat post
	 * 微信服务器把用户消息转到我们的自有服务器（这里就是我们服务器接受信息的接口）
	 *
	 */
    public function add_wechat(Request $request, Response $response, $args=[])
    {
        // 配置信息
        $options = [
            // basics
            'debug'  => true, // 测试的时候使用
            'app_id' => $this->ci->get('settings')->get('test_appid'), // 应用ID
            'secret' => $this->ci->get('settings')->get('test_secret'), // 应用凭证
            'token'  => $this->ci->get('settings')->get('wx_token'), // 公众使用的token值
            // 'aes_key' => null, // 可选

            // log
            'log' => [
                'level' => 'debug',
                //'file'  => '/var/log/nginx/error.log', // XXX: 绝对路径！！！！
            ],
            //...
        ];

        // 从项目实例中得到服务端应用实例。
        $Application = new Application($options);

        $server = $Application->server;
        $server->setMessageHandler(function ($message) {
            //return "您好！欢迎关注我!" . date("Y-m-d H:i:s");
            switch ($message->MsgType) {
                case 'event':
                    return '收到事件消息';
                    break;
                case 'text':
                    return '收到文字消息';
                    break;
                case 'image':
                    return '收到图片消息';
                    break;
                case 'voice':
                    return '收到语音消息';
                    break;
                case 'video':
                    return '收到视频消息';
                    break;
                case 'location':
                    return '收到坐标消息';
                    break;
                case 'link':
                    return '收到链接消息';
                    break;
                // ... 其它消息
                default:
                    return '收到其它消息';
                    break;
            }
        });

        $return = $server->serve();

        // 直接会用微信发来的消息
        $message = $server->getMessage();
        $ToUserName = $message->ToUserName;    // 接收方帐号（该公众号 ID）
        $FromUserName = $message->FromUserName;  // 发送方帐号（OpenID, 代表用户的唯一标识）
        $CreateTime = $message->CreateTime;    // 消息创建时间（时间戳）
        $MsgId = $message->MsgId;         // 消息 ID（64位整型）

        // 将响应输出
        $return->send(); // Laravel 里请使用：return $response;
    }

    /**
	 * api/wechat put
	 *
	 *
	 */
    public function modify_wechat(Request $request, Response $response, $args=[])
    {
    	
    }

    /**
	 * api/wechat delete
	 *
	 *
	 */
    public function delete_wechat(Request $request, Response $response, $args=[])
    {
    	
    }

    /**
	 * api/wechat/send get
	 *
	 *
	 */
    public function sendWeChatMsg(Request $request, Response $response, $args=[])
    {
        // 群发消息
        /*$config = $this->container->get('settings')['wechat'];
    	$app = new Application($config);
        $broadcast = $app->broadcast;

        $result = $broadcast->sendText("fsadfsdafsdafsad");
        var_dump($result);*/

        // 发送模板消息
        /*$userId = 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns';
        $templateId = 'x9g-tb0FiWDBrvMRWgOTROOcGlg67xAjDbqetjUClQQ';
        $url = 'http://slim.zhengss.com';
        $data = array(
            "first"  => "恭喜你购买成功！",
            "name"   => "巧克力",
            "price"  => "39.8元",
            "remark" => "欢迎再次购买！",
        );
        $config = $this->container->get('settings')['wechat'];
        $app = new Application($config);
        $notice = $app->notice;

        $result = $notice->uses($templateId)->withUrl($url)->andData($data)->andReceiver($userId)->send();
        $result = json_decode($result, true);
        if ($result['errcode'] == 0) {
            return "发送成功";
        } else {
            return "发送失败";
        }*/
    }
}