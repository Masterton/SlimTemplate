<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Model Base
 * @method static Builder  where($column, $operator = null, $value = null, $boolean = 'and'):
 * @todo Model只是抽象类,里面并没有where方法.具体的说为什么可以调用where方法?怎么实现的?
 */
class Base extends Model
{
	use SoftDeletes;
}