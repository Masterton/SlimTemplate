<?php

namespace App\Migrations;

/**
* Comment Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Comment extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->tinyInteger('article_id')
                ->comment('文章id');
            $table->text('content')
                ->comment('评论内容');
            $table->string('creator', 128)
                ->comment('评论人名称');
            $table->tinyInteger('point_num')
                ->default(0)
                ->comment('点赞数');
            $table->tinyInteger('reply_id')
                ->nullable()
                ->comment('回复的问题id');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}