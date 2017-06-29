<?php

namespace App\Migrations;

/**
* Access Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-29 14:13:29
*
*/
class Access extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('url', 255)
                ->comment('访问页面');
            $table->tinyInteger('year')
                ->comment('访问时间/年');
            $table->tinyInteger('month')
                ->comment('访问时间/月');
            $table->tinyInteger('day')
                ->comment('访问时间/日');
            $table->tinyInteger('hour')
                ->comment('访问时间/时');
            $table->tinyInteger('minute')
                ->comment('访问时间/分');
            $table->tinyInteger('second')
                ->comment('访问时间/秒');
            $table->bigInteger('time')
                ->comment('访问时间/时间戳');
            $table->bigInteger('microtime')
                ->comment('访问时间/微秒');
            $table->bigInteger('accurate_time')
                ->comment('秒数加微秒数的具体时间');
            $table->string('ip', 64)
                ->comment('访问ip地址');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}