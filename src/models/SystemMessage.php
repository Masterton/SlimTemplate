<?php

namespace App\Models;

/**
* SystemMessage model
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class SystemMessage extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'system_message';
    /**
     * Indicates if the model should be timestamped.
     * @var bool
     */
    public $timestamps = true;
    protected $datas = ['deleted_at'];
}