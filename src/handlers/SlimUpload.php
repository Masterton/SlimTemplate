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
	 * @param $blobNum 当前上传的片数
	 * @param $totalBlobNum 当前文件分成的总片数
	 * @return $fileName 文件名称
	 */
	public static function upload($uploadPath, $file, $blobNum, $totalBlobNum, $fileName)
	{
        // 生成临时文件
        $tmpFileName = $fileName . '__' . $blobNum;
        $temFilePath = merge_path($uploadPath, $tmpFileName);

        if (file_exists($temFilePath)) {
        	for ($a = 1; $a <= $totalBlobNum; $a++) { 
        		$temFilePathBlob = $uploadPath . '/' . $fileName . '__' . $a;
        		if (file_exists($temFilePathBlob)) {
        			$blobNum = $a;
        		} else {
        			$ret = [
        				'complete' => 1, // 进行中
        				'blobNum' => $blobNum,
        			];
        		}
        	}
        } else {
	        //把文件移动到指定文件夹中
	        $file->moveTo($temFilePath);
        }

        $ret = [
        	'status' => 1, // 完成
    		'blobNum' => $blobNum,
    		'filePath' => '',
        ];

        //获取文件格式
        /*$ext_arr = explode('.', $file_name);
        $ext = end($ext_arr);*/

        //把文件路径和文件名称串接在一起形成完整文件路径
        
        // 如果当前传递的是文件最后一片，就合并成完整文件
        if ($blobNum == $totalBlobNum) {
        	$blob = '';
        	for ($i = 1; $i <= $totalBlobNum; $i++) { 
                $blob .= file_get_contents($uploadPath . '/' . $fileName . '__' . $i);
            }
            $filePath = $uploadPath . '/' . $fileName;
            file_put_contents($filePath, $blob);

            // 生成完整文件后删除临时文件
            if (file_exists($filePath)) {
	            for ($j = 1; $j <= $totalBlobNum; $j++) { 
		            @unlink($uploadPath . '/' . $fileName . '__' . $j);
		        }
            }
	        $ret = [
	        	'status' => 2, // 完成
        		'blobNum' => $blobNum,
        		'filePath' => $filePath,
	        ];
        }
        return $ret;
	}
}