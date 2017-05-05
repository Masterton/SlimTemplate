<?php

namespace App\Migrations;

/**
* Base Migration
*/
class Base extends \Illuminate\Database\Migrations\Migration
{
    # https://laravel.com/docs/5.3/migrations
    public function __construct($table_name, $schema)
    {
        $this->schema = $schema;
        $this->table_name = $table_name;
    }

    public function exists()
    {
        return $this->schema->hasTable($this->table_name);
    }

    public function down()
    {
        $this->schema->drop($this->table_name);
    }
}