<?php

namespace App\Migrations;

/**
* WXToken Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class WXToken extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('access_token', 32)
                ->comment('连接微信返回的token值');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}