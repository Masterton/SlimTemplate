<?php
return [
    'settings' => [
        'determineRouteBeforeAppMiddleware' => true, # https://github.com/slimphp/Slim/issues/1505
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header

        // debug
        'debug' => true,
        'mode' => 'development',
        
        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../../templates/',
        ],

        // Renderer settings
        'view' => [
            'template_path' => __DIR__ . '/../../templates',
            'twig' => [
                'cache' => __DIR__ . '/../../cache/twig',
                'debug' => true,
                'auto_reload' => true
            ]
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],

        // Environment
        'php' => [
            'error_reporting' => E_ALL,
            'display_errors' => true,
            'log_errors' => true,
            'error_log' => true,
            'timezone' => 'Asia/Shanghai'
        ],

        // Eloquent
        'db' => [
            'driver' => 'mysql',
            'host' => 'localhost',
            'database' => 'zheng',
            'username' => 'zheng',
            'password' => 'Zyp$%zheng',
            'charset'   => 'utf8',
            'collation' => 'utf8_general_ci',
            'prefix'    => '',
        ],

        // session
        'session' => [
            'name' => 'eduwest_session',
            'autorefresh' => true,
            'httponly' => true,
            'lifetime' => '30 minutes'
        ],

        'upload_folder' => 'upload',
        'upload_img_exts' => ['png', 'jpeg', 'jpg', 'gif', 'bmp'],
        'upload_data_ext' => ['swf'],
        'base_path' => full_path(__DIR__ . '/../../public'),

        // 加密字符串
        'encryString' => 'slim.zhengss.com',

        // wechart
        'wechat'=>[
            'app_id'  => 'wx2292e1ed58c06f1e',// AppID
            'secret'  => '1e0768b4aef0b62b120e4a5c88e35856',// AppSecret
            'token'   => 'weixin',// Token
            'aes_key' => '8eu5h8plE3lLgaW8n1BaBWj4dqipAmDv1W8CUfuQMVo',// EncodingAESKey，安全模式下请一定要填写！！
            'oauth' => [
                'scopes'   => ['snsapi_userinfo'],
                'callback' => '/oauth_callback',
            ],
            'payment' => [
                'merchant_id'        => 'your-mch-id',
                'key'                => 'key-for-signature',
                'cert_path'          => 'path/to/your/cert.pem', // XXX: 绝对路径！！！！
                'key_path'           => 'path/to/your/key',      // XXX: 绝对路径！！！！
            ],

        ]
    ],
];
