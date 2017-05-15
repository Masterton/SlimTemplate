<?php
/**
 * Created by PhpStorm.
 * User: adolph
 * Date: 17-5-9
 * Time: 下午5:26
 */
namespace plugin;

class Loader{

    private static $instence;
    // 所有类的静态变量.
    private static $_map = [];

    private static $autoloadFiles = [];
    // PSR-4
    private static $prefixLengthsPsr4 = [];
    private static $prefixDirsPsr4    = [];
    private static $fallbackDirsPsr4  = [];
    // PSR-0
    private static $prefixesPsr0     = [];
    private static $fallbackDirsPsr0 = [];


    public static function autoload($class)
    {
        if ($file = self::findFile($class)) {
            // Win环境严格区分大小写
            if (IS_WIN && pathinfo($file, PATHINFO_FILENAME) != pathinfo(realpath($file), PATHINFO_FILENAME)) {
                return false;
            }
            include $file;
            return true;
        }else{
            $class_info = explode('\\',$class);
            // 这里是正常的框架类.
            if(count($class_info) > 1 && $class_info[0] === 'plugin'){
                // 是否是框架目录.
                array_shift($class_info);
                $base_url = FRAME_PATH . DS .implode('/',$class_info) . EXT;
                if(is_file($base_url)){
                    self::addClassMap($class,$base_url);
                    include $base_url;
                    return true;
                }
            }
        }
    }

    /**
     * 查找文件
     * @param $class
     * @return bool
     */
    private static function findFile($class)
    {
        if (!empty(self::$_map[$class])) {
            // 类库映射
            return self::$_map[$class];
        }
        // 查找 PSR-4
        $logicalPathPsr4 = strtr($class, '\\', DS) . EXT;
        $first = $class[0];
        if (isset(self::$prefixLengthsPsr4[$first])) {
            foreach (self::$prefixLengthsPsr4[$first] as $prefix => $length) {
                if (0 === strpos($class, $prefix)) {
                    foreach (self::$prefixDirsPsr4[$prefix] as $dir) {
                        if (is_file($file = $dir . DS . substr($logicalPathPsr4, $length))) {
                            return $file;
                        }
                    }
                }
            }
        }
        // 查找 PSR-4 fallback dirs
        foreach (self::$fallbackDirsPsr4 as $dir) {
            if (is_file($file = $dir . DS . $logicalPathPsr4)) {
                return $file;
            }
        }
        // 查找 PSR-0
        if (false !== $pos = strrpos($class, '\\')) {
            // namespaced class name
            $logicalPathPsr0 = substr($logicalPathPsr4, 0, $pos + 1)
                . strtr(substr($logicalPathPsr4, $pos + 1), '_', DS);
        } else {
            // PEAR-like class name
            $logicalPathPsr0 = strtr($class, '_', DS) . EXT;
        }
        if (isset(self::$prefixesPsr0[$first])) {
            foreach (self::$prefixesPsr0[$first] as $prefix => $dirs) {
                if (0 === strpos($class, $prefix)) {
                    foreach ($dirs as $dir) {
                        if (is_file($file = $dir . DS . $logicalPathPsr0)) {
                            return $file;
                        }
                    }
                }
            }
        }
        // 查找 PSR-0 fallback dirs
        foreach (self::$fallbackDirsPsr0 as $dir) {
            if (is_file($file = $dir . DS . $logicalPathPsr0)) {
                return $file;
            }
        }
        return self::$_map[$class] = false;
    }

    /**
     * 注册自动加载方法.
     * @param string $autoload
     */
    public static function register($autoload = '')
    {
        // 注册系统自动加载
        spl_autoload_register($autoload ?: 'plugin\\Loader::autoload', true, true);

        // Composer自动加载支持
        if (is_dir(VENDOR_PATH . 'composer')) {
            self::registerComposerLoader();
        }
    }

    /**
     * 使用加载方法.用于加载不规范的类文件.
     * @param string $class     类名.
     * @param string $baseUrl   路径.
     * @param string $ext       文件后缀.
     * @return bool
     */
    public static function Load($class, $baseUrl = '', $ext = EXT){
        static $_file = [];
        $key          = $class . $baseUrl;
        $class        = str_replace(['.', '#'], [DS, '.'], $class);
        if (isset($_file[$key])) {
            return true;
        }
        if (empty($baseUrl)) {
            list($name, $class) = explode(DS, 'framework/'.$class, 2);
            if (isset(self::$prefixDirsPsr4[$name . '\\'])) {
                // 注册的命名空间
                $baseUrl = self::$prefixDirsPsr4[$name . '\\'];
            } else{
                $baseUrl = FRAME_PATH . DS ;
            }
        } elseif (substr($baseUrl, -1) != DS) {
            $baseUrl .= DS;
        }
        // 如果类存在 则导入类库文件
        if (is_array($baseUrl)) {
            foreach ($baseUrl as $path) {
                $filename = $path . DS . $class . $ext;
                if (is_file($filename)) {
                    break;
                }
            }
        } else {
            $filename = $baseUrl . $class . $ext;
        }

        if (!empty($filename) && is_file($filename)) {
            // 开启调试模式Win环境严格区分大小写
            if (IS_WIN && pathinfo($filename, PATHINFO_FILENAME) != pathinfo(realpath($filename), PATHINFO_FILENAME)) {
                return false;
            }
            include $filename;
            $_file[$key] = true;
            return true;
        }
        return false;
    }

