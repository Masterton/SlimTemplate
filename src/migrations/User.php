<?php

namespace App\Migrations;

/**
* User Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class User extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('ucode', 16)
                ->comment('用户编码');
            $table->string('user', 32)
                ->comment('用户名');
            $table->string('password', 32)
                ->comment('密码');
            $table->string('name', 32)
                ->comment('用户名称');
            $table->string('phone', 16)
                ->nullable()
                ->comment('电话');
            $table->string('email', 128)
                ->nullable()
                ->comment('邮箱地址');
            $table->text('old_password')
                ->nullable()
                ->comment('旧密码');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}