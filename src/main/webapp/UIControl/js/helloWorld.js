/** ********************* helloWorld ********************* */
var dataList = {};
/*
$(function() {
    $('#cb_modelid')
        .combobox(
            {
                onSelect : function(record) {
                    $('#cb_ATTRNM').combobox('clear');
                    $('#cb_ATTRID').combobox('clear');
                    $('#cb_ATTRNM')
                        .combobox(
                            {
                                url : 'model_dcontroller/getAttrNMByModelID.do?modelID='
                                    + encodeURI(record['VALUEFIELD']),
                                onLoadSuccess : function(data) {
                                    $('#cb_ATTRNM')
                                        .combobox(
                                            'setValue',
                                            data[0]["TEXTFIELD"]);
                                }
                            });
                    $('#cb_ATTRID')
                        .combobox(
                            {
                                url : 'model_dcontroller/getAttrIDByModelID.do?modelID='
                                    + encodeURI(record['VALUEFIELD']),
                                onLoadSuccess : function(data) {
                                    $('#cb_ATTRID')
                                        .combobox(
                                            'setValue',
                                            data[0]["TEXTFIELD"]);
                                }
                            });
                }
            });

    $("input", $("#add_keyATTID").next("span")).keyup(function(event) {
        if (event.keyCode > 64 && event.keyCode < 91) {
            $('#add_ATTRID').combobox('setValue', 'Please Choice');
            $(this).val($(this).val().toUpperCase());
        }
    });

    $('#add_ATTRID').combobox({
        onSelect : function() {
            var Data = $("#add_ATTRID").combobox('getValue');
            if (Data != "Please Choice") {
                $('#add_keyATTID').textbox('setValue', '');
            }
        }
    });

    $("input", $("#cb_modelid").next("span")).keyup(function(event) {
        var value = $(this).val().toUpperCase();
        if (value != "") {
            if(value.length==1){
                $.post("model_dcontroller/findInfoByKeyWord.do", {
                    keyWord : value,
                    parameter : "modelID"
                }, function(temp) {
                    var data = JSON.parse(temp);
                    //dataList[value] =data;
                    $('#cb_modelid').combobox('loadData', data);
                });
            }
        } else {
            $('#cb_ATTRNM').combobox('loadData', [ {} ]);
            $('#cb_ATTRID').combobox('loadData', [ {} ]);
        }
    });

    $("input", $("#cb_ATTRNM").next("span")).keyup(function(event) {
        var value = $(this).val();
        if (value != "") {
            if (value.match("[0-9a-zA-Z]")&&value.length==1) {
                $.post("model_dcontroller/findInfoByKeyWord.do", {
                    keyWord : value,
                    parameter : "attrNM"
                }, function(temp) {
                    var data = JSON.parse(temp);
                    $('#cb_ATTRNM').combobox('loadData', data);
                });
            }
        }
    });
    $("input", $("#cb_ATTRID").next("span")).keyup(function(event) {
        var value = $(this).val();
        if (value != "") {
            if (value.match("[0-9a-zA-Z]")&&value.length==1) {
                $.post("model_dcontroller/findInfoByKeyWord.do", {
                    keyWord : value,
                    parameter : "attrID"
                }, function(temp) {
                    var data = JSON.parse(temp);
                    $('#cb_ATTRID').combobox('loadData', data);
                });
            }
        }
    });

    $('#update').linkbutton({
        onClick : function() {
            var dg = $('#tb_model');
            var selected = dg.datagrid('getSelected');
            if (selected != null) {
                $('#delete').linkbutton('disable');
                $('#cancel').linkbutton('enable');
                var rowIndex = dg.datagrid('getRowIndex', selected);
                dg.datagrid('beginEdit', rowIndex);
            } else {
                getErrorMessageByMsg('Please choose at least one');
                //$.messager.alert("Operation tip", "Please choose at least one", "warning");
            }
        }
    });
    /!*
    $('#delete')
        .linkbutton(
            {
                onClick : function() {
                    var dg = $('#tb_model');
                    var row = dg.datagrid('getSelected');
                    if (row != null) {
                        var deleted = JSON.stringify(row);
                        var index = dg.datagrid('getRowIndex', row);
                        $.messager
                            .confirm(
                                'Confirm',
                                'Are you sure you want to delete this model['
                                + row.MODELID + ']',
                                function(confirm) {
                                    if (confirm) {
                                        var action = "model_dcontroller/delModel.do";
                                        $
                                            .post(
                                                action,
                                                {
                                                    modelJsonString : "["
                                                        + deleted
                                                        + "]"
                                                },
                                                function(
                                                    resp) {
                                                    var result_json = $
                                                        .parseJSON(resp);
                                                    if (result_json.status == 1) {
                                                        $.messager
                                                            .show({
                                                                timeout : 2000,
                                                                title : "Operation tip",
                                                                msg : result_json.result,
                                                                showType : 'slide',
                                                                width : 300,
                                                                height : 150,
                                                                style : {
                                                                    align : 'center'
                                                                }
                                                            });
                                                    } else {
                                                        $.messager
                                                            .show({
                                                                timeout : 0,
                                                                title : "Operation tip",
                                                                msg : result_json.result,
                                                                showType : 'slide',
                                                                width : 300,
                                                                height : 150,
                                                                style : {
                                                                    align : 'center'
                                                                }
                                                            });
                                                    }
                                                    if (result_json.status == 1) {
                                                        index = dg
                                                            .datagrid(
                                                                'getRowIndex',
                                                                row);
                                                        dg
                                                            .datagrid(
                                                                'deleteRow',
                                                                index);
                                                    } else {
                                                        dg
                                                            .datagrid('rejectChanges');
                                                    }
                                                });
                                    }
                                });
                    } else {
                        $.messager.alert("Operation tip", "Please choose at least one", "warning");
                    }
                }
            });
    $('#cancel').linkbutton({
        onClick : function() {
            setPermissionByClass();
            var dg = $('#tb_model');
            dg.datagrid('rejectChanges');
        }
    });
    $('#accept').linkbutton({
        onClick : function() {
            var dg = $('#tb_model');
            endEdit_datagrid(tb_model);
            setPermissionByClass();
            var updated = $('#tb_model').datagrid('getChanges', 'updated');
            var jsonArrayupdate;
            if (updated.length > 0) {
                jsonArrayupdate = JSON.stringify(updated);
            }
            if (jsonArrayupdate != undefined) {
                /!*
                 * var action =
                 * "maintain/datamaintain/model_d/editModel.action";
                 *!/
                var action = "model_dcontroller/editModel.do";
                $.post(action, {
                    modelJsonString : jsonArrayupdate
                }, function(resp) {
                    var ret = $.parseJSON(resp);
                    if (ret.status == 1) {
                        $.messager.show({
                            timeout : 2000,
                            title : "Operation tip",
                            msg : ret.result,
                            showType : 'slide',
                            width : 300,
                            height : 150,
                            style : {
                                align : 'center'
                            }
                        });
                    } else {
                        $.messager.show({
                            timeout : 0,
                            title : "Operation tip",
                            msg : ret.result,
                            showType : 'slide',
                            width : 300,
                            height : 150,
                            style : {
                                align : 'center'
                            }
                        });
                    }
                    dg.datagrid('endEdit');
                })
            }
        }
    });
    $('#form_upload')
        .ajaxForm(
            {
                success : function(data) {
                    var result = $.parseJSON(data);
                    if (result.status == 1) {
                        var file = $('#model_file').filebox('getValue');
                        var filename = file.substring(file
                            .lastIndexOf('\\') + 1);
                        var method = $("#cb_method").combobox(
                            "getValue");
                        var queryParams = 'fileName='
                            + encodeURIComponent(filename)
                            + '&method=' + method;
                        var json_data = getJSON_data('model_dcontroller/batchAddModel.do?'
                            + queryParams);
                        if (json_data.status == 1) {
                            $.messager.show({
                                timeout : 2500,
                                title : "Operation tip",
                                msg : json_data.result,
                                showType : 'slide',
                                width : 300,
                                height : 150,
                                style : {
                                    align : 'center'
                                }
                            });
                        } else {
                            $.messager.show({
                                timeout : 0,
                                title : "Operation tip",
                                msg : json_data.result,
                                showType : 'slide',
                                width : 300,
                                height : 150,
                                style : {
                                    align : 'center'
                                }
                            });
                        }
                    } else {
                        $.messager
                            .alert("FAIL", result.result, "error");
                    }
                    $('#model_file').filebox('setValue', '');
                }
            });

    $('#form_batchQuery')
        .ajaxForm(
            {
                success : function(data) {
                    var result = $.parseJSON(data);
                    if (result.status == 1) {
                        var file = $('#file_batchQuery').filebox(
                            'getValue');
                        var filename = file.substring(file
                            .lastIndexOf('\\') + 1);
                        var flag = $('#flag').text();
                        var queryParams = 'fileName='
                            + encodeURIComponent(filename)
                            + '&exportExcelFlag=' + flag;
                        if (flag == '0') {
                            var columns = getColumns();
                            showMask();
                            $('#tb_model')
                                .datagrid(
                                    {
                                        url : 'model_dcontroller/batchQuery.do?'
                                            + queryParams,
                                        fitColumns : true,
                                        fit : true,
                                        collapsible : true,
                                        columns : [ columns ],
                                        pagination : true,
                                        onLoadError : function(
                                            result) {
                                            hideMask();
                                            $.messager
                                                .alert(
                                                    "Error message",
                                                    result.responseText,
                                                    "error");
                                        },
                                        onLoadSuccess:function(result){
                                            if(result.status == 0){
                                                $.messager.alert("info",result.result,"info",hideMask());
                                            }else{
                                                hideMask();
                                            }
                                        }
                                    });
                        } else {
                            importToExcel('model_dcontroller/batchQuery.do?'
                                + queryParams);
                        }
                    } else {
                        hideMask();
                        alert("2");
                        $.messager
                            .alert("FAIL", result.result, "error");
                    }
                }
            });*!/
})
*/

