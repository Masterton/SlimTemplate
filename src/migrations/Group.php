<?php

namespace App\Migrations;

/**
* Group Table Migration
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Group extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('name', 128)
                ->comment('组名');
            $table->text('comment')
                ->nullable()
                ->comment('备注');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}