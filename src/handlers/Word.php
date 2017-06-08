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
	 * @param $type word版本类型(Word2007, Word5)
	 * @return $data 导入的数据
	 */
	public static function importWord($filePath, $type)
	{
        $wordReader = IOFactory::createReader($type);
        $PhpWord = $wordReader->load($filePath);
	}

	/**
	 * 下载word文档 (默认的只有一个表单)
	 * @param $data 导出的数据
	 * @param $title 导出的文件名
	 * @param $header 导出问价你的标头信息
	 * @return 导出的文件 
	 */
	public static function exportWord($data, $title, $header)
	{
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

        // 定义单元格样式
        $styleCell = [
        	'valign' => 'center'
        ];
        // 定义单元格字体样式
        $fontStyle = [
	        'bold' => true,
	        'align' => 'center'
        ];

        // 定义标题字体样式
        $headerStyle = [
        	'size' => 22,
        	'bold' => true,
        	'name' => 'Times New Roman'
        ];

		$phpWord = new PhpWord();
		
		$phpWord->addTableStyle('WordTable', $styleTable); // 添加table样式
        $phpWord->addFontStyle('header', $headerStyle); // 添加字体样式
        $section = $phpWord->addSection();//添加默认页

        //$phpWord->setDefaultFontName('仿宋'); // 设置全局字体
        //$phpWord->setDefaultFontSize(16);     // 设置全局字号为3号


        $headerTextRun = $section->addTextRun(['align' => 'center']); // 添加一行文本输入，可设置样式
        $headerTextRun->addText('这是一个测试表', 'header'); // 添加文本

        $section->addTextBreak(1); // 添加换行符，中间间隔多少行

        $nameTextRun = $section->addTextRun();
        $nameTextRun->addText('姓名:' . '张三' . '     班级:' . '三年一班' . '   年级:' . '一年级' . '  专业:' . '学前教育' . '  学号：' . '222');

        $table = $section->addTable('WordTable'); // 添加table表

        $table->addRow(400); // 添加一行并设置行高
        for ($i = 0; $i < count($header); $i++) { 
        	$table->addCell(1200, $styleCell)->addText($header[$i], $fontStyle); // 添加一列并设置列宽、样式，并添加信息
        }

        for ($a = 0; $a < count($data); $a++) { 
	        $table->addRow(400);
	        for ($b = 0; $b < count($data[$a]); $b++) { 
	        	$table->addCell(1000, $styleCell)->addText($data[$a][$b], $fontStyle);
	        }
        }

        //落款
        $section->addTextBreak(10);

        $luokuanTextRun1 = $section->addTextRun(['align' => 'right', 'bold' => true]);
        $luokuanTextRun1->addText('阿里巴巴');
        $section->addTextBreak(1);
        $luokuanTextRun2 = $section->addTextRun(['align' => 'right', 'bold' => true]);
        $luokuanTextRun2->addText(date('Y-m-d H:i:s'));
        $section->addPageBreak(); // 添加分页符


        $xmlWriter = IOFactory::createWriter($phpWord, 'Word2007');
        //$xmlWriter->save($output_file_path); // 生成word文件
        $type = 'doc';
		Download::download($title, $type);
		$xmlWriter->save("php://output");//在浏览器下载文件
	}
}