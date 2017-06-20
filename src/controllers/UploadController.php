<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \App\Handlers\SlimUpload;
/**
* UploadController
* 大文件分片上传
* @author Masterton <zhengcloud@foxmail.com>
* @version 1.0
* @since 1.0
* @time 2017-6-9 13:42:46
*/
class UploadController extends ControllerBase
{
	public function upload(Request $request, Response $response, $args=[])
	{
		$file = $request->getUploadedFiles()['files']; // 获取上传的文件

		//获取上传保存的路径和文件夹，并合并为完整文件夹的路径
        $base_path = $this->ci->get('settings')['base_path'];
        $upload_folder = $this->ci->get('settings')['upload_folder'];
        $folder = merge_path($base_path, $upload_folder); // 存放文件的目录

		$result = SlimUpload::upload($folder, $file[0]);
		$result['date'] = date("Y-m-d H:i:s");

		return $response->withJson($result);
	}
}