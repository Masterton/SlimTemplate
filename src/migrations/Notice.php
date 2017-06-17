<?php

namespace App\Migrations;

/**
* Notice Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Notice extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('title', 11)
                ->comment('标题');
            $table->string('content', 128)
                ->comment('内容');
            $table->tinyInteger('release')
                ->default(0)
                ->comment('是否发布0：待处理 1：发布 2：撤回');
            $table->tinyInteger('view_num')
                ->default(0)
                ->comment('查看数');
            $table->timestamp('release_time')
                ->nullable()
                ->comment('发布时间');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}