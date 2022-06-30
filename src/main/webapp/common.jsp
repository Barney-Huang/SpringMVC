<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
    System.out.println("common.jsp : " + basePath);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <base href="<%=basePath%>">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <link rel="stylesheet" type="text/css" href="UIControl/css/new.css" />
    <link rel="stylesheet" type="text/css" href="UIControl/css/icon.css" />
    <link rel="stylesheet" type="text/css" href="UIControl/css/easyui.css" />
    <link rel="shortcut icon" href="UIControl/css/images/favicon_min.ico" type="image/x-icon" />

    <script type="text/javascript" src="UIControl/js/json2.js"></script>
    <script type="text/javascript" src="UIControl/js/jquery.min.js"></script>
    <script type="text/javascript" src="UIControl/js/jquery.form.js"></script>
    <script type="text/javascript" src="UIControl/js/jquery.easyui.min.js"></script>
    <script type="text/javascript" src="UIControl/js/main.js"></script>
    <script type="text/javascript"src="UIControl/js/tool.js"></script>
</head>
<!-- new.css: 含主要菜单重要布局样式 -->
<!-- main.js: 含有导航菜单栏的生成代码及重要的共用 Function -->
<!-- EasyUI 框架必须引用的文件: easyui.css, icon.css, jquery.easyui.min.js -->
<body>
<script type="text/javascript">
    $(function() {
        $("input", $(".focus").next("span")).focus();
        $("input", $(".transform-UpperCase").next("span")).keyup(
            function(event) {
                // 当在键盘输入 A ~ Z 或回车键时转换为大写
                if ((event.keyCode > 64 && event.keyCode < 91) || event.keyCode == 13) {
                    $(this).val($(this).val().toUpperCase());
                }
            });

        // 使用正则表达式：当按下按钮时只能输入数字
        $("input", $(".inputNumber").next("span")).keyup(function(event) {
            $(this).val($(this).val().replace(/[^\d]/g, ''));
        });
    })
</script>
<div id="mask" class="mask"></div>
</body>
</html>