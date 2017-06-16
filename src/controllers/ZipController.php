<?php

namespace App\Controllers;

use \ZipStream\ZipStream;
use \Slim\Http\Request;
use \Slim\Http\Response;

/**
* ZipController
* 文件打包成zip文件并下载
* @author Masterton <zhengcloud@foxmail.com>
* @version 1.0
* @since 1.0
* @time 2017-6-16 17:28:38
*
*/
class ZipController extends ControllerBase
{

    /**
     * 
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function index(Request $request, Response $response, $args=[])
    {
        # create a new zipstream object
        $zip = new ZipStream('example.zip');

        $basePath = $this->ci->get('settings')->get('base_path');
        $path = $basePath . '/' . 'index.html';

        $zip->addFileFromPath('path/src/some_image.jpg', $path);
        /*print_r($basePath);
        exit;*/

        # create a file named 'hello.txt' 
        //$zip->addFile('hello.txt', 'This is the contents of hello.txt');

        # add a file named 'some_image.jpg' from a local file 'path/to/image.jpg'
        //$zip->addFileFromPath('some_image.jpg', 'path/to/image.jpg');

        # add a file named 'goodbye.txt' from an open stream resource
        //$fp = tmpfile();
        //fwrite($fp, 'The quick brown fox jumped over the lazy dog.');
        //$zip->addFileFromStream('goodbye.txt', $fp);
        //fclose($fp);

        # finish the zip stream
        $zip->finish();
    }
}