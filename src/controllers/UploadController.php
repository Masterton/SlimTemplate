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
		$params = $request->getParams(); // 获取参数
		$file = $request->getUploadedFiles()['file']; // 获取上传的文件

		$blobNum = array_get($params, 'blob_num'); // 当前文件块数
		$totalBlobNum = array_get($params, 'total_blob_num'); // 总的文件快熟
		$fileName = array_get($params, 'file_name'); // 文件名称

		//获取上传保存的路径和文件夹，并合并为完整文件夹的路径
        $base_path = $this->ci->get('settings')['base_path'];
        $upload_folder = $this->ci->get('settings')['upload_folder'];
        $folder = merge_path($base_path, $upload_folder); // 存放文件的目录

		$result = SlimUpload::upload($folder, $file, $blobNum, $totalBlobNum, $fileName);

		return $response->withJson($result);
	}
}