<?php

namespace App\Models;

/**
* Menu Model
*/
class Route extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'route';
    /**
     * Indicates if the model should be timestamped.
     * @var bool
     */
    public $timestamps = true;
    protected $datas = ['deleted_at'];
}