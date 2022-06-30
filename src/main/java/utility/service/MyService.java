package utility.service;

import java.util.List;
import java.util.Map;

public interface MyService {

    String getModelInfo(int currentPage, int rowsPerPage, String modelID, String attrNM, String attrID) throws Exception;
    public List<Map<String,Object>> getModelInfo(String modelID, String attrNM, String attrID, String dbid)throws Exception;
}