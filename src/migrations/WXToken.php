<?php

namespace App\Migrations;

/**
* Menu Table Migration
*/
class WXToken extends Base
{    
    public function up()
    {
        $this->schema->create($this->table_name, function(\Illuminate\Database\Schema\Blueprint $table) {
            $table->increments('id')
                ->comment('主键ID');
            $table->string('access_token', 11)
                ->comment('连接微信返回的token值');
            $table->softDeletes();
            $table->timestamps();
        });
    }
}