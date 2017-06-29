<?php

namespace App\Migrations;

/**
* Account Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-29 14:13:29
*
*/
class Account extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('username', 255)
                ->comment('用户名');
            $table->tinyInteger('uid')
                ->comment('用户ID');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}