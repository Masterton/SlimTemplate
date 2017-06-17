<?php

namespace App\Migrations;

/**
* UserToken Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class UserToken extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('token', 32)
                ->comment('加密前的token值');
            $table->tinyInteger('user_id')
                ->comment('用户id');
            $table->tinyInteger('limit_time')
                ->comment('过期时间');
            $table->tinyInteger('login_time')
                ->comment('登录时间');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}