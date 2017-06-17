<?php

namespace App\Migrations;

/**
* Log Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Log extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('name', 32)
                ->comment('用户名称');
            $table->string('url', 255)
                ->comment('访问地址');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}