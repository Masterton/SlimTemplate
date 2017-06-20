<?php 

namespace App\Handlers;

/**
 * Upload slim框架中的文件上传
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @time 2017-6-9 14:38:18
 *
 */
class SlimUpload
{

	/**
	 * 保存文件
	 * @param $uploadPath 保存路径
	 * @param $file 文件信息
	 */
	public static function upload($uploadPath, $file)
	{
        // 根据时间和文件名生成唯一的md5（hash值）
        $fileSize = $file->getSize(); // 文件大小/byte
        $fileNameComplete = $file->getClientFilename(); // 文件名称(含后缀)
        $fileType = $file->getClientMediaType(); // 文件类型
        $fileNameArray = explode('.', $fileNameComplete);
        $fileName = $fileNameArray[0]; // 文件名称
        $fileNameSuffix = $fileNameArray[1]; // 文件后缀
        $time = time();
        $string = $time . $fileNameComplete;
        $encrypHash = md5($string); // 加密后生成的唯一文件名称

        $filePath = $uploadPath . '/' . $encrypHash . '.' . $fileNameSuffix;

        // 上传成功后返回的参数
        $result = [
            'name' => $fileName,
            'size' => $fileSize,
            'type' => $fileType,
        ];

        //把文件移动到指定文件夹中
        $file->moveTo($filePath);
        return $result;
	}
}