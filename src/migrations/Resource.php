<?php

namespace App\Migrations;

/**
* Resource Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Resource extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('name', 255)
                ->comment('资源名称');
            $table->tinyInteger('type')
                ->comment('资源类型');
            $table->tinyInteger('format')
                ->comment('资源格式');
            $table->bigInteger('size')
                ->comment('资源大小');
            $table->text('file')
                ->comment('资源文件');
            $table->tinyInteger('release')
                ->default(0)
                ->comment('是否发布0：待处理 1：发布 2：撤回');
            $table->tinyInteger('view_num')
                ->default(0)
                ->comment('查看次数');
            $table->tinyInteger('download_num')
                ->default(0)
                ->comment('下载次数');
            $table->timestamp('release_time')
                ->nullable()
                ->comment('发布时间');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}