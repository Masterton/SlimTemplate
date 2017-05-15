<?php

namespace plugin;

class Node{

    private $driver;

    private $config = [];

    private $driver_config = [
        'Check','Edit'
    ];

    private $base_path = __DIR__ . '/node/driver';

    public function __construct($config,$param)
    {
        $this->config = array_merge($this->config,$config);
        if(array_key_exists('driver',$this->config) && in_array($this->config['driver'],$this->driver_config)){
            // 这里自动引入节点类.
            if($this->autoload($this->config['driver'])){
                $this->driver = new $this->config['driver']($param);
            }else{
                throw new \Exception('未知的驱动.');
            }
        }else{
            throw new \Exception('节点配置不正确.');
        }
    }

    /**
     * 加载对应驱动的类型.
     * @param $driver
     * @return bool
     */
    public function autoload($driver){
        $path = $this->base_path .DS .$driver .EXT;
        if(is_file($path)){
            require $path;
            return true;
        }else{
            return false;
        }
    }

    /**
     * 使用魔术方法来传递用户的参数.
     * @param string $name      方法名
     * @param array $arguments  参数对象
     * @throws \Exception
     */
    public function __call($name, $arguments)
    {
        // 查询访问的方法.
        $method = get_class_methods($this->driver);
        if(in_array($name,$method)){
            // 这里得到传递的参数节点
            return call_user_func_array([$this->driver,$name],$arguments);
        }else{
            throw new \Exception('该方法不存在!');
        }
    }

    /**
     * 获取节点操作字段.
     * @return mixed
     */
    public function getAllOper(){
        return $this->driver->getFiled();
    }
}