<?php

namespace App\Migrations;

/**
* Article Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Article extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('title', 64)
                ->comment('文章标题');
            $table->text('content')
                ->comment('文章类容');
            $table->string('tags', 255)
                ->comment('标签');
            $table->string('type', 128)
                ->comment('类型');
            $table->string('creator', 32)
                ->comment('发布人名称');
            $table->string('editor', 32)
                ->nullable()
                ->comment('修改人名称');
            $table->string('status', 128)
                ->default(0)
                ->comment('发布状态0：待处理 1：发布 2：撤回');
            $table->string('release_time', 128)
                ->nullable()
                ->comment('发布时间');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}