    /**
     * 获取composer注册过的类文件.
     */
    private static function registerComposerLoader()
    {
        if (is_file(VENDOR_PATH . 'composer/autoload_namespaces.php')) {
            $map = require VENDOR_PATH . 'composer/autoload_namespaces.php';
            foreach ($map as $namespace => $path) {
                self::addPsr0($namespace, $path);
            }
        }
        if (is_file(VENDOR_PATH . 'composer/autoload_psr4.php')) {
            $map = require VENDOR_PATH . 'composer/autoload_psr4.php';
            foreach ($map as $namespace => $path) {
                self::addPsr4($namespace, $path);
            }
        }
        if (is_file(VENDOR_PATH . 'composer/autoload_classmap.php')) {
            $classMap = require VENDOR_PATH . 'composer/autoload_classmap.php';
            if ($classMap) {
                self::addClassMap($classMap);
            }
        }
        if (is_file(VENDOR_PATH . 'composer/autoload_files.php')) {
            $includeFiles = require VENDOR_PATH . 'composer/autoload_files.php';
            foreach ($includeFiles as $fileIdentifier => $file) {
                if (empty(self::$autoloadFiles[$fileIdentifier])) {
                    self::$autoloadFiles[$fileIdentifier] = true;
                }
            }
        }
    }

    /**
     * 添加psr4的类.
     * @param string $prefix   前缀
     * @param string $paths    路径
     * @param bool $prepend
     * @return void
     */
    private static function addPsr4($prefix, $paths, $prepend = false)
    {
        if (!$prefix) {
            if ($prepend) {
                self::$fallbackDirsPsr4 = array_merge(
                    (array) $paths,
                    self::$fallbackDirsPsr4
                );
            } else {
                self::$fallbackDirsPsr4 = array_merge(
                    self::$fallbackDirsPsr4,
                    (array) $paths
                );
            }
        } elseif (!isset(self::$prefixDirsPsr4[$prefix])) {
            $length = strlen($prefix);
            if ('\\' !== $prefix[$length - 1]) {
                throw new \InvalidArgumentException("A non-empty PSR-4 prefix must end with a namespace separator.");
            }
            self::$prefixLengthsPsr4[$prefix[0]][$prefix] = $length;
            self::$prefixDirsPsr4[$prefix]                = (array) $paths;
        } elseif ($prepend) {
            self::$prefixDirsPsr4[$prefix] = array_merge(
                (array) $paths,
                self::$prefixDirsPsr4[$prefix]
            );
        } else {
            self::$prefixDirsPsr4[$prefix] = array_merge(
                self::$prefixDirsPsr4[$prefix],
                (array) $paths
            );
        }
    }

    /**
     * 添加psr0的类.
     * @param string $prefix   前缀
     * @param string $paths    路径
     * @param bool $prepend
     * @return void
     */
    private static function addPsr0($prefix,$paths , $prepend = false){
        if (!$prefix) {
            if ($prepend) {
                self::$fallbackDirsPsr0 = array_merge(
                    (array) $paths,
                    self::$fallbackDirsPsr0
                );
            } else {
                self::$fallbackDirsPsr0 = array_merge(
                    self::$fallbackDirsPsr0,
                    (array) $paths
                );
            }
            return;
        }
        $first = $prefix[0];
        if (!isset(self::$prefixesPsr0[$first][$prefix])) {
            self::$prefixesPsr0[$first][$prefix] = (array) $paths;
            return;
        }
        if ($prepend) {
            self::$prefixesPsr0[$first][$prefix] = array_merge(
                (array) $paths,
                self::$prefixesPsr0[$first][$prefix]
            );
        } else {
            self::$prefixesPsr0[$first][$prefix] = array_merge(
                self::$prefixesPsr0[$first][$prefix],
                (array) $paths
            );
        }
    }

    /**
     * 保存自己的类.
     * @param string $class 类名.
     * @param string $map   路径.
     * @return void
     */
    private static function addClassMap($class, $map = '')
    {
        if (is_array($class)) {
            self::$_map = array_merge(self::$_map, $class);
        } else {
            self::$_map[$class] = $map;
        }
    }

    /**
     * 私有构造方法.
     * Loader constructor.
     */
    private function __construct(){
    }

    /**
     * 私有克隆方法.
     */
    private function __clone()
    {
        // TODO: Implement __clone() method.
    }
}