/*function exportExcel() {
    $('#flag').text('1');
    loadData_tb_model();
}*/

// executed when clicking Query
function queryData_tb_model() {
    $('#flag').text('0');
    loadData_tb_model();
}

function loadData_tb_model() {
    /*var file = $('#file_batchQuery').filebox('getValue');
    if ('' != file) {
        if (!file.endWith('.xls') & !file.endWith('.xlsx')) {
            getErrorMessageByMsg('Please select an Excel file type');
            //$.messager.alert("Prompt", "Please select an Excel file type", "error");
            return;
        }
        $('#form_batchQuery').submit();
    } else {*/
    var modelid = encodeURI($('#cb_modelid').combobox('getValue'));
    var attrnm = encodeURI($('#cb_ATTRNM').combobox('getValue'));
    var attrid = encodeURI($('#cb_ATTRID').combobox('getValue'));
 /*   if ($('#cb_modelid').combobox('getText') == ("")) {
        modelid = "ALL";
    }
    if ($('#cb_ATTRNM').combobox('getText') == ("")) {
        attrnm = "ALL";
    }
    if ($('#cb_ATTRID').combobox('getText') == ("")) {
        attrid = "ALL";
    }
    if (modelid == "ALL" && attrnm == "ALL" && attrid == "ALL") {
        getErrorMessageByMsg('You need to select at least two query criteria before proceeding');
        //$.messager.alert("Operation tip", "You need to select at least two query criteria before proceeding！", "warning");
        return;
    }
    if (modelid == "ALL" && attrnm == "ALL") {
        getErrorMessageByMsg('You need to select at least two query criteria before proceeding');
        //$.messager.alert("Operation tip", "You need to select at least two query criteria before proceeding！", "warning");
        return;
    }
    if (modelid == "ALL" && attrid == "ALL") {
        getErrorMessageByMsg('You need to select at least two query criteria before proceeding');
        //$.messager.alert("Operation tip", "You need to select at least two query criteria before proceeding！", "warning");
        return;
    }
    if (attrnm == "ALL" && attrid == "ALL") {
        getErrorMessageByMsg('You need to select at least two query criteria before proceeding');
        //$.messager.alert("Operation tip", "You need to select at least two query criteria before proceeding！", "warning");
        return;
    }*/
    var flag = $('#flag').html();
    var queryParams = 'modelID=' + modelid + '&attrNM=' + attrnm
        + '&attrID=' + attrid + '&exportExcelFlag=' + flag;
    /*
    if (flag == '1') {
        /!*
         * var json_data =
         * getJSON_data('maintain/datamaintain/model_d/getmodelInfo.action?' +
         * queryParams);
         *!/
        var json_data = getJSON_data('model_dcontroller/getmodelInfo.do?'
            + queryParams);
        // window.location = '/file/download.action?fileName=' +
        // json_data.result;
        var host = window.location.host;
        window.location = 'http://' + host
            + '/filedownloadcotroller/exportFile.do?fileName='
            + json_data.result;
    } else {*/
    var columns = getColumns();
    console.log('helloWorldController/getInfo');
    showMask();
    $('#tb_model').datagrid({
            url : 'helloWorldController/getInfo.do?' + queryParams,
            fitColumns : true,
            fit : true,
            collapsible : true,
            columns : [ columns ],
            pagination : true,
            onLoadError : function(result) {
                console.log("onLoadError() "+result);
                hideMask();
                $.messager.alert("Error message", result.responseText, "error");
            },
            onLoadSuccess:function(result){
                console.log("onLoadSuccess() "+result)
                if(result.status == 0){
                    $.messager.alert("info",result.result,"info",hideMask());
                }else{
                    hideMask();
                }
            }
        }
    );
    //}
    //}
}

