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
        return $result;
    }

    //------------------------------------------------------群发消息---------------------------
    /**
     * 群发消息
     * @param int $messageType 发送的消息类型
     * @param string $message 消息内容
     * @param string $operationType 操作方式
     * @param int $item 不同操作方式传递的数据
     *
     */
    public function sendMassMessage($messageType, $message, $operationType, $item=[])
    {
        $broadcast = $this->$app->broadcast;
        switch ($operationType) {
            case 'all':
                $result = $broadcast->send($messageType, $message); // 发给所有人
                break;

            case 'target':
                $result = $broadcast->send($messageType, $message, $item); // 发给指定组
                break;

            case 'openid':
                $result = $broadcast->send($messageType, $message, $item); // 发给指定用户
                break;

            case 'preview':
                $result = $broadcast->preview($messageType, $message, $item); // 发送预览群发消息指定用户openid
                break;

            case 'wxname':
                $result = $broadcast->previewByName($messageType, $message, $item); // 发送预览群发消息指定用户wxname
                break;
            
            default:
                $result = [
                    'data' => [],
                    'msg' => '执行方式错误',
                    'error' => 1
                ];
                break;
        }
        return $result;
    }

    /**
     * delete mass message
     * @param $msgId 群发消息ID
     *
     */
    public function deleteMassMessage($msgId)
    {
        $broadcast = $this->$app->broadcast;
        $result = $broadcast->delete($msgId);
        return $result;
    }

    /**
     * see mass message status
     * @param $msgId 群发消息ID
     *
     */
    public function deleteMassMessage($msgId)
    {
        $broadcast = $this->$app->broadcast;
        $result = $broadcast->status($msgId);
        return $result;
    }

    // -----------------------------------菜单操作-----------------------------------------------
    /**
     * add menu
     * @param array $buttons ordinary menu
     * @param array $matchRule Individualization menu
     *
     */
    public function addMenu($buttons, $matchRule=[])
    {
        $menu = $this->$app->menu;
        /*$buttons = [
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
        ];*/
        if (!empty($matchRule)) {
            $result = $menu->add($buttons, $matchRule);
        } else {
            $result = $menu->add($buttons);
        }
        return $result;
    }

    /**
     * see menu
     *
     */
    public function seeMenu()
    {
        $menu = $this->$app->menu;
        $result = $menu->all();
        return $result;
    }

    /**
     * delete menu
     * @param $menuId menu id
     *
     */
    public function deleteMenu($menuId=null)
    {
        $menu = $this->$app->menu;
        if ($menuId == null) {
            $result = $menu->destroy();
        } else {
            $result = $menu->destroy($menuId);
        }
        return $result;
    }

    //-----------------------------------------获取用户信息------------------------------
    /**
     * obtain user info
     * @param $ipenId
     *
     */
    public function getUserInfo($openID)
    {
        $userService = $this->$app->user;
        $user = $userService->get($openId);
        return $user;
    }

    /**
     * obtain user list
     * @param $ipenId
     *
     */
    public function getUserInfo($openID)
    {
        $userService = $this->$app->user;
        $users = $userService->lists();
        return $users;
    }
}