<?php 

namespace App\Handlers;

/**
 * Excel Excel 表格操作模型（上传、下载）
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @time 2017-6-7 11:34:00
 *
 */
class Excel
{
	/**
     * Excel 文件的导入
     * @param 
     * @return
     *
     */
    public function import_excel($filePath, $type)
    {
        //设置excel表列的标头
		$letter = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
		//创建一个excel对象
		$PHPExcel = new PHPExcel();
		
		//判断excel 文件是什么类型
		if ($type == 1) {
			//excel 文件是03版
			$reader = PHPExcel_IOFactory::createReader('Excel5');
		} else if($type == 2) {
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
    public static function export_excel($data, $title, $header=[])
    {
        //创建一个excel对象
		$objExcel = new PHPExcel();
		//设置excel表列的标头
		$letter = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
		//设置每一列的title
		//$header = array('姓名', '性别', '年龄', '电话', '地址', '学校');

		// 设置所有单元格默认水平垂直居中
		$objExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objExcel->getDefaultStyle()->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		
		
		//把每一列的title写入到excel表中
		for ($m = 0; $m < count($header); $m++) {
			$objExcel->getActiveSheet()->setCellValue("$letter[$m]1", "$header[$m]");//把数据写入对应的(行,列)中
		}
		
		//把需要导出到excel表中的数据遍历写入到excel表中
		for ($n = 2; $n < count($data)+2; $n++) {
			$j = 0;
			foreach ($data[$n-2] as $key => $value){
				if (file_exists($value)) {
					$objDrawing = new PHPExcel_Worksheet_Drawing();
					//$objDrawing->setName('Photo');
					//$objDrawing->setDescription('Photo');

					// 设置图片路径，只能是本地图片
					$objDrawing->setPath("$value");

					// 设置图片宽高(设置其中一个，就会进行等比缩放)
					$objDrawing->setHeight(133);
					//$objDrawing->setWidth(95);

					// 设置单元格的样式
					// 内容自适应
					//$objExcel->getActiveSheet()->getColumnDimension("$letter[$j]")->setAutoSize(true);
					// 设置单元格宽度
					$objExcel->getActiveSheet()->getColumnDimension("$letter[$j]")->setWidth(16);
					// 设置单元格高度
					$objExcel->getActiveSheet()->getRowDimension("$n")->setRowHeight(100);

					// 设置单个单元格样式（字体、颜色等）
					

					// 设置页面边距为0.5厘米 (1英寸 = 2.54厘米)
					//$margin = 1.78 / 2.54;
					//$marginritht = 1 / 3.54
					// 设置左边距
					//$objExcel->getActiveSheet()->getPageMargins("$n")->setLeft($margin);
					//$objExcel->getActiveSheet()->getPageMargins("$n")->setTop($margin);
					//$objExcel->getActiveSheet()->getPageMargins("$n")->setBottom($margin);
					//$objExcel->getActiveSheet()->getPageMargins("$n")->setRight($marginright);

					// 设置插入的单元格
					$objDrawing->setCoordinates("$letter[$j]$n");
					$objDrawing->setWorksheet($objExcel->getActiveSheet());
					$j++;
				} else {
					// 把数据写入对应的(行,列)中
					$objExcel->getActiveSheet()->setCellValue("$letter[$j]$n", "$value");
					// 设置单个单元格垂直居中
					//$objExcel->getActiveSheet()->getStyle("$letter[$j]$n")->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
					$j++;
				}
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