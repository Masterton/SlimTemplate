<?php
namespace plugin\standard;

interface Node{

    // 下一个节点.
    public function next();

    // 获取当前节点.
    public function current();

    // 获取上一个节点.
    public function prev();

    // 节点保存.
    public function save();
}