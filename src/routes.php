<?php

//创建路由
$sub_apps = require __DIR__ . '/apps/entry.php';

$i = 0;
foreach ($sub_apps as $key => $sub_app) {
    $prefix = $sub_app['prefix'];//路由前缀，如：/api
    $urls = $sub_app['urls'];//具体路由名，如：/menu[/]
    foreach ($urls as $url => $action) {
        foreach ($action as $method => $content) {
            $handler = $content['handler'];//路由回调
            $route = $prefix . $url;//把路由前缀和具体接口名串接为完整路由（接口地址）
            $id = null;
            switch (strtolower($method)) {//$method 路由模式，例如：post、get、delete、put等
                case 'get':
                    $id = $app->get($route, $handler);
                    break;
                case 'post':
                    $id = $app->post($route, $handler);
                    break;
                case 'put':
                    $id = $app->put($route, $handler);
                    break;
                case 'delete':
                    $id = $app->delete($route, $handler);
                    break;
                case 'head':
                    $id = $app->head($route, $handler);
                    break;
                case 'patch':
                    $id = $app->patch($route, $handler);
                    break;
                case 'options':
                    $id = $app->options($route, $handler);
                    break;
                # --------------------------------------------
                case 'any':
                    $id = $app->any($route, $handler);
                    break;
                case 'map'://自定义路由，多个 HTTP 请求方法的路由
                    if(array_key_exists('methods', $content)) {
                        $methods = $content['methods'];
                        if(!empty($methods)) {
                            $methods = array_map('strtoupper', $methods);
                            $id = $app->map($methods, $route, $handler);
                        }
                        else {
                            echo 'map method need methods with not empty';
                        }
                    }
                    else {
                        echo 'map method need methods';
                    }
                    break;
                default:
                    # code...
                    echo 'http request method not support';
                    break;
            }
            if(isset($id)) {
                $name = null;//获取api的别名
                if(array_key_exists('name', $content)) {
                    $name = $content['name'];
                }
                if(!isset($name)) {
                    $name = 'route' . $i;
                }
                $id -> setName($name);//设置路由名称
                if(array_key_exists('auth', $content)) {
                    $auth = $content['auth'];
                    if($auth === true) {//是否是正式需要的接口（测试接口不写入）
                        $container->get('globals')->item_push('authRouteList', $name);
                    }
                }
                if(array_key_exists('allow', $content)) {
                    $allow = $content['allow'];
                    if($allow === true) {
                        $container->get('globals')->item_push('allowRouteList', $name);
                    }
                }
                if(array_key_exists('limit', $content)) {
                    $limit = $content['limit'];
                    if($limit === true) {
                        $container->get('globals')->item_push('limitRouteList', $name);
                    }
                }
                if(array_key_exists('file', $content)) {
                    $file = $content['file'];
                    if($file) {
                        $id->setOutputBuffering('prepend');
                    }
                }
                if($container->get('settings')['debug']) {
                    if(array_key_exists('op_class', $content) && array_key_exists('op_name', $content)) {
                        $op_class = $content['op_class'];//接口类型
                        $op_name = $content['op_name'];//接口名称
                        $op_value = [
                            'class'=>$op_class,
                            'name'=>$op_name
                        ];
                        $container->get('globals')->item_push('operationList', $name, $op_value);
                    }
                }
            }
            $i += 1;
        }
    }
}