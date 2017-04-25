$('[data-toggle="tooltip"]').tooltip();

// 获取文件信息
var info = getFileInfo();
// 显示文件名
$('#file-name').text(info.name);
// 显示文件版本列表
showFileVersions(info);

bindOperation();