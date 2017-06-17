<?php

namespace App\Migrations;

/**
* Route Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Route extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('name', 128)
                ->comment('路由/接口名称');
            $table->string('op_class', 255)
                ->comment('接口大分类');
            $table->string('op_name', 255)
                ->comment('接口描述');
            $table->string('type', 255)
                ->comment('接口小类别');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}