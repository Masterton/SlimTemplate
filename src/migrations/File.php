<?php

namespace App\Migrations;

/**
* File Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class File extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('name', 255)
                ->comment('文件名称');
            $table->string('type', 255)
                ->comment('文件类型');
            $table->string('format', 255)
                ->comment('文件格式');
            $table->bigInteger('size')
                ->comment('文件大小/byte');
            $table->string('hash', 32)
                ->comment('生成的唯一hash值');
            $table->string('path', 255)
                ->comment('文件路径');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}