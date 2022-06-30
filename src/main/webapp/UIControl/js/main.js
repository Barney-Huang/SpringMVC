
/* 显示遮罩层 */
function showMask() {
    $("#mask").height(document.body.scrollHeight);
    $("#mask").width(document.body.scrollWidth);
    // fadeTo第一个参数为速度，第二个为透明度
    // 多重方式控制透明度，保证兼容性，但也带来修改麻烦的问题
    $("#mask").fadeTo(200, 0.5);
    // 解决窗口缩小时放大后不全屏遮罩的问题
    // 简单来说，就是窗口重置的问题
    $(window).resize(function() {
        $("#mask").height(document.body.scrollHeight);
        $("#mask").width(document.body.scrollWidth);
    });
}
/* 隐藏遮罩层 */
function hideMask() {
    $("#mask").fadeOut(200);
}

function formatDatebox(value) {
    if (value == null || value == '') {
        return '';
    }
    var dt;
    if (value instanceof Date) {
        dt = value;
    } else {
        dt = new Date(value);
    }
    return dt.format("yyyy-MM-dd hh:mm:ss");
}