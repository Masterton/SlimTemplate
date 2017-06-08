<?php 

namespace App\Handlers;

use \PhpOffice\PhpWord\PhpWord;
use \PhpOffice\PhpWord\IOFactory;

/**
 * Word Word 文档操作模型（上传、下载）
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @time 2017-6-7 10:38:45
 *
 */
class Word
{
	/**
	 * 导入word文档
	 * @param $filePath 文件路径
	 * @param $type word版本类型
	 * @return $data 导入的数据
	 */
	public static function importWord($filePath, $type)
	{	

	}

	/**
	 * 下载word文档
	 * @param $data 导出的数据
	 * @param $title 导出的文件名
	 * @param $header 导出问价你的标头信息
	 * @return 导出的文件 
	 */
	public static function exportWord($data, $title, $header)
	{
		/*print_r("yes");
		exit;*/
		// 定义table样式
		$styleTable = [
            'borderSize' => 8,
            'borderColor' => '000000',
            'cellMargin' => 80
        ];

        // 定义第一行样式
        $styleFirstRow = [
            'borderBottomSize' => 18,
            'borderBottomColor' => '000000',
            'bgColor' => '66BBFF'
        ];

        $styleCell = ['valign' => 'center'];//定义列样式
        $fontStyle = ['bold' => true, 'align' => 'center'];//为第一行定义字体样式
        //$phpWord->addTableStyle('GSP', $styleTable);//添加table样式
        //$phpWord->addFontStyle('header', ['size' => 22, 'bold' => true, 'name' => 'Times New Roman']);//添加字体样式
        //$section = $phpWord->addSection();//添加默认页

		$phpWord = new PhpWord();
		
		$phpWord->addTableStyle('GSP', $styleTable);//添加table样式
        $phpWord->addFontStyle('header', ['size' => 22, 'bold' => true, 'name' => 'Times New Roman']);//添加字体样式
        /*print_r("<pre>");
        print_r($phpWord);
        exit;*/
        $section = $phpWord->addSection();//添加默认页
        $headerTextRun = $section->addTextRun(['align' => 'center']);
        $headerTextRun->addText('教师教育学院gsp素质拓展成绩表', 'header');
        $section->addTextBreak(1);
        $nameTextRun = $section->addTextRun();
        $nameTextRun->addText('姓名:' . '张三' . '     班级:' . '三年一班' . '   年级:' . '一年级' . '  专业:' . '学前教育' . '  学号：' . '222');
        $table = $section->addTable('GSP');
        $table->addRow(400);
        $table->addCell(1500, $styleCell)->addText('拓展平台', $fontStyle);
        $table->addCell(1500, $styleCell)->addText('能力模块', $fontStyle);
        $table->addCell(1500, $styleCell)->addText('参加项目', $fontStyle);
        $table->addCell(1000, $styleCell)->addText('项目级别', $fontStyle);
        $table->addCell(1500, $styleCell)->addText('等级或获奖情况', $fontStyle);
        $table->addCell(1000, $styleCell)->addText('参加时间', $fontStyle);
        $table->addCell(1000, $styleCell)->addText('获得学分', $fontStyle);

        $xmlWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
        //$xmlWriter->save($output_file_path);//生成文件
        $type = 'doc';
		Download::download($title, $type);
		$xmlWriter->save("php://output");//在浏览器下载文件
	}
}