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
    public  function receive(Request $request, Response $response, $args=[])
    {
    	$params = $request->getParams();

    	$appid = $this->ci->get('settings')->get('appid');
    	$secret = $this->ci->get('settings')->get('secret');
    	$access_token = 'TVWkM6N-t1HCoPQeRQlVkGV2ms3u7k3x3cT1NEsHw1touzYku0QUZEnSBpiPaSn0U6zFHaPK3sp2fZgF1ZSvjDf90C-mdzVudSFUh88GhmuG5e10OVc3f55H4-FfSexvIPBjAEAAHT';


    	$test_appid = $this->ci->get('settings')->get('test_appid');
    	$test_secret = $this->ci->get('settings')->get('test_secret');
    	$test_access_token = '-6tnnFwbJAw9m5TI_IIvD4xjZiKyNukATRoS0rl_98rDJRR68OybG7bnqnoDq4-NlUtrY5CCGH289VP4WIwqGLmLLRT_3UHq3Q0zM-4kuk-KYM4Fve13udep841DzcxqBPWeAJAXLS';

    	$openid = 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns';
    	//$openid = 'osKcv06UlF_H2xNM74s3vMXhwOHE';

    	// 创建一个新cURL资源
		$ch = curl_init();

		// 设置URL和相应的选项
		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appid."&secret=".$secret);
		


		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=".$access_token);
		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=".$access_token);
		// 获取用户OpenID列表
		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/user/get?access_token=".$test_access_token."&next_openid=");
		// 获取单个用户基本信息
		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$test_access_token."&openid=".$openid."&lang=zh_CN ");



		//curl_setopt($ch, CURLOPT_HEADER, 0);

		// 测试账号
		curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$test_appid."&secret=".$test_secret);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

		// 抓取URL并把它传递给浏览器
		$output = curl_exec($ch);

		// 关闭cURL资源，并且释放系统资源
		curl_close($ch);
		$output = json_decode($output, true);
		print_r("<pre>");
		print_r($output);
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

    	// 发送的文本消息
    	$paramText = [
    		'touser' => 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns',
    		'msgtype' => 'text',
    		'text' => [
    			'content' => date("Y-m-d H:i:s") . "  你有一个待办事项",
    		],
    	];

    	// 图片消息
    	$paramImage = [
    		'touser' => 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns',
    		'msgtype' => 'text',
    		'image' => [
    			'media_id' => 'MEDIA_ID',
    		],
    	];

    	// 语音消息
    	$paramVoice = [
    		'touser' => 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns',
    		'msgtype' => 'text',
    		'voice' => [
    			'media_id' => 'MEDIA_ID',
    		],
    	];

    	// 视频消息
    	$paramVideo = [
    		'touser' => 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns',
    		'msgtype' => 'text',
    		'video' => [
				"media_id" => "MEDIA_ID",
				"thumb_media_id" => "MEDIA_ID",
				"title" => "TITLE",
				"description" => "DESCRIPTION"
    		],
    	];

    	// 音乐消息
    	$paramMusic = [
    		'touser' => 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns',
    		'msgtype' => 'text',
    		'music' => [
				"title" => "MUSIC_TITLE",
				"description" => "MUSIC_DESCRIPTION",
				"musicurl" => "MUSIC_URL",
				"hqmusicurl" => "HQ_MUSIC_URL",
				"thumb_media_id" => "THUMB_MEDIA_ID"
    		],
    	];

    	// 图文消息
    	$paramNews = [
    		'touser' => 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns',
    		'msgtype' => 'text',
    		'news' => [
				'articles' => [
					[
						"title" => "Happy Day",
						"description" => "Is Really A Happy Day",
						"url" => "URL",
						"picurl" => "PIC_URL"
					],
					[
						"title" => "Happy Day",
						"description" => "Is Really A Happy Day",
						"url" => "URL",
						"picurl" => "PIC_URL"
					]
				]
    		],
    	];

    	// 图文消息(点击跳转查看)
    	$paramMpnews = [
    		'touser' => 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns',
    		'msgtype' => 'text',
    		'mpnews' => [
				"media_id" => "MEDIA_ID"
    		],
    	];


    	$access_token = 'hKa9i1VCWPnwh5qPYAXWdLkgDbL4lUtw-OOrpcQXloFsxTS_PcbE_NV4he1u0svisS8CDIttzu-0XM0h4LmwGPLurjFGCYj8iEqJaJzi7ksg0kB92GLYuYbQWgeCmJkPLGMdAEAGBH';
    	$url  = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=".$access_token;
		$data = json_encode($paramText, JSON_UNESCAPED_UNICODE);

		return WeChat::sendWeChatMessage($url, $data, $access_token);
    }
}