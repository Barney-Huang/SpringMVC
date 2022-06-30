package utility.controller;

import entity.ConstantList;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import utility.service.MyService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
@Controller
@RequestMapping("helloWorldController")
public class HelloWorldController {
    @Resource
    MyService helloWorldService;
    @RequestMapping("getInfo")
    @ResponseBody
    public String getInfo(HttpServletRequest request, Integer exportExcelFlag, String modelID, String attrNM, String attrID, Integer page, Integer rows) throws Exception {
        System.out.println("helloWorldController/getInfo function: page="+page+",rows="+rows);
        String result = null;

        try {
            /*if (exportExcelFlag == 1) {

                FileOutputStream fos = null;

                String returnFileName = "Model_D" + ConstantList.DataTime() + ".xls";

                try {

                    List<Map<String, Object>> tempListMap = null;

                    tempListMap = modelQueryService.getModelInfo(modelID, attrNM, attrID, user.getDbid());

                    // String path =
                    // ServletActionContext.getServletContext().getRealPath("/upload/"
                    // + user.getUserID());
                    String downloadPath = ConstantList.filePath() + "/download/" + user.getUserID() + "/";

                    File newFile = new File(new File(downloadPath), returnFileName);

                    if (!newFile.getParentFile().exists()) {

                        newFile.getParentFile().mkdirs();
                    }

                    fos = new FileOutputStream(newFile);

                    excelSupportBean.exportExcel(tempListMap, fos, "MEDEL_D");
                } catch (IOException ex) {

                    ex.printStackTrace();

                    result = ConstantList.STRING_IO_EXCEPTION_RESULT;

                } finally {

                    if (fos != null) {

                        fos.close();
                    }
                }

                result = "{\"status\":\"" + "1" + "\",\"result\":" + "\"" + returnFileName + "\"}";

            } else {*/
            System.out.println("successfully get service bean from spring MVC:"+helloWorldService);
            result = helloWorldService.getModelInfo(page, rows, modelID, attrNM, attrID);
            //}

        } catch (Exception ex) {
            ex.printStackTrace();
            result = ConstantList.STRING_ERROR_RESULT;
        }


        return result;
    }
}
