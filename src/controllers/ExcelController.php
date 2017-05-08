<?php

namespace App\Controllers;

/**
* ExcelController
* Excel文件的导入导出
* @author Masterton <zhengcloud@foxmail.com>
* @version 1.0
* @since 1.0
*
*/
class ExcelController extends ControllerBase {

    /**
     * Excel 文件的导入
     * @param 
     * @return
     *
     */
    public function import_excel() {
        //设置excel表列的标头
		$letter = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
		//创建一个excel对象
		$PHPExcel = new PHPExcel();
		
		//判断excel 文件是什么类型
		if($type == 1){
			//excel 文件是03版
			$reader = PHPExcel_IOFactory::createReader('Excel5');
		}else if($type == 2){
			//excel 文件是07版
			$reader = PHPExcel_IOFactory::createReader('Excel2007');
		}
		
		$PHPExcel = $reader->load($filePath);
		//读取excel 文件中的第一个工作表
		$currentSheet = $PHPExcel->getSheet(0);
		//取得excel 表中最大的列号
		$allColumn = $currentSheet->getHighestColumn();
		//取得excel 表一共有多少行
		$allRow = $currentSheet->getHighestRow();
		//把字母列转换为数字列 如：AA变为27
		$allColumn = PHPExcel_Cell::columnIndexFromString($allColumn);

		//声明空数组存放excel 表导入的数据
		$data = array();
		
		//遍历数据中的每一条记录
		for ($row = 1; $row <= $allRow; $row++){
			//声明空数组存放每一条里的每一项数据
			$record = array();
			//遍历每一条记录中的每一项
			for ($col = 0; $col < $allColumn; $col++){
				//获取指定(行,列)里的数据
				$value = $PHPExcel->getActiveSheet()->getCell($letter[$col].$row)->getValue();
				array_push($record, $value);//把每一项写入数组
			}
			array_push($data, $record);//把每一条记录写入数组
			array_filter($data);//去掉数组中空的数据
		}
		return $data;
    }

    /**
     * Excel 文件的导出
     * @param $data 需要导出的数据集合
     * @param $title 设置导出Excel文件的文件名
     * @param $header 设置
     * @return
     *
     */
    public function export_excel($data, $title, $header=[]) {
        //创建一个excel对象
		$objExcel = new PHPExcel();
		//设置excel表列的标头
		$letter = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
		//设置每一列的title
		//$header = array('姓名', '性别', '年龄', '电话', '地址', '学校');
		
		
		//把每一列的title写入到excel表中
		for ($m = 0; $m < count($header); $m++) {
			$objExcel->getActiveSheet()->setCellValue("$letter[$m]1", "$header[$m]");//把数据写入对应的(行,列)中
		}
		
		//把需要导出到excel表中的数据遍历写入到excel表中
		for ($n = 2; $n < count($data)+2; $n++) {
			$j = 0;
			foreach ($data[$n-2] as $key => $value){
				$objExcel->getActiveSheet()->setCellValue("$letter[$j]$n", "$value");//把数据写入对应的(行,列)中
				$j++;
			}
		}
		
		//创建excel输出对象
		$write = new PHPExcel_Writer_Excel5($objExcel);
		//$write = new PHPExcel_Writer_Excel2007($objExcel);
		
		//实现特定的指令如：Pragma: no-cache
		header("Pragma: public");//?需要进一步查询资料
		header("Expires: 0");//指定当前缓存的文档在什么时候被认为过期
		
		header("Cache-Control: must-revalidate, post-check=0, pre-check=0");//禁用浏览器缓存
		header("Content-Type: application/force-download");//设置为强制下载
		header("Content-Type: application/vnd.ms-execl");//设置为xls文件
		
		/**
		 * 设置下载
		 * 
		 */
		header("Content-Type: application/octet-stream");//设置内容类型
		header("Content-Type: application/download");//设置为下载
		header("Content-Disposition: attachment; filename='$title'");//设置被下载的文件名
		header("Content-Transfer-Encoding: binary");//设置传输方式
		$write->save("php://output");//在浏览器下载文件
    }
}