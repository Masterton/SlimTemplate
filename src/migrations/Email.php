<?php

namespace App\Migrations;

/**
* Email Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Email extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('from_address', 128)
                ->comment('发送者email地址');
            $table->string('to_address', 128)
                ->comment('接收者email地址');
            $table->string('title', 255)
                ->comment('标题');
            $table->text('content')
                ->comment('内容');
            $table->string('enclosure', 128)
                ->nullable()
                ->comment('附件');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}