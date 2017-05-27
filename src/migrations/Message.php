<?php

namespace App\Migrations;

/**
* Menu Table Migration
*/
class Message extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('uid', 11)
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