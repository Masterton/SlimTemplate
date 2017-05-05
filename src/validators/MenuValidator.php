<?php

namespace App\Validators;

/**
* MenuValidator
*/
class MenuValidator extends BaseValidator {

    // 验证uid一项
    public function query_validate(array $data) {
        $this->validate([
            'token' => [$data['token'], 'required'],
        ]);
    }

    // 验证uid、name两项
    public function add_validate(array $data) {
        $this->validate([
            'token' => [$data['token'], 'required'],
            'name' => [$data['name'], 'required'],
        ]);
    }

    // 验证uid、id、name三项
    public function modify_validate(array $data) {
        $this->validate([
            'token' => [$data['token'], 'required'],
            'id' => [$data['id'], 'required'],
            'name' => [$data['name'], 'required'],
        ]);
    }

    // 验证uid、id两项
    public function delete_validate(array $data) {
        $this->validate([
            'id' => [$data['id'], 'required'],
            'token' => [$data['token'], 'required'],
        ]);
    }
}