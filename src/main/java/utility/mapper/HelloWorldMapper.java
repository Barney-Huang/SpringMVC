package utility.mapper;

import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

public interface HelloWorldMapper {
    List<Map<String,Object>> selectAttrIDByMolelID(String modelID);

    List<Map<String,Object>> selectAttrNMByMolelID(String modelID);

    List<Map<String,Object>> selectCLSIDC();

    List<Map<String,Object>> selectModelInfo(Map<String, Object> params);

    int selectModelCount(Map<String, Object> params);
}
