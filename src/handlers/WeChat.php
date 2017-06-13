<?php 

namespace App\Handlers;

/**
 * Wechat 发送微信消息
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @time 2017-6-13 13:45:12
 *
 */
class Wechat
{
	/**
     * 发送微信消息（单文本、图文、语音等）
     * @param $url 发送消息的api
     * @param $data 发送的消息（json格式）
     * @param $access_token 调用接口凭证
     *
     */
    public static function sendWeChatMessage($url, $data, $access_token)
    {
    	$httpHeader = [
			'Content-Type: application/json; charset=utf-8',
			'Content-Length: ' . strlen($data),
		];

    	$ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $httpHeader);
        $output = curl_exec($ch);
        curl_close($ch);

        $output = json_decode($output, true);

        if ($output['errcode'] == 0) {
        	return "发送成功！";
        } else {
        	return "发送失败！";
        }
    }
}