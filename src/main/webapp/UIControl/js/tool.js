/**
 *   定义一些公用的工具
 */


/**
 * 24小时的毫秒数
 * */
var timeInterval = 24*60*60*1000;
/**
 * 1小时的毫秒数
 * */
var hourInterval = 60*60*1000;
/**
 * 返回当天零点时间字符串格式
 * */
formatterSDate = function (date) {
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
    return date.getFullYear() + '-' + month + '-' + day+" "+00+":"+00+":"+00;
};

/**
 * 返回当前时间,字符串格式
 * */
formatterEDate = function (date) {
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"+ (date.getMonth() + 1);
    var hor = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return date.getFullYear() + '-' + month + '-' + day+" "+hor+":"+min+":"+sec;
};

/**
 * 判断时间是否符合设置的最大天数
 * @param starTime : 开始时间
 * @param endTime : 结束时间
 * @param dateInterval ： 设置的天数
 * @return boolean
 * */
function isAccordTime(startTime,endTime,dateInterval){
	var interval = getInterval(startTime, endTime);
	if(interval>dateInterval*timeInterval){
		$.messager.alert("提示","時間間隔不能大於"+dateInterval+"天","info",$.messager.progress('close'));
		return false;
	}else if(interval<0){
		$.messager.alert("提示","結束時間不能小於開始時間","info",$.messager.progress('close'));
		return false;
	}
	return true;
}

function submitExcel(excelFile){
	if(!excelFile.endWith('.xls')&!excelFile.endWith('.xlsx')){
		$.messager.alert("Prompt","选择一个Excel类型文件","error");
		return;
	}
	$('#form_upload').submit();
}
/**
*去除文件的路径名
*/
function getExcelName(excelFile){
    return excelFile.substring(excelFile.lastIndexOf('\\')+1);
}

/**
 *  初始化指定id的easyui table 默认pagelist[ 25,50,100 ]
 *  @param dg ：如 $("#tableID")
 *  @param columns ： 数据网格的列的配置对象
 *  @param toolbar ： 不需toolbar 传null
 *  @param title : 表格title
 *
 */
function initEasyuiTable(dg,columns,toolbar,title){
	dg.datagrid({
		columns :  [columns] ,
		border : false,
		title: title,
		iconCls: 'icon-search',
		fitColumns: false,
		fit : true,
		toolbar:toolbar,
		pagination : true,
		pageSize : 25,
		pageList : [ 25,50,100 ]
	});
}

/**
 *  请求远程数据
 *  @param dg ：如 $("#tableID")
 *  @param url ： 从远程站点请求数据的 URL
 *  @param queryParams : 请求的参数 Object类型
 *
 */
function loadEasyuiTable1(dg,columns,url,queryParams,title){
	dg.datagrid({
		url : url,
		columns :  [columns] ,
		pagination : true,
		pageSize : 25,
		pageList : [ 25,50,100 ],
		title: title,
		iconCls: 'icon-search',
		queryParams : queryParams,
		onLoadSuccess : function(result){
			if(result.status == "0")
				$.messager.alert("异常提示",result.result,"error");
		},
		onBeforeLoad : function(){
			maskColumn  = [];
		}
	});
}

function loadEasyuiTable(dg,url,queryParams){
	dg.datagrid({
		url : url,
		queryParams : queryParams,
		onSuccess : function(result){
			if(result.status == "0"){
				$.messager.alert("异常提示",result.result,"error");
			}

		},
		onBeforeLoad : function(){
			maskColumn  = [];
		}
	});
}



/**
 * 逻辑待修改
 * */
function newImportExcel(url,params){
	/*$.get(url,params,function(result){
		if(result.status == "0")
			$.messager.alert("异常提示",result.result,"error");
	})*/
	var temp;
	$.ajax({
		url : url,
		async : false,
		type : "POST",
		data : params,
		success : function(data) {
			temp = data;
			hideMask();
			$.messager.progress('close');
		},
		error : function() {
			temp = "頁面發生未知異常";
			hideMask();
			$.messager.progress('close');
		}
	});
	if (!temp.endWith('.xls') && !temp.endWith('.xlsx')) {
		$.messager.alert("错误提示", temp, "info");
		return;
	} else {
		var host = window.location.host;
		window.location = 'http://' + host
				+ '/filedownloadcotroller/exportFile.do?fileName=' + temp;
	}
}

/**
 * 取得endTime-starTime的毫秒值
 * @param starTime : 开始时间
 * @param endTime : 结束时间
 * */
function getInterval(starTime,endTime){
	return Date.parse(endTime)-Date.parse(starTime);
}

function getColumn(field,width,formatter){
	var column = new Object();
	column.field = field;
	column.title = field;
	column.width = width;
	column.align = "center";
	if(formatter != undefined){
		column.formatter = formatter;
	}
	return column;
}

function tipMsg(resp){
	var msg = resp.result;
	if(resp.status ==0 )
  		$.messager.alert("错误提示",msg,"error");
	else
		$.messager.alert("提示",msg,"info");
}

/**
 * updateCells , maskColumnFormatter 方法用于前端禁用某个字段
 * @Param dg  : 需作用的easyui datagrid 类型表格
 * @Param  maskArray : 数组,值为需禁用的字段
 * */
var maskColumn  = [];
function updateCells(dg,maskArray){
	dg.datagrid({
		onClickCell : function(rowIndex, field, value) {
			//第一次點擊行,初始化所有需mask的字段,標記為true,表示從未點擊
			if(maskColumn[rowIndex] == undefined){
				var maskfield = new Object();
				for(var j = 0,len = maskArray.length; j < len; j++){
					maskfield[maskArray[j]] = true;
				}
				maskColumn[rowIndex] =maskfield;
			}

			//如果點擊的字段是需要mask的字段
			if(maskArray.indexOf(field)!=-1){
				//如果是第一次點擊
				if(maskColumn[rowIndex][field]){
					//該字段標記為已經點擊
					maskColumn[rowIndex][field] = false;
					//刷新行
					$(this).datagrid("refreshRow", rowIndex);

					//涉及机密,点击记录log
					var rows = $(this).datagrid("getRows");
					rowData = rows[rowIndex];
					isn = rowData.ISN;
					param = new Object();
					param.field = field;
					param.secretData = currentUser.hsmd=='T'?value:"XXX";
					param.sn = isn==undefined?rowData.SN:isn;
				    $.post("logcontroller/recordSecretDataLog.do",param,function(result){
				    	console.log(result);
				    });

				}else{
					if(currentUser.hsmd!='T'){
						$.messager.alert("Promt", "You do not have permission to view. The system has recorded your click!", "warning");
					}
				}
			}
		},onBeforeLoad : function(){
			maskColumn  = [];
		}
	})
}

/**
 * 	@Param field ； column对应的field
 * *//*
function maskColumnByCondition(field,condition,conditionValue,maskColumn) {
	columnFormatter = function(value, row, index) {
		var result;
		if( conditionValue.indexOf(row[condition])==-1){
			return value;
		}
		if(maskColumn[index]==undefined||maskColumn[index][field]){
			result = "XXX";
		}else{
			result = currentUser.hsmd=='T'?value:"无权限查看";
		}
		return result;
	}
	return columnFormatter;
}*/

function maskColumnFormatter(field) {
	var rowCache;
	columnFormatter = function(value, row, index) {
		var result;
		if(maskColumn[index]==undefined||maskColumn[index][field]){ //||maskColumn[index][field]
			result = "XXX"
		}else{
			if(currentUser.hsmd=='T'){
				result = value;
			}else{
				result = "XXX";
				if(rowCache != row){
					$.messager.alert("Promt", "You do not have permission to view. The system has recorded your click!", "warning");
					rowCache = row;
				}

			}
		}
		return result;
	}
	return columnFormatter;
}

function recordSecretDataLog(param){
    $.post("logcontroller/recordSecretDataLog.do",param,function(result){
    	console.log(result);
    });
}


/*
    通过msg获取报错信息

*/

function getErrorMessageByMsg(msg){
    var flag ;
    $.post("GetErrorMessageController/getErrorMessage.do",{errorId: '',msg:msg},function(result){
        if(result.status == 604){
            flag = 1;
            $.messager.alert("tip",result.result,"error");
        }else if(result == null){
        $.messager.alert("tip",msg,"error");
        }
    })

    return flag;

}

/*
    获取报错信息，并返回
*/
function getErrorFlagByMsg(msg){
    var flag ;
    $.post("GetErrorMessageController/getErrorMessage.do",{errorId: '',msg:msg},function(result){
        flag == result.result;
    })

    return flag;

}


/*
    获取报错信息  msg是英文显示的内容，若有msg则会显示msg和提示信息，如果不输入msg，则系统会加上相应信息的默认英文提示。
*/

function getErrorMessage(errorId,msg){
    var flag ;
    $.post("GetErrorMessageController/getErrorMessage.do",{errorId:errorId,msg:msg},function(result){
        if(result.status == 604){
            flag = 1;
            $.messager.alert("tip",result.result,"error");
        }
    })

    return flag;

}

/*
    带有key的信息提示，即如果提示信息中有需要自定义的内容，可以将自定义的内容传入后台，后台会自动拼接消息提示

*/
function getErrorMessageWithKey(errorId,key,msg){

    var flag ;
    $.post("GetErrorMessageController/getErrorMessageWithKey.do",{errorId:errorId,key:key,msg:msg},function(result){
            if(result.status == 604){
                flag = 1;
                $.messager.alert("tip",result.result,"error");
            }
        })

        return flag;
}


/*maskColumnFormatter = function (value) {
	var result;
	if(maskColumn[column]){
		result =  'XXX'
	}else{
		result = currentUser.hsmd=='T'?value:"无权限查看";
	}
			if(cacheRow != rowIndex){
				for(var column in maskColumn) {
					maskColumn[column] = true;
				}
		
	
	return result;
};*/

/*function maskColumn(column) {
	var result;
	if(maskColumn[column]){
		result =  'XXX'
	}else{
		result = currentUser.hsmd=='T'?value:"无权限查看";
	}
	return result;
}*/
/*dg.datagrid({
	onClickCell : function(rowIndex, field, value) {
		if (field == 'ISN') {
			isHideIsn = false;
			dg.datagrid("refreshRow", rowIndex);
		}
		if (field == 'NSTEP') {
			isHideNstep = false;
			dg.datagrid("refreshRow", rowIndex);
			
		}
	}
})*/
/*function getParams(){
	var length=arguments.length;
	var params = new Object();
	for(var i=0;i<length;i++){
		
	}
}*/

