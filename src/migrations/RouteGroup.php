<?php

namespace App\Migrations;

/**
* RouteGroup Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class RouteGroup extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('name', 255)
                ->comment('接口小类别名称');
            $table->text('route')
                ->comment('各类别接口集合');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}