<?php

namespace App\Controllers;


use plugin\Node;
use \Email\Email;
/**
* TestController
*/
class TestController extends ControllerBase {

    /**
     * 获取菜单列表
     * @param $data 参数
     * @return $result 结果
     *
     */
    public function test_node_method(\Slim\Http\Request  $request, \Slim\Http\Response  $response, $args=[]) {
        //$node = new Node(['driver'=>'Edit'],['work_num'=>'0000000000000025','user_id'=>1,'content'=>null]);
        //var_dump($node->prev());exit;

        $mail = new \PHPMailer;

        $mail->isSMTP();                                      // Set mailer to use SMTP
        $mail->Host = 'smtp.qq.com';  // Specify main and backup SMTP servers
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = '';                 // SMTP username
        $mail->Password = '.';                           // SMTP password
        $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Port = 587;                                    // TCP port to connect to

        $mail->setFrom('@qq.com', 'Mailer');
        $mail->addAddress('@qq.com', 'Joe User');     // Add a recipient
        //$mail->addAddress('ellen@example.com');               // Name is optional
        //$mail->addReplyTo('info@example.com', 'Information');
        //$mail->addCC('cc@example.com');
        //$mail->addBCC('bcc@example.com');

        //$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
        //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
        $mail->isHTML(true);                                  // Set email format to HTML

        $mail->Subject = 'Here is the subject';
        $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
        $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

        /*print_r("<pre>");
        print_r($mail);
        exit;*/

        if(!$mail->send()) {
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
        

        
    }
}