<?php

namespace App\Migrations;

/**
* Menu Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Menu extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->tinyInteger('user_id')
                ->comment('用户id');
            $table->string('name', 128)
                ->comment('菜单名称');
            $table->string('desc', 128)
                ->comment('菜单描述');
            $table->string('icon', 128)
                ->nullable()
                ->comment('菜单样式');
            $table->string('url', 128)
                ->nullable()
                ->comment('菜单路由');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}