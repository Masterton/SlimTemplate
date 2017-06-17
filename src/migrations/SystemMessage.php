<?php

namespace App\Migrations;

/**
* SystemMessage Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class SystemMessage extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->tinyInteger('from_id')
                ->comment('发送者id');
            $table->tinyInteger('to_id')
                ->comment('接收者id');
            $table->text('title')
                ->comment('标题');
            $table->text('content')
                ->comment('内容');
            $table->tinyInteger('status')
                ->default(0)
                ->comment('是否查看0：未查看 1：已查看');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}