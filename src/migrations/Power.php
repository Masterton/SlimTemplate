<?php

namespace App\Migrations;

/**
* Power Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Power extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->tinyInteger('group_id')
                ->comment('用户组id');
            $table->text('route')
                ->comment('接口名称集合');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}