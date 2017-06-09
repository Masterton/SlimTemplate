<?php 

namespace App\Handlers;

/**
 * Upload 文件上传
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @time 2017-6-7 10:42:02
 *
 */
class Upload
{
	/**
     * 上传路径
     * @var string
     */
    private $uploadPath;

    /**
     * 临时文件目录
     * @var string
     */
    private $tmpPath;

    /**
     * 第几个文件块
     * @var bool
     */
    private $blobNum;

    /**
     * 文件块总个数
     * @var bool
     */
    private $totalBlobNum;

    /**
     * 文件名
     * @var string
     */
    private $fileName;

    /**
     * @param $uploadPath string
     * @param $tmpPath string
     * @param $blobNum bool
     * @param $totalBlobNum bool
     * @param $fileName string
     */
    public function __construct($uploadPath, $tmpPath, $blobNum, $totalBlobNum, $fileName)
    {
        $this->uploadPath = $uploadPath;
        $this->tmpPath = $tmpPath;
        $this->blobNum = $blobNum;
        $this->totalBlobNum = $totalBlobNum;
        $this->fileName = $fileName;
    }

    /**
     * slice upload file
     * @param 
     * @param
     * @return
     */
    public function sliceUpload()
    {
        $this->touchDir();
        $filename = $this->uploadPath . '/' . $this->fileName . '__' . $this->blobNum;
        move_uploaded_file($this->tmpPath, $filename);
        $this->fileMerge();
        //return $this->apiReturn();
    }

    /**
     * 判断是否是最后一块，如果是则进行文件合成并且删除文件块
     *
     */
    public function fileMerge()
    {
        if ($this->blobNum == $this->totalBlobNum) {
            $blob = '';
            for ($i = 1; $i <= $this->totalBlobNum; $i++) { 
                $blob .= file_get_contents($this->uploadPath . '/' . $this->fileName . '__' . $i);
            }
            file_put_contents($this->uploadPath . '/' . $this->fileName, $blob);
            $this->deleteFileBlob();
        }
    }

    /**
     * 删除文件块
     *
     */
    public function deleteFileBlob()
    {
        for ($i = 1; $i < $this->totalBlobNum; $i++) { 
            @unlink($this->uploadPath . '/' . $this->fileName . '__' . $i);
        }
    }

    /**
     * 每片上传返回的结果
     *
     */
    public function apiReturn()
    {
        if ($this->blobNum == $this->totalBlobNum) {
            if (file_exists($this->uploadPath . '/' . $this->fileName . '__' . $this->blobNum)) {
                $ret = [
                    'status' => '2',
                    'msg' => 'success',
                    'file_path' => 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['DOCUMENT_URI']).str_replace('.','',$this->filepath).'/'. $this->fileName,
                ];
            }
        } else {
            if (file_exists($this->filepath . '/' . $this->fileName . '__' . $this->blobNum)) {
                $ret = [
                    'status' => '1',
                    'msg' => 'waiting for all',
                    'file_path' => '',
                ];
            }
        }
        return $ret;
    }

    /**
     * 新建上传文件夹(如果没有当前目录，就新建)
     *
     */
    public function touchDir()
    {
        if (!file_exists($this->uploadPath)) {
            return mkdir($this->uploadPath, 0777, true);
        }
    }
}