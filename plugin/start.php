<?php

define('DS',DIRECTORY_SEPARATOR);
// 定义框架目录
defined('FRAME_PATH') or define('FRAME_PATH' , __DIR__);
// 定义后缀名.
define('EXT','.php');
// 定义composer引入路径.
defined('VENDOR_PATH') or define('VENDOR_PATH' , FRAME_PATH . '/../vendor' . DS );
// 定义框架环境
defined('IS_WIN') or define('IS_WIN' ,DIRECTORY_SEPARATOR === '\\' ? true : false);
// 加载引入类.
require FRAME_PATH .'/Loader.php';

/*print_r(self::$prefixLengthsPsr4);
exit;*/

\plugin\Loader::register();