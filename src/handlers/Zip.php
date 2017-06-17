<?php 

namespace App\Handlers;

use \ZipStream\ZipStream;

/**
 * Zip Zip 打包模型（处理程序）
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 0.0.1
 * @time 2017-6-7 10:42:02
 *
 */
class Zip
{
	/**
	 * 文件打包zip打包
	 * @param $name 打包成zip文件的名称
	 * @param $data 文件路径数组
	 * @return zip文件下载
	 *
	 */
    public static function zip($name, $data)
    {
        $zip = new ZipStream($name);

        # add a file named 'some_image.jpg' from a local file 'path/to/image.jpg'
        # $data = [
        #     'named' => 'path',
        # ];
        foreach ($data as $key => $value) {
            $zip->addFileFromPath($key, $value);
        }

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