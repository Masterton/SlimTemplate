<?php

namespace App\Migrations;

/**
* Message Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Message extends Base
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
            $table->text('content')
                ->comment('内容');
            $table->tinyInteger('status')
                ->default(0)
                ->comment('是否查看0：未查看 1：已查看');
            $table->string('from_del')
                ->default(0)
                ->comment('发送者删除0：未删除 1：已删除');
            $table->string('to_del')
                ->default(0)
                ->comment('发送者删除0：未删除 1：已删除');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}