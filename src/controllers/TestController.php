<?php

namespace App\Controllers;

/**
 * TestController
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 1.0
 * @since 1.0
 *
 */
class TestController extends ControllerBase
{

    /**
     * 获取菜单列表
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function test_node_method(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[])
    {
        /*//$node = new Node(['driver'=>'Edit'],['work_num'=>'0000000000000025','user_id'=>1,'content'=>null]);
        //var_dump($node->prev());exit;

        // 实例化PHPMailer核心类
        $mail = new \PHPMailer;

        // 是否开启smtp的debug进行调试 开发环境建议开启 生产环境注释掉即可 默认关闭debug调试模式
        // $mail->SMTPDebug = 1;

        // 使用smtp鉴权方式发送邮件
        $mail->isSMTP();

        // smtp需要鉴权 这个必须是true
        $mail->SMTPAuth = true;

        // 连接qq域名邮箱的服务器地址
        $mail->Host = 'smtp.qq.com';

        // 设置使用ssl加密方式登录鉴权
        $mail->SMTPSecure = 'ssl';

        // 设置ssl连接smtp服务器的远程服务器端口号，以前的默认是25，但是现在新的好像已经不可用了 可选465或587
        $mail->Port = 465;

        // 设置smtp的helo消息头这个可有可五 内容任意
        // $mail->Helo = 'Hello smtp.qq.com Server';

        // 设置发件人的主机域 可有可无 默认为localhost 内容任意，建议使用你的域名
        // $mail->Hostname = 'http://tmall.com';

        // 设置发送的邮件的编码 可选GB2312 我喜欢utf-8 据说utf8在某些客户端下会乱码
        // $mail->CharSet = 'UTF-8';

        // 设置发件人名称（昵称）内容任意，显示在收件人邮箱的发件人地址前的发件人姓名
        // $mail->FormName = '测试';

        // smtp登录的账号，这里填入字符串格式的qq邮箱即可
        $mail->Username = '@qq.com';

        // smtp登录的密码 使用生成的授权码（就开通qq邮箱smtp生成的那个授权码）
        $mail->Password = '';

        // 设置发件人邮箱地址 这里填入上述提到的“发件人邮箱”
        // $mail->Form = '123456@qq.com';

        // 邮箱正文是否为html编码 注意此处是一个方法 不再是属性 true或false
        // $mail->isHTML(true);

        // 设置收件人邮箱地址 该方法有两个参数 第一个参数位收件人邮箱地址 第二个参数为该地址设置的昵称 不同的邮箱系统会进行自动处理变动 这里第二个参数的意义不大
        // $mail->addAddress('666666@qq.com', 'Joe User');
        //$mail->addReplyTo('info@example.com', 'Information');
        //$mail->addCC('cc@example.com');
        //$mail->addBCC('bcc@example.com');
        // $mail->setFrom('@qq.com', 'Mailer');

        // 添加多个收件人 则多次调用方法即可
        // $mail->addAddress('xxx@163.com','Zeus');

        // 为该邮件添加附件 该方法也有两个出纳号苏 第一个参数位附件存放的目录（相对目录、或绝对目录均可）第二个出纳号苏为在邮件附件中该邮件的名称
        //$mail->addAttachment('/var/tmp/file.tar.gz');
        // 该方法同样可以多次调用 上传多个附件
        //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');

        // 添加该邮箱的主题
        $mail->Subject = '这是一个测试！';
        // 添加邮件正文 上方将isHTML设置成了true，则可以是完整的html字符创 图：使用file_get_contents函数读取本地的html文件
        $mail->Body    = '这是一个测试！ <b>in bold!</b>';
        $mail->AltBody = '这是一个测试！这是一个测试！';

        print_r("<pre>");
        print_r($mail);
        exit;

        //判断发送是否成功和失败后的错误信息
        if(!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }*/
        
        $header = array('姓名', '性别', '年龄', '电话', '地址', '学校', '照片');
        $data = [
            ['张三', '男', '25', '15666666666', '重庆市', '重庆大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
            ['张挥洒', '男', '25', '15633333333', '北京市', '北京大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
            ['王世安', '男', '26', '15655555555', '上海市', '上海大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
            ['李光复', '男', '44', '15677777777', '杭州市', '杭州大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
            ['赵构', '男', '78', '15688888888', '天津市', '天津大学', '/webroot/zhengss/SlimTemplate/public/21a4462309f79052d1a480170ef3d7ca7bcbd564.jpg'],
        ];
        $title = '这是一个测试.xlsx';
        $excel = ExcelController::export_excel($data, $title, $header);
    }
}