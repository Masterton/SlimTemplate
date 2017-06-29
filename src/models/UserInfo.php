<?php

namespace App\Models;

/**
* UserInfo model
* @author Masterton <zhengcloud@foxmail.com>
* @version 0.0.1
* @since 1.0
* @time 2017-6-29 16:54:03
*
*/
class UserInfo extends Base
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_info';
    /**
     * Indicates if the model should be timestamped.
     * @var bool
     */
    public $timestamps = true;
    protected $datas = ['deleted_at'];
}