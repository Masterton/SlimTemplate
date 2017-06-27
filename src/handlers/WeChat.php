<?php 

namespace App\Handlers;
use \EasyWeChat\Foundation\Application;

/**
 * WeChat 发送微信消息
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @time 2017-6-13 13:45:12
 *
 */
class WeChat extends Base
{
    /**
     * WeChat Application Example.
     *
     * @var object
     */
    protected $app;

    /**
     * WeChat config information.
     *
     * @var array
     */
    protected $config;


    /**
     * Create new Application.
     * @param array $config WeChat config information.
     * @param object $app WeChat Application.
     *
     */
    public function __construct()
    {
        $this->$config = $this->container->get('settings')['wechat'];
        $this->$app = new Application($this->$config);
    }

	/**
     * 发送模板消息
     * @param $templateId 模板消息ID
     * @param $userId 接受消息的用户openid
     * @param $url 详情链接
     * @param $data 模板数据
     *
     */
    public function sendTemplateMessage($templateId, $userId, $url, $data)
    {
        /*$userId = 'osKcv0xxhfx_aeNvEwk52LUkJ0Ns';
        $templateId = 'x9g-tb0FiWDBrvMRWgOTROOcGlg67xAjDbqetjUClQQ';
        $url = 'http://slim.zhengss.com';
        $data = array(
            "first"  => "恭喜你购买成功！",
            "name"   => "巧克力",
            "price"  => "39.8元",
            "remark" => "欢迎再次购买！",
        );*/
        $notice = $this->$app->notice;
        $result = $notice->uses($templateId)->withUrl($url)->andData($data)->andReceiver($userId)->send();
        $result = json_decode($result, true);
        return $result;
    }

    /**
     * 群发消息
     * @param $messageType 发送的消息类型
     * @param $message 消息内容
     * @param $operationType 操作方式
     * @param $targetId 指定组/标签的ID
     *
     */
    public function sendMassMessage($messageType, $message, $operationType, $openidArray=[], $targetId=null)
    {
        $broadcast = $this->$app->broadcast;
        switch ($operationType) {
            case 'all':
                $result = $broadcast->send($messageType, $message); // 发给所有人
                break;

            case 'target':
                $result = $broadcast->send($messageType, $message, $targetId); // 发给指定组
                break;

            case 'openid':
                $result = $broadcast->send($messageType, $message, $openidArray); // 发给指定用户
                break;

            case 'preview':
                $result = $broadcast->send($messageType, $message, $openId); // 发送预览群发消息指定用户openid
                break;

            case 'wxname':
                $result = $broadcast->send($messageType, $message, $wxname); // 发送预览群发消息指定用户wxname
                break;

            case 'delete':
                $result = $broadcast->send($messageType, $message, $wxname); // 发送预览群发消息指定用户wxname
                break;

            case 'status':
                $result = $broadcast->send($messageType, $message, $wxname); // 发送预览群发消息指定用户wxname
                break;
            
            default:
                # code...
                break;
        }
        $result = json_decode($result, true);
        return $result;
    }

    // -----------------------------------菜单操作-----------------------------------------------
    /**
     * 添加菜单
     *
     */
    public function addMenu()
    {
        $menu = $this->$app->menu;
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
            "tag_id":"2",
            "sex":"1",
            "country":"中国",
            "province":"广东",
            "city":"广州",
            "client_platform_type":"2",
            "language":"zh_CN"
        ];
        $result = $menu->add($buttons, $matchRule);
        return $result;
    }

    /**
     * 查看菜单
     *
     */
    public function seeMenu()
    {
        $menu = $this->$app->menu;
        $result = $menu->all();
        return $result;
    }

    /**
     * 删除菜单
     *
     */
    public function deleteMenu()
    {
        $menu = $this->$app->menu;
        $result = $menu->destroy();
        return $result;
    }
}