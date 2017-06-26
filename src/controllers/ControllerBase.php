<?php
namespace App\Controllers;

use Illuminate\Database\Eloquent\Builder;

/**
 * ControllerBase
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @since 1.0
 * @time 2017-5-20 13:51:47
 */
class ControllerBase
{
    protected $container;
    /** @var Builder $db */
    protected $db;

    public function __construct(\Interop\Container\ContainerInterface $ci)
    {
        $this->container = $ci;
        // 加载DB容器
        $this->db = $ci->get('db');
    }
}