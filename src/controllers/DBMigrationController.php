<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;

/**
 * DBMigrationController 数据库迁移
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 0.0.1
 * @time 2017-6-7 20:53:42
 *
 */
class DBMigrationController extends ControllerBase
{
    // 根据表名获取对象
    protected function get_object($table_name, $db)
    {
        $obj = null;
        switch ($table_name) {
            case 'menu':
                $obj = new \App\Migrations\Menu($table_name, $db->schema());
                break;
            case 'user':
                $obj = new \App\Migrations\User($table_name, $db->schema());
                break;
            case 'wx_info':
                $obj = new \App\Migrations\WXInfo($table_name, $db->schema());
                break;
            case 'admin':
                $obj = new \App\Migrations\Admin($table_name, $db->schema());
                break;
            case 'article':
                $obj = new \App\Migrations\Article($table_name, $db->schema());
                break;
            case 'message':
                $obj = new \App\Migrations\Message($table_name, $db->schema());
                break;
            case 'system_message':
                $obj = new \App\Migrations\SystemMessage($table_name, $db->schema());
                break;
            case 'email':
                $obj = new \App\Migrations\Email($table_name, $db->schema());
                break;
            case 'notice':
                $obj = new \App\Migrations\Notice($table_name, $db->schema());
                break;
            case 'user_token':
                $obj = new \App\Migrations\UserToken($table_name, $db->schema());
                break;
            case 'admin_token':
                $obj = new \App\Migrations\AdminToken($table_name, $db->schema());
                break;
            case 'resource':
                $obj = new \App\Migrations\Resource($table_name, $db->schema());
                break;
            case 'comment':
                $obj = new \App\Migrations\Comment($table_name, $db->schema());
                break;
            case 'wx_token':
                $obj = new \App\Migrations\WXToken($table_name, $db->schema());
                break;
            case 'route':
                $obj = new \App\Migrations\Route($table_name, $db->schema());
                break;
            case 'route_group':
                $obj = new \App\Migrations\RouteGroup($table_name, $db->schema());
                break;
            case 'group':
                $obj = new \App\Migrations\Group($table_name, $db->schema());
                break;
            case 'power':
                $obj = new \App\Migrations\Power($table_name, $db->schema());
                break;
            case 'log':
                $obj = new \App\Migrations\Log($table_name, $db->schema());
                break;
            case 'file':
                $obj = new \App\Migrations\File($table_name, $db->schema());
                break;
            case 'access':
                $obj = new \App\Migrations\Access($table_name, $db->schema());
                break;
            case 'account':
                $obj = new \App\Migrations\Account($table_name, $db->schema());
                break;
            case 'user_info':
                $obj = new \App\Migrations\UserInfo($table_name, $db->schema());
                break;
            # add <table name> with extra `case` here
            default:
                if (empty($table_name)) {
                    $obj = 'parameter [table] not provided';
                } else {
                    $obj = sprintf('table [%s] not supportted', $table_name);
                }
                break;
        }

        return $obj;
    }

    // 创建表
    public function up(Request $request, Response $response, $args = [])
    {
        $table_name = array_get($args, 'table');
        $db = $this->container->get('db');
        $obj = $this->get_object($table_name, $db);
        if ($obj instanceof \App\Migrations\Base) {
            if (!$obj->exists()) {
                $obj->up();
                $response->getBody()->write(sprintf('create table [%s] ok', $table_name));
            } else {
                $response->getBody()->write(sprintf('table [%s] existed', $table_name));
            }
        } else {
            $response->getBody()->write($obj);
        }

        return $response;
    }

    // 销毁表
    public function down(Request $request, Response $response, $args = [])
    {
        $table_name = array_get($args, 'table');
        $db = $this->container->get('db');
        $obj = $this->get_object($table_name, $db);
        if ($obj instanceof \App\Migrations\Base) {
            if ($obj->exists()) {
                $obj->down();
                $response->getBody()->write(sprintf('drop table [%s] ok', $table_name));
            } else {
                $response->getBody()->write(sprintf('table [%s] not exists', $table_name));
            }
        } else {
            $response->getBody()->write($obj);
        }

        return $response;
    }
}