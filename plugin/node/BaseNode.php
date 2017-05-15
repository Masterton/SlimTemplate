<?php
/**
 * 单一节点的操作.
 * User: adolph
 * Date: 17-5-11
 * Time: 下午4:53
 */
namespace plugin\node;

use App\Models\Flow;
use App\Models\Project;
use App\Models\Role_c;
use App\Models\SubFlow;
use App\Models\User;
use App\Models\WorkFlow;
use App\Models\WorkFlowUR;
use App\Models\WorkStep;

abstract class BaseNode{
    /**
     * 节点数据.
     * @var array
     */
    protected $_data ;

    protected $error_msg = '';

    /**
     * BaseNode constructor.
     * 初始化节点信息.
     * @param $work_num
     */
    public function __construct($work_num)
    {
        $this->query($work_num);
    }

    /**
     * 获取初始化的节点属性.如果不对,请改写query方法.
     * @param $work_num
     * @throws \Exception
     */
    protected function query($work_num){
        $work_step = WorkStep::join('node','node.node_num','=','work_step.current_node')
//            ->select(['node.*','work_step.*'])
            ->where(['work_num'=>$work_num])
            ->get();
        if($work_step->count()){
            $work_step = $work_step->first()->toArray();
            $this->_data = $work_step;
        }else{
            throw new \Exception('找不到当前步骤');
        }
    }
    /**
     * 功能点.
     * 检查权限.
     * 是否是当前流程中最后一个节点.
     * 获取当前节点操作角色.
     * 创建节点.
     */

    /**
     * 获取节点字段信息.
     * @return string
     */
    public function getFiled(){
        return $this->controls;
    }

    /**
     * 节点填写的检查条件.
     * @return mixed
     */
    abstract public function checkCondition();

    /**
     * 节点创建.
     * @return mixed
     */
    abstract public function create($data = null);

    /**
     * 节点提交.
     * @return mixed
     */
    abstract public function submit();

    /**
     * 获取当前节点角色的操作列表.
     * @return bool | array
     */
    public function getRole(){
        $operator_ids = $this->operator;
        if(empty($operator_ids)){
            return false;
        }else{
            // 查询角色列表并且返回.
            $operator_ids = explode(',',$operator_ids);
            $operators = Role_c::whereIn('id',$operator_ids)->get();
            if($operators->count()){
                return $operators->toArray();
            }else{
                return false;
            }
        }
    }

    /**
     * 判断是否是流程中最后一个节点.
     * @return bool
     */
    public function isLast(){
        // 判断是否是当前流程钟最后一个节点.
        // 子流程id
        $sub_flow = $this->sub_flow;
        if(empty($sub_flow)){
            // 查询流程模型ID
            $flow_num = WorkFlow::where(['work_flow'=>$this->work_flow])->pluck('model_flow');
        }else{
            $flow_num = SubFlow::where(['sub_flow'=>$sub_flow])->pluck('model_flow');
        }
        $flow = Flow::where(['flow_num'=>$flow_num])->first();
        return $flow->last_node === $this->current_node;
    }

    /**
     * 返回错误信息.
     * @return string
     */
    public function getErrorMsg(){
        return $this->error_msg;
    }

    public function __get($name)
    {
        if(array_key_exists($name,$this->_data)){
            return $this->_data[$name];
        }else{
            throw new \Exception('未知的属性');
        }
    }

    public function __isset($name)
    {
        if(array_key_exists($name,$this->_data)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 检查指定的用户是否有该节点的操作权限.
     * @param null $user_id
     * @return boolean
     */
    public function checkPerm($user_id = null){
        if(empty($user_id)){
            $user_id = $this->user_id;
        }
        // 查询用户在该项目中的角色.用户编码.
        $ucode = User::where(['id'=>$user_id])->pluck('ucode');
        $project_num = WorkFlow::where(['work_flow'=>$this->work_flow])->pluck('project_num');
        if(empty($project_num)){
            $this->error_msg = '没有找到该项目!或该项目已经被删除!';
            return false;
        }else{
            $operator = explode(',',$this->operator);
            $operator = array_filter($operator);
            // 查询角色
            $result = WorkFlowUR::where(['ucode'=>$ucode,'project_num'=>$project_num,'work_flow'=>$this->work_flow])
                ->whereIn('role_id',$operator)
                ->get();
            if($result->count()){
                return true;
            }else{
                $this->error_msg = '没有找到该角色.';
                return false;
            }
        }
    }
}