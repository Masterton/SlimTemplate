<?php
namespace App\Handlers;

use Illuminate\Database\Eloquent\Builder;

/**
 * Handlers Base
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @since 1.0
 * @time 2017-6-27 16:23:40
 */
class Base
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