<?php

namespace App\Middlewares;

/**
 * 微信开发网页用户授权
 */
class Access extends Base
{
    /**
     * 进行微信授权
     *
     *
     */
    public function __invoke(\Slim\Http\Request $request, \Slim\Http\Response $response, callable $next)
    {
        $response = $next($request, $response);
        return $response;
    }
}