/*function submitADDInfo() {
    var modelID = $('#add_MODELID').textbox('getValue').trim();
    var attrID = $('#add_ATTRID').combobox('getValue');
    var keyattrID = $('#add_keyATTID').textbox('getValue').trim();
    var attrItem = $('#add_ATTRITEM').textbox('getValue').trim();
    var attrNM = $('#add_ATTRNM').textbox('getValue').trim();
    var attrInfo = $('#cb_ATTRINFO').textbox('getValue').trim();
    var attrFlag = $('#add_ATTRFLAG').textbox('getValue').trim();
    var method = $("#cb_method").combobox("getValue");
    if (modelID == '' || attrItem == '' || attrNM == '' || attrInfo == '') {
        getErrorMessageByMsg('You need to fill in all the required information before you can proceed');
        //$.messager.alert("Operation tip", "You need to fill in all the required information before you can proceed！", "warning");
        return;
    }
    if (keyattrID == "" && attrID == 'Please Choice') {
        getErrorMessageByMsg('You need to fill in all the required information before you can proceed');
        //$.messager.alert("Operation tip", "You need to fill in all the required information before you can proceed！", "warning");
        return;
    }
    var modelJsonString;
    if (keyattrID != "") {
        modelJsonString = {
            MODELID : modelID,
            ATTRID : keyattrID,
            ATTRITEM : attrItem,
            ATTRNM : attrNM,
            ATTRFLAG : attrFlag,
            ATTRINFO : attrInfo
        };
    }
    if (attrID != "Please Choice") {
        modelJsonString = {
            MODELID : modelID,
            ATTRID : attrID,
            ATTRITEM : attrItem,
            ATTRNM : attrNM,
            ATTRFLAG : attrFlag,
            ATTRINFO : attrInfo
        };
    }
    var JsonString = "[" + JSON.stringify(modelJsonString) + "]";
    /!* $.post("maintain/datamaintain/model_d/addModel.action",{modelJsonString:JsonString}, *!/
    $.post("model_dcontroller/addModel.do", {
        modelJsonString : JsonString
    }, function(resp) {
        var ret = $.parseJSON(resp);
        if (ret.status == 1) {
            $.messager.show({
                timeout : 2000,
                title : "Operation tip",
                msg : ret.result,
                showType : 'slide',
                width : 300,
                height : 150,
                style : {
                    align : 'center'
                }
            });
        } else {
            $.messager.show({
                timeout : 0,
                title : "Operation tip",
                msg : ret.result,
                showType : 'slide',
                width : 300,
                height : 150,
                style : {
                    align : 'center'
                }
            });
        }
    });
}
function BatchAdd() {
    var file = $('#model_file').filebox('getValue');
    var json_data = '';
    if (file != '') {
        if (!file.endWith('.xls') & !file.endWith('.xlsx')) {
            getErrorMessageByMsg('Please select the correct format of the file');
            //$.messager.alert("Error message", "Please select the correct format of the file。。", "warning");
            return;
        }
        $('#form_upload').submit();
    } else {
        getErrorMessageByMsg('Please select the correct format of the file');
        //$.messager.alert("Error message", "Please select the correct format of the file。。", "warning");
    }
}*/

function getColumns() {
    var columns = [ {
        field : 'MODELID',
        title : 'MODELID'
    }, {
        field : 'ATTRID',
        title : 'ATTRID',
        align : 'center'
    }, {
        field : 'ATTRITEM',
        title : 'ATTRITEM',
        align : 'center'
    }, {
        field : 'ATTRNM',
        title : 'ATTRNM',
        align : 'left',
        editor : 'text'
    }, {
        field : 'ATTRINFO',
        title : 'ATTRINFO',
        editor : 'text'
    }, {
        field : 'OP',
        title : 'OP'
    }, {
        field : 'LASTUPD',
        title : 'LASTUPD',
        formatter : formatDatebox
    }, {
        field : 'ATTRFLAG',
        title : 'ATTRFLAG',
        align : 'center',
        editor : 'text'
    } ];
    return columns;
}

