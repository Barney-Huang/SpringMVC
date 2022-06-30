<%--
  Created by IntelliJ IDEA.
  User: Xingang_Huang
  Date: 22/06/2022
  Time: 16:23
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Hello xingang</title>
</head>
<body>
${text} ---------${pi.text}-----------  ${student.text}--
Session scope from @SessionAttributes:${sessionScope.get("hxg")}
Request scope from model:${requestScope.get("student")==requestScope.get("hxg")}

1 1、request中names:${requestScope.names}<br/>
2 2、request中age:${requestScope.age}<br/>
</body>
</html>
