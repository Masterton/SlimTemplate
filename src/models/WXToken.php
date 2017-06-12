<?php

namespace App\Models;

/**
* Menu Model
*/
class WXToken extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'wx_token';
    /**
     * Indicates if the model should be timestamped.
     * @var bool
     */
    public $timestamps = true;
    protected $datas = ['deleted_at'];
}