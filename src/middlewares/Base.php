<?php

namespace App\Middlewares;

/**
 * 中间件基类
 */
class Base {
    protected $app;
    protected $container;
    protected $logger;

    public function __construct(\Slim\App $app)
    {
        $this->app = $app;
        $this->container = $app->getContainer();
        $this->logger = $this->container->get('logger');
    }
}