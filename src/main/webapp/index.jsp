<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <jsp:include page="/common.jsp" />
    <script type="text/javascript" src="UIControl/js/helloWorld.js"></script>
    <title>HelloWorld</title>
</head>
<body id="main_layout" class="easyui-layout">
<div id="header" data-options="region:'north'"></div>
<div id="footer" data-options="region:'south'"></div>
<div id="center" data-options="region:'center'">
    <div class="easyui-layout" data-options="fit:true">
        <div data-options="region:'west',split:true"
             style="width: 185px; padding-left: 10px; padding-right: 10px;">
            <div style="margin-top: 5px;">
                <span>ModelID:</span> <input id="cb_modelid"
                                             class="easyui-combobox"
                                             data-options="panelHeight:'200',width:152,textField:'TEXTFIELD',valueField:'VALUEFIELD'" />
            </div>
            <div style="margin-top: 10px;">
                <span>AttrNM:</span> <select id="cb_ATTRNM" class="easyui-combobox"
                                             data-options="panelHeight:'200',width:152,textField : 'TEXTFIELD',valueField : 'VALUEFIELD'">
            </select>
            </div>
            <div style="margin-top: 10px;">
                <span>AttrID:</span> <select id="cb_ATTRID" class="easyui-combobox"
                                             data-options="panelHeight:'200',width:152,textField : 'TEXTFIELD',valueField : 'VALUEFIELD'">
            </select>
            </div>
            <br> <span id="flag1" style="color: red; font-size: 12px; display: none;"></span> <span
                id="hint1" style="color: green; font-size: 12px">Upload the excel file to the title bar：MODELID,ATTRNM,ATTRID。</span>
            <div style="margin-top: 15px;">
                <a href="javascript:void(0);" style="width: 72px; height: 30px;"
                   class="easyui-linkbutton select" onclick="queryData_tb_model()"
                   data-options="iconCls:'icon-search'">Query</a> <a
                    href="javascript:void(0);"
                    style="width: 72px; height: 30px; margin-left: 3px;"
                    class="easyui-linkbutton select"
                    data-options="iconCls:'icon-excel'" onclick="exportExcel()">Excel</a>
            </div>
            <br> <span id="flag" style="display: none;"></span> <span
                id="hint" style="color: green; font-size: 12px"> Can manually enter the first word mother query。<br>
					Upload excel has 6 title columns： MODELID, ATTRID, ATTRITEM, ATTRNM, ATTRINFO,
					ATTRFLAG。
				</span>

        </div>
        <div data-options="region:'center'">
            <div id="sub_layout" class="easyui-layout" data-options="fit:true">
                <div id="form_panel" data-options="region:'north',split:true"
                     style="height: 116px; width: 100px;">
                    <table data-options="cellspacing:0" class="addTable"
                           style="padding: 5px;">
                        <tr>
                            <td>ModelID:&nbsp;<input id="add_MODELID"
                                                     class="easyui-textbox transform-UpperCase"
                                                     data-options="panelHeight:'auto',width:152" /> <span
                                    class="required">*</span>
                            </td>
                            <td>AttrID:&nbsp;&nbsp;&nbsp;&nbsp;<select id="add_ATTRID"
                                                                       class="easyui-combobox"
                                                                       data-options="panelHeight:200,width:152,editable:false,
											textField:'TEXTFIELD',valueField:'VALUEFIELD',url:'model_dcontroller/getAddAttrid.do'">
                                <option>Please Choice</option>
                            </select>
                            </td>
                            <td>AttrItem:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input
                                    id="add_ATTRITEM" class="easyui-textbox"
                                    data-options="panelHeight:'auto',width:153" /> <span
                                    class="required">*</span>
                            </td>
                            <td>AttrNM:&nbsp;&nbsp;&nbsp;&nbsp;<input id="add_ATTRNM"
                                                                      class="easyui-textbox"
                                                                      data-options="panelHeight:'auto',width:152" /> <span
                                    class="required">*</span>
                            </td>
                        </tr>
                        <tr>
                            <td>AttrInfo:&nbsp;&nbsp;<input id="cb_ATTRINFO"
                                                            class="easyui-textbox"
                                                            data-options="panelHeight:'auto',width:153" /> <span
                                    class="required">*</span>
                            </td>
                            <td>AttrFlag:&nbsp;<input id="add_ATTRFLAG"
                                                      class="easyui-textbox"
                                                      data-options="panelHeight:'auto',width:152" />
                            </td>
                            <td>KEY ATTRID:&nbsp;<input id="add_keyATTID"
                                                        class="easyui-textbox"
                                                        data-options="panelHeight:'auto',width:152" />
                            </td>
                            <td><a href="javascript:void(0);"
                                   class="easyui-linkbutton add"
                                   data-options="iconCls:'icon-ok',width:152"
                                   onclick="submitADDInfo();" style="margin-left: 60px;">Add</a></td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <form id="form_upload" action="file/upload.do"
                                      method="post" enctype="multipart/form-data">
                                    Upload:&nbsp;&nbsp; <input class="easyui-filebox"
                                                               id="model_file" name="file"
                                                               style="width: 428px; margin-top: 10px;"
                                                               data-options=" buttonText: 'Brower...',  buttonAlign: 'right',prompt:'Choose a file...'">
                                </form>
                            </td>
                            <td>Method:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <select
                                    id="cb_method" class="easyui-combobox"
                                    data-options="panelHeight:'56',width:153,editable:false">
                                <option value="general">General purpose</option>
                                <option value="cystime">man-hours</option>
                            </select>
                            </td>
                            <td><a class="easyui-linkbutton add"
                                   href="javascript:void(0);"
                                   data-options="iconCls:'icon-excel',width:152"
                                   style="margin-left: 60px;" onclick="BatchAdd();">BatchAdd</a></td>
                        </tr>
                    </table>
                </div>
                <div data-options="region:'center'" style="padding: 0;">
                    <table id="tb_model" class="easyui-datagrid"
                           data-options="pagination:true,toolbar:'#tb',pageSize:25,pageList:[25,50,100],fit:true,
							singleSelect:true,rownumbers:true,remoteSort:false">
                    </table>
                    <div id="tb" style="padding: 6px 10px 6px 10px;">
                        <button id="delete" class="easyui-linkbutton delete"
                                data-options="iconCls:'icon-remove'">Delete</button>
                        <button id="update" class="easyui-linkbutton update"
                                data-options="iconCls:'icon-edit'">Edit</button>
                        <button id="accept" class="easyui-linkbutton"
                                data-options="iconCls:'icon-save'">Accept</button>
                        <button id="cancel" class="easyui-linkbutton"
                                data-options="iconCls:'icon-cancel'">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>