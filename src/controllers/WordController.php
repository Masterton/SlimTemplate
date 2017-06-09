<?php

namespace App\Controllers;

use \Slim\Http\Request;
use \Slim\Http\Response;
use \App\Handlers\Word;

/**
* WordController
* Word文件的导入导出
* @author Masterton <zhengcloud@foxmail.com>
* @version 1.0
* @since 1.0
*
*/
class WordController extends ControllerBase
{

    public function index(Request $request, Response $response, $args=[])
    {
        $result = [
            'title' => 'word文件上传',
        ];
        return $this->ci->get('twig')->render($response, 'home/pages/list.twig', $result);
    }
    /**
     * 下载word文件
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function download(Request $request, Response $response, $args=[])
    {
        //设置PHP内存
        ini_set('memory_limit','512M');
        set_time_limit(1200);

        $header = array('姓名', '性别', '年龄', '电话', '地址', '学校', '照片');
        $data1 = [
            ['张三', '男', '25', '15666666666', '重庆市', '重庆大学', '55555'],
            ['张挥洒', '男', '25', '15633333333', '北京市', '北京大学', '55555'],
            ['王世安', '男', '26', '15655555555', '上海市', '上海大学', '55555'],
            ['李光复', '男', '44', '15677777777', '杭州市', '杭州大学', '55555'],
            ['赵构', '男', '78', '15688888888', '天津市', '天津大学', '55555'],
        ];
        $data = [];
        for ($i = 0; $i < 3000; $i++) { 
            $data = array_merge($data, $data1);
        }
        $title = '这是一个测试.docx';
        $word = Word::exportWord($data, $title, $header);
    }

    /**
     * 读取word文件里面的内容
     *
     *
     */
    public function readerWord(Request $request, Response $response, $args=[])
    {
        //设置PHP内存
        ini_set('memory_limit','512M');
        set_time_limit(1200);

        $params = $request->getParams();
        $file = $request->getUploadedFiles();
        $aa = $this->uploadFile($file['file']);
        $base_path = $this->ci->get('settings')['base_path'];
        $filePath = merge_path($base_path, $aa);

        $result = [];
        if (file_exists($filePath)) {
            //$result = Word::importWord($filePath);
            $result = ['成功'];
        }
        print_r("<pre>");
        print_r($result);    
    }

    /**
     * 单文件上传文件
     * @param $file 上传的文件数据
     * @param $fileFormat 允许上传的文件格式
     * @return $ret 生成的文件名或者是错误原因
     *
     */
    public function uploadFile($file, $fileFormat=[])
    {
        if (!empty($file)) {
            if ($file instanceof \Psr\Http\Message\UploadedFileInterface) {
                if ($file->getError() === \UPLOAD_ERR_OK) {

                    //获取文件名称
                    $file_name = $file->getClientFilename();

                    //获取文件格式
                    $ext_arr = explode('.', $file_name);
                    $ext = end($ext_arr);

                    //判断是不是允许上传的文件格式
                    if (empty($fileFormat) || in_array($ext, $exts_img)) {

                        //获取上传保存的路径和文件夹，并合并为完整文件夹的路径
                        $base_path = $this->ci->get('settings')['base_path'];
                        $upload_folder = $this->ci->get('settings')['upload_folder'];
                        $folder = merge_path($base_path, $upload_folder);

                        //获取当前unix时间戳，并精确到小数点后5位
                        $ts_str = sprintf('%.5f', microtime(true));
                        //进行md5加密生成文件名，再连接文件类型，形成完整的文件名
                        $new_name = md5($ts_str) . '.' . $ext;

                        //把文件路径和文件名称串接在一起形成完整文件路径
                        $path = merge_path($folder, $new_name);

                        //把文件移动到指定文件夹中
                        $file->moveTo($path);
                        //保存到数据库的地址
                        $paths = merge_path('/'.$upload_folder, $new_name);
                        $ret = $paths;
                    } else {
                        $ret = '仅支持 ' . implode('、', $exts_img) . ' 格式的文件上传';
                    }
                } else {
                    $ret = '上传错误';
                }
            } else {
                $ret = '获取文件失败, 请重试';
            }
        } else {
            $ret = '文件未找到';
        }
        return $ret;
    }
}