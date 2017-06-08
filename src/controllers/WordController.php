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

    /**
     * 
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function download(Request $request, Response $response, $args=[])
    {
        $header = array('姓名', '性别', '年龄', '电话', '地址', '学校', '照片');
        $data = [
            ['张三', '男', '25', '15666666666', '重庆市', '重庆大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
            ['张挥洒', '男', '25', '15633333333', '北京市', '北京大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
            ['王世安', '男', '26', '15655555555', '上海市', '上海大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
            ['李光复', '男', '44', '15677777777', '杭州市', '杭州大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
            ['赵构', '男', '78', '15688888888', '天津市', '天津大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
        ];
        $title = '这是一个测试.docx';
        $excel = Word::exportWord($data, $title, $header);
    }
}