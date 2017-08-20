<?php
return [

    // 后台主页
    '/home[/]' => [
        'get' => [
            'handler' => "App\Controllers\AdminHomeController:index",
            'name'    => 'admin_get_home',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '主页',
        ],
    ],

    // 登录和登出
    '/login[/]' => [
        'get' => [
            'handler' => 'App\Controllers\LoginController:index',
            'name' => 'admin_get_login',
            'auth' => false,
            'op_class' => '后台',
            'op_name' => '登录界面',
        ],
        'post' => [
            'handler' => 'App\Controllers\LoginController:login',
            'name' => 'admin_post_login',
            'auth' => false,
            'op_class' => '后台',
            'op_name' => '用户登录',
        ],
    ],
    '/logout[/]' => [
        'post' => [
            'handler' => 'App\Controllers\LoginController:logout',
            'name' => 'admin_post_logout',
            'auth' => false,
            'op_class' => '后台',
            'op_name' => '用户登出',
        ],
    ],

    // 用户管理
    '/user[/]' => [
        'get' => [
            'handler' => "App\Controllers\UserController:queryUser",
            'name'    => 'admin_get_user',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '查询用户列表',
        ],
        'post' => [
            'handler' => "App\Controllers\UserController:addUser",
            'name'    => 'admin_post_user',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '添加用户',
        ],
        'put' => [
            'handler' => "App\Controllers\UserController:modifyUser",
            'name'    => 'admin_put_user',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '修改用户资料',
        ],
        'delete' => [
            'handler' => "App\Controllers\UserController:deleteUser",
            'name'    => 'admin_delete_user',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '删除用户',
        ],
    ],
    '/add_user[/]' => [
        'get' => [
            'handler' => "App\Controllers\UserController:addUserIndex",
            'name'    => 'admin_get_add_user',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '添加用户页面',
        ],
    ],
    '/user/personal[/[id]]' => [
        'get' => [
            'handler' => "App\Controllers\UserController:queryUser",
            'name'    => 'admin_get_user',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '查询用户个人信息',
        ],
    ],

    // 管理员管理
    '/admin[/]' => [
        'get' => [
            'handler' => "App\Controllers\AdminController:queryAdmin",
            'name'    => 'admin_get_admin',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '查询管理员列表',
        ],
        'post' => [
            'handler' => "App\Controllers\AdminController:addAdmin",
            'name'    => 'admin_post_admin',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '添加管理员',
        ],
        'put' => [
            'handler' => "App\Controllers\AdminController:modifyAdmin",
            'name'    => 'admin_put_admin',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '修改管理员资料',
        ],
        'delete' => [
            'handler' => "App\Controllers\AdminController:deleteAdmin",
            'name'    => 'admin_delete_admin',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '删除管理员',
        ],
    ],
    '/add_admin[/]' => [
        'get' => [
            'handler' => "App\Controllers\AdminController:addAdminIndex",
            'name'    => 'admin_get_add_admin',
            'auth'    => true,
            'op_class' => '后台',
            'op_name' => '添加管理员页面',
        ],
    ],
];