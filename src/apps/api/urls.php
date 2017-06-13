<?php

return [
    '/ping[/]' => [
        'get' => [
            'handler' => function(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
                $response->getBody()->write("45465465");
                return $response;
            },
            'name' => 'api_ping',
            'auth' => false
        ],
    ],

    '/node_method[/]' => [
        'get' => [
            'handler' => 'App\Controllers\TestController:test_node_method',
            'name' => 'api_node_method',
            'auth' => false
        ],
    ],

    // 
    '/test[/]' => [
        'post' => [
            'handler' => 'App\Controllers\HomeController:test',
            'name' => 'api_get_test',
            'auth' => false
        ],
    ],

    // 菜单接口
    '/menu[/]' => [
        'get' => [
            'handler' => "App\Controllers\MenuController:query_menu",
            'name'    => 'api_get_menu',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '查询菜单',
        ],
        'post' => [
            'handler' => "App\Controllers\MenuController:add_menu",
            'name'    => 'api_post_menu',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '添加菜单',
        ],
        'put' => [
            'handler' => "App\Controllers\MenuController:modify_menu",
            'name'    => 'api_put_menu',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改菜单',
        ],
        'delete' => [
            'handler' => "App\Controllers\MenuController:delete_menu",
            'name'    => 'api_delete_menu',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除菜单',
        ],
    ],

    // 用户接口
    '/user[/[uid]]' => [
        'get' => [
            'handler' => "App\Controllers\UserController:query_menu",
            'name'    => 'api_get_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '查询用户',
        ],
        'post' => [
            'handler' => "App\Controllers\UserController:add_menu",
            'name'    => 'api_post_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '添加用户',
        ],
        'put' => [
            'handler' => "App\Controllers\UserController:modify_menu",
            'name'    => 'api_put_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改用户',
        ],
        'delete' => [
            'handler' => "App\Controllers\UserController:delete_menu",
            'name'    => 'api_delete_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除用户',
        ],
    ],

    // 下载接口
    '/download[/]' => [
        'get' => [
            'handler' => "App\Controllers\ExcelController:download",
            'name'    => 'api_get_download',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '下载文件',
        ],
    ],
    '/download/excel[/]' => [
        'get' => [
            'handler' => "App\Controllers\ExcelController:download",
            'name'    => 'api_get_download_excel',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '下载excel文件',
        ],
    ],
    '/download/word[/]' => [
        'get' => [
            'handler' => "App\Controllers\WordController:download",
            'name'    => 'api_get_download_word',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '下载word文件',
        ],
    ],

    // 上传接口
    '/upload[/]' => [
        'post' => [
            'handler' => "App\Controllers\UploadController:upload",
            'name'    => 'api_post_upload',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '上传文件',
        ],
    ],

    // word 接口
    '/word[/]' => [
        'get' => [
            'handler' => "App\Controllers\WordController:query_menu",
            'name'    => 'api_get_word',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '查询邮件',
        ],
        'post' => [
            'handler' => "App\Controllers\WordController:readerWord",
            'name'    => 'api_post_word',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '发送邮件',
        ],
        'put' => [
            'handler' => "App\Controllers\WordController:modify_menu",
            'name'    => 'api_put_word',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改邮件',
        ],
        'delete' => [
            'handler' => "App\Controllers\WordController:delete_menu",
            'name'    => 'api_delete_word',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除邮件',
        ],
    ],

    // 邮件接口
    '/email[/]' => [
        'get' => [
            'handler' => "App\Controllers\EmailController:query_menu",
            'name'    => 'api_get_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '查询邮件',
        ],
        'post' => [
            'handler' => "App\Controllers\EmailController:add_menu",
            'name'    => 'api_post_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '发送邮件',
        ],
        'put' => [
            'handler' => "App\Controllers\EmailController:modify_menu",
            'name'    => 'api_put_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改邮件',
        ],
        'delete' => [
            'handler' => "App\Controllers\EmailController:delete_menu",
            'name'    => 'api_delete_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除邮件',
        ],
    ],

    // 文章接口
    '/article[/[aid]]' => [
        'get' => [
            'handler' => "App\Controllers\ArticalController:query_menu",
            'name'    => 'api_get_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '查询文章',
        ],
        'post' => [
            'handler' => "App\Controllers\ArticalController:add_menu",
            'name'    => 'api_post_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '新添文章',
        ],
        'put' => [
            'handler' => "App\Controllers\ArticalController:modify_menu",
            'name'    => 'api_put_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改文章',
        ],
        'delete' => [
            'handler' => "App\Controllers\ArticalController:delete_menu",
            'name'    => 'api_delete_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除文章',
        ],
    ],

    // 管理员接口
    '/admin[/[aid]]' => [
        'get' => [
            'handler' => "App\Controllers\AdminController:query_menu",
            'name'    => 'api_get_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '查询管理员',
        ],
        'post' => [
            'handler' => "App\Controllers\AdminController:add_menu",
            'name'    => 'api_post_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '新添管理员',
        ],
        'put' => [
            'handler' => "App\Controllers\AdminController:modify_menu",
            'name'    => 'api_put_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改管理员',
        ],
        'delete' => [
            'handler' => "App\Controllers\AdminController:delete_menu",
            'name'    => 'api_delete_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除管理员',
        ],
    ],

    // 权限接口
    '/jurisdiction[/]' => [
        'get' => [
            'handler' => "App\Controllers\AdminController:query_menu",
            'name'    => 'api_get_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '查询api接口列表',
        ],
        'post' => [
            'handler' => "App\Controllers\AdminController:add_menu",
            'name'    => 'api_post_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '新添api接口',
        ],
        'put' => [
            'handler' => "App\Controllers\AdminController:modify_menu",
            'name'    => 'api_put_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改api接口',
        ],
        'delete' => [
            'handler' => "App\Controllers\AdminController:delete_menu",
            'name'    => 'api_delete_user',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除api接口',
        ],
    ],

    // 微信接口
    '/wechat[/]' => [
        'get' => [
            'handler' => "App\Controllers\WeChatController:receive",
            'name'    => 'api_get_wechat',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '接收微信验证',
        ],
        'post' => [
            'handler' => "App\Controllers\WeChatController:add_wechat",
            'name'    => 'api_post_wechat',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '发送微信消息',
        ],
        'put' => [
            'handler' => "App\Controllers\WeChatController:modify_wechat",
            'name'    => 'api_put_wechat',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改微信消息',
        ],
        'delete' => [
            'handler' => "App\Controllers\WeChatController:delete_wechat",
            'name'    => 'api_delete_wechat',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除微信消息',
        ],
    ],

    // 微信接口(发送信息)
    '/wechat/send[/]' => [
        'get' => [
            'handler' => "App\Controllers\WeChatController:sendWeChatMsg",
            'name'    => 'api_get_wechat_send',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '发送微信信息',
        ],
        'post' => [
            'handler' => "App\Controllers\WeChatController:add_wechat",
            'name'    => 'api_post_wechat_send',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '发送微信消息',
        ],
        'put' => [
            'handler' => "App\Controllers\WeChatController:modify_wechat",
            'name'    => 'api_put_wechat_send',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '修改微信消息',
        ],
        'delete' => [
            'handler' => "App\Controllers\WeChatController:delete_wechat",
            'name'    => 'api_delete_wechat_send',
            'auth'    => true,
            'op_class' => 'api接口',
            'op_name' => '删除微信消息',
        ],
    ],
];