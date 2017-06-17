<?php

namespace App\Models;

/**
* Power model
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-17 11:24:48
*
*/
class Power extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'power';
    /**
     * Indicates if the model should be timestamped.
     * @var bool
     */
    public $timestamps = true;
    protected $datas = ['deleted_at'];
}