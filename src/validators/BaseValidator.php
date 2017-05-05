<?php
namespace App\Validators;

/**
 * BaseValidator
 */
class BaseValidator extends \Violin\Violin
{
    public function __construct($db)
    {
        $this->db = $db;

        $this->rewriteRuleMessages();
    }

    /**
     * 重写规则提示信息
     */
    protected function rewriteRuleMessages()
    {
        $this->addRuleMessages(
            [
                'required'   => '{field} 必填',
                'int'        => '{field} 的值应该为整数, 不可为 {value}',
                //自定义验证
                'is_in_form' => '{field} 验证失败，未找到编号:{value}的页面',
            ]
        );
    }
}