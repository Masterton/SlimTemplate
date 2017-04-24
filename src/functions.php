<?php
/**
 * 根据键从数组中获取元素
 *
 * @param $array 数组
 * @param $key   键
 * @param 默认值    default [null]
 *
 * @return mixed
 */
if (!function_exists('array_get')) {
    function array_get($array, $key, $default = null)
    {
        if (is_array($array) && array_key_exists($key, $array)) {
            return $array[$key];
        }

        return $default;
    }
}
/**
 * 文本加密
 *
 * @param $str
 */
function text_encrypt($str, $secret = 'author is gsw945 of cloudkz')
{
    $result = md5($str) + $secret;
    $rand = 5;
    for ($i = 0; $i < $rand; $i++) {
        if ($i % 2 == 0) {
            $result = sha1($result);
        }
    }

    return md5($result);
}

/**
 * 判断字符串是否只包含数字
 * @param $str 字符串
 */
function text_is_number($str) {
    return preg_match('/^\d+$/', $str);
}

/**
 * 获取对称加密
 *
 * @param $secret 密钥
 */
function getAESCrypt($secret)
{
    $crypto = new \phpseclib\Crypt\AES(\phpseclib\Crypt\AES::MODE_CBC);
    $symkey = generateSymmetricKey($secret, 32);
    $crypto->setKey($symkey);
    $crypto->setIV(str_repeat("\0", $crypto->getBlockLength() >> 3));
    $crypto->enablePadding();

    return $crypto;
}

/**
 * 生成对称密钥
 *
 * @param $str    生成秘钥的字符串
 * @param $length 密钥长度
 */
function generateSymmetricKey($str, $length)
{
    $symkey = '';
    $sequence = 0;
    while (strlen($symkey) < $length) {
        $temp = pack('Na*', $sequence++, $str);
        $symkey .= \ParagonIE\ConstantTime\Hex::decode(sha1($temp));
    }

    return substr($symkey, 0, $length);
}

/**
 * 获取完整的绝对路径(去掉路径中的'./'和'../')
 *
 * @param $path 给定的路径 (例如: __DIR__ . '/../public/upload', 得到'/home/user/path/run/public/upload')
 */
function full_path($path)
{
    $DS = DIRECTORY_SEPARATOR;
    $path = explode($DS, $path);
    $new = [];
    foreach ($path as $dir) {
        if (!strlen($dir)) {
            continue;
        }
        switch ($dir) {
            case '..':
                array_pop($new);
            case '.':
                break;
            default:
                $new[] = $dir;
                break;
        }
    }

    return $DS.implode($DS, $new);
}

/**
 * 合并路径
 *
 * @param $path1 路径1
 * @param $path2 路径2
 */
function merge_path($path1, $path2)
{
    while (ends_with($path1, '/') && strlen($path1) > 0) {
        $path1 = substr($path1, 0, -1);
    }
    while (starts_with($path2, '/') && strlen($path2) > 0) {
        $path2 = substr($path2, 1);
    }
    $paths = [];
    if (!empty($path1)) {
        $paths[] = $path1;
    }
    if (!empty($path2)) {
        $paths[] = $path2;
    }

    return implode('/', $paths);
}

/**
 * 判断字符串是否以某一子字符串开头
 *
 * @param $haystack 字符串
 * @param $needle   子字符串
 */
if (!function_exists('starts_with')) {
    function starts_with($haystack, $needle)
    {
        // search backwards starting from haystack length characters from the end
        return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== false;
    }
}
/**
 * 判断字符串是否以某一子字符串结尾
 *
 * @param $haystack 字符串
 * @param $needle   子字符串
 */
if (!function_exists('ends_with')) {
    function ends_with($haystack, $needle)
    {
        // search forward starting from end minus needle length characters
        return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos(
                    $haystack,
                    $needle,
                    $temp
                ) !== false);
    }
}
/**
 * json_last_error_msg (PHP 5 >= 5.5.0, PHP 7)
 */
if (!function_exists('json_last_error_msg')) {
    function json_last_error_msg()
    {
        if (!defined('JSON_ERROR_RECURSION')) {
            define('JSON_ERROR_RECURSION', 6);
        }
        if (!defined('JSONSON_ERROR_INF_OR_NAN')) {
            define('JSONSON_ERROR_INF_OR_NAN', 7);
        }
        if (!defined('JSONSON_ERROR_UNSUPPORTED_TYPE')) {
            define('JSONSON_ERROR_UNSUPPORTED_TYPE', 8);
        }
        $ERRORS = [
            JSON_ERROR_NONE                => 'No error',
            JSON_ERROR_DEPTH               => 'Maximum stack depth exceeded',
            JSON_ERROR_STATE_MISMATCH      => 'State mismatch (invalid or malformed JSON)',
            JSON_ERROR_CTRL_CHAR           => 'Control character error, possibly incorrectly encoded',
            JSON_ERROR_SYNTAX              => 'Syntax error',
            JSON_ERROR_UTF8                => 'Malformed UTF-8 characters, possibly incorrectly encoded',
            JSON_ERROR_RECURSION           => 'One or more recursive references in the value to be encoded PHP 5.5.0',
            JSONSON_ERROR_INF_OR_NAN       => 'One or more NAN or INF values in the value to be encoded    PHP 5.5.0',
            JSONSON_ERROR_UNSUPPORTED_TYPE => 'A value of a type that cannot be encoded was given',
        ];
        $error = json_last_error();

        return isset($ERRORS[$error]) ? $ERRORS[$error] : 'Unknown error';
    }
}
/**
 * 判断字符串是否是json格式
 *
 * @param $str 要判断的字符串
 */
function text_is_json($str)
{
    json_decode($str);
    $error = json_last_error();
    $msg = json_last_error_msg();

    return [
        'ok'    => ($error == JSON_ERROR_NONE),
        'error' => $msg,
    ];
}

function base_path($request)
{
    return rtrim(str_ireplace('index.php', '', $request->getUri()->getBasePath()), '/');
}

//格式化返回信息
function msg($data = [], $desc = '服务器连接成功', $error = 0, $src = '')
{
    return ['error' => $error, 'desc' => $desc, 'data' => $data, 'src' => $src];
}

//处理字符串多余逗号
function str_pro( $str='' ){
    if( !empty($str) ){
        $str = str_replace(',,', ',', $str);
        $length = strlen($str);
        if ($str[$length - 1] !== ',')
        {
            $str .= ',';
        }
        if ($str[0] == ',')
        {
            $str = substr($str, 1, $length - 1);
        }
        return $str;
    }else{
        return null;
    }
}