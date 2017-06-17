<?php

namespace App\Migrations;

/**
* WXInfo Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class WXInfo extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->tinyInteger('user_id')
                ->comment('用户id');
            $table->string('open_id')
                ->comment('微信open_id');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}