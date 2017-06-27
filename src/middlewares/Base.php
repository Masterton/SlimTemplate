<?php

namespace App\Middlewares;

/**
 * 中间件基类
 */
class Base {
    protected $app;
    protected $container;
    protected $logger;
    protected $db;

    public function __construct(\Slim\App $app)
    {
        $this->app = $app;
        $this->container = $app->getContainer();
        $this->logger = $this->container->get('logger');
        $this->db = $this->container->get('db'); // 实例化数据模型
    }
}