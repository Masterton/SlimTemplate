<?php
// DIC configuration

$container = $app->getContainer();

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], $settings['level']));
    return $logger;
};

// twig
$container['twig'] = function($c) {
    $config = $c->get('settings');
    $view = new \Slim\Views\Twig(
        $config['view']['template_path'],
        $config['view']['twig']
    );
    $basePath = rtrim(str_ireplace('index.php', '', $c['request']->getUri()->getBasePath()), '/');
    $view->addExtension(new \Slim\Views\TwigExtension($c['router'], $basePath));
    return $view;
};

// Service factory for the Eloquent ORM
$container['db'] = function ($container) {
    $capsule = new \Illuminate\Database\Capsule\Manager;
    $capsule->addConnection($container['settings']['db']);

    $capsule->setAsGlobal();
    $capsule->bootEloquent();

    $pdo = $capsule->getConnection()->getPdo();
    $tz = (new \DateTime('now', new \DateTimeZone('Asia/Shanghai')))->format('P');
    $pdo->exec("SET time_zone='$tz';");
    
    $container['pdo'] = $pdo;

    return $capsule;
};

// 全局变量读取器
$container['globals'] = function($c) {
    return new \GlobalVars();
};