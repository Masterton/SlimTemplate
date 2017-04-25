<?php

namespace App\Views;

use Slim\Http\Request;
use Slim\Http\Response;

/**
 * 管理员视图
 */
class AdminView extends \App\Controllers\ControllerBase {
    /**
     * 主页面
     */
    public function index(Request $request, Response $response, $args=[]) {
        $params = [
        	'base_url' => $this->ci->get('settings')['base_path'],
        	'name' => '414444'
        ];

        //return $this->ci->get('twig')->render($response, 'admin/pages/index.twig', $params);
        return $this->ci->get('twig')->render($response, 'base-layout.twig', $params);
        //return $this->ci->get('twig')->render($response, 'admin/layout.twig', $params);
    }
}