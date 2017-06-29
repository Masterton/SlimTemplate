<?php

namespace App\Models;

/**
* Account model
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-29 16:38:49
*
*/
class Account extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'account';
    /**
     * Indicates if the model should be timestamped.
     * @var bool
     */
    public $timestamps = true;
    protected $datas = ['deleted_at'];
}