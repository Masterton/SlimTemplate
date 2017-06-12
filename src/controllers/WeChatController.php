<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

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
	 * 接收微信验证消息
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
    	$test_access_token = 'JLgCDif2xd3stDx9ONSPlLcSIM1TuVWaY1QPOVR43_6keHtchEgXWLbN0owU5-vwUx2XHvRjFxCtILz5exfF1evOA_N59xS2gwYTsWfEIsbsuR1pCgMjpOXkJtkFKCerHONhABAWDC';

    	$openid = 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns';
    	//$openid = 'osKcv06UlF_H2xNM74s3vMXhwOHE';

    	// 创建一个新cURL资源
		$ch = curl_init();

		// 设置URL和相应的选项
		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$appid."&secret=".$secret);
		// 测试账号
		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".$test_appid."&secret=".$test_secret);


		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=".$access_token);
		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=".$access_token);
		// 获取用户OpenID列表
		//curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/user/get?access_token=".$test_access_token."&next_openid=");
		// 获取单个用户基本信息
		curl_setopt($ch, CURLOPT_URL, "https://api.weixin.qq.com/cgi-bin/user/info?access_token=".$test_access_token."&openid=".$openid."&lang=zh_CN ");



		//curl_setopt($ch, CURLOPT_HEADER, 0);
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
}