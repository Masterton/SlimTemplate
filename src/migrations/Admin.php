<?php

namespace App\Migrations;

/**
* Admin Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Admin extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('user', 16)
                ->comment('用户名');
            $table->string('name', 32)
                ->comment('用户名称');
            $table->string('password', 32)
                ->comment('密码');
            $table->tinyInteger('status')
                ->default(2)
                ->comment('权限级别1：最高级别 2：添加的子管理级别');
            $table->string('image', 128)
                ->nullable()
                ->comment('头像');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}