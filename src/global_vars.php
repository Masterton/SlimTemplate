<?php

/**
* GlobalVars
*/
class GlobalVars extends stdClass
{
    protected $store;

    public function __construct($init=[]) {
        $this->store = $init;
    }
    
    /**
     * 根据键添加元素
     */
    public function set($key, $value) {
        $this->store[$key] = $value;
    }

    /**
     * 根据键获取元素
     */
    public function get($key, $default=null) {
        if(array_key_exists($key, $this->store)) {
            return $this->store[$key];
        }
        return $default;
    }

    /**
     * 根据键移除子项
     */
    public function remove($key) {
        unset($this->store[$key]);
    }

    /**
     * 根据键向子项中添加(如果存在则更新)元素
     */
    public function item_push($key, $value, $sub_value=null) {
        if(!array_key_exists($key, $this->store)) {
            $this->store[$key] = [];
        }
        if(!is_null($sub_value)) {
            $sub_key = $value;
            if(!array_key_exists($sub_key, $this->store[$key])) {
                $this->store[$key][$sub_key] = $sub_value;
            }
        }
        else {
            if(!in_array($value, $this->store[$key])) {
                $this->store[$key][] = $value;
            }
        }
    }

    /**
     * 根据键从子项中移除指定的元素
     */
    public function item_remove($key, $value, $by_key=false) {
        if($by_key) {
            $index = $value;
        }
        else {
            $index = array_search($value, $this->store[$key]);
        }
        unset($this->store[$key][$index]);
    }
}