// 判断是否是数字
function isNumber(a) {
    return (
        (typeof a == 'number') ||
        (
            (typeof a == 'string') &&
            a.length > 0 &&
            !isNaN(a)
        )
    );
}

adjustHeight();

$(window).off('resize').on('resize', function() {
    adjustHeight();
});