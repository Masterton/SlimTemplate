<?php

/**
 * SubFlow 子流程节点类型操作类
 * @author Masterton <zhengcloud@foxmail.com>
 * @version 2.0
 * @time 2017-5-15 17:12:10
 *
 */

use App\Models\Flow;
use App\Models\Role_c;
use App\Models\SubFlow as Flow_SubFlow;
use App\Models\WorkFlow;
use App\Models\WorkStep;


class SubFlow extends plugin\node\BaseNode implements plugin\standard\Node {

    protected $user_id;

    protected $save_content;

    public function __construct( $param ) {

        parent::__construct($data['work_num']);
        $this->user_id = $param['user_id'];
        $this->save_content = $param['content'];
    }

    /**
     * 获取下一节点（详细数据）
     *
     */
    public function next() {
        // TODO: Implement next() method.
    }

    /**
     * 获取当前节点（详细数据）
     *
     */
    public function current() {
        // TODO: Implement current() method.
    }

    /**
     * 获取上一节点（详细数据）
     *
     */
    public function prev() {
        // TODO: Implement prev() method.
    }

    /**
     * 节点保存（步骤数据保存）
     *
     */
    public function save() {
        // TODO: Implement save() method.
    }

    /**
     * 创建下一个节点（在步骤中创建）
     *
     */
    public function create($data = null) {
        return false;
    }

    /**
     * 节点提交（操作）
     *
     */
    public function submit() {
        // 如果不是最后一个节点,就创建节点.
        if(!$this->isLast()){
            $this->create();
        }
    }

    /**
     * 节点通过条件，根据通过条件走不通的下一节点
     *
     */
    public function checkCondition() {
        // TODO: Implement checkCondition() method.
    }

    /**
     * 审核通过（操作）
     *
     */
    public function pass() {
        //TODO: create sub_flow
    }

    /**
     * 审核不通过（操作）
     *
     */
    public function no_pass() {
        //TODO: create sub_flow
    }
}