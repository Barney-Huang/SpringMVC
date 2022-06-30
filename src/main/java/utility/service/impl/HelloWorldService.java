package utility.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import dao.datasource.SessionFactory;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import utility.mapper.HelloWorldMapper;
import utility.service.MyService;

import java.util.*;

@Service
public class HelloWorldService implements MyService {
    @Autowired
    public ObjectMapper objectMapper;
    public ObjectMapper getObjectMapper()
    {
        return objectMapper;
    }
    public void setObjectMapper(ObjectMapper objectMapper)
    {
        this.objectMapper = objectMapper;
    }
    @Override
    public String getModelInfo(int currentPage, int rowsPerPage, String modelID, String attrNM, String attrID)
            throws Exception {

        int pageNum = (currentPage == 0) ? 1 : currentPage;

        int rows = (rowsPerPage == 0) ? 10 : rowsPerPage;

        int startNum = (pageNum - 1) * rows;

        int endNum = startNum + rows;

        startNum++;

        List<Map<String,Object>> temp = null;

        Map<String,Object> jsonMap = null;

        SqlSession session = null;

        Map<String,Object> params = null;

        String dbid = "PIMKP1";
        try{

            session = SessionFactory.getSqlSession(dbid);

            params = new HashMap<String, Object>();

            params.put("modelID", modelID);

            params.put("attrNM", attrNM);

            params.put("attrID", attrID);

            temp = getModelInfo(modelID, attrNM, attrID, dbid);

            jsonMap= new HashMap<String, Object>();

            jsonMap.put("total",temp.size());

            jsonMap.put("rows", page(temp,startNum,endNum));
            System.out.println("HelloWorld service executed successfully");
            return objectMapper.writeValueAsString(jsonMap);
        }catch(Exception e){
            throw e;
        }finally{
            temp = null;
            jsonMap = null;
            params = null;
            if(session != null){
                session.close();
            }
        }

    }

    @Deprecated
    public List<Map<String, Object>> page(List<Map<String, Object>> list, int startRow, int endRow, String... orderByCondition)
    {

        List<Map<String, Object>> returnList;

        if (orderByCondition.length == 0)
        {
            returnList = new LinkedList<Map<String, Object>>();

            for (int n = startRow - 1; n < list.size() && n < endRow; n++)
            {
                returnList.add(list.get(n));
            }

            return returnList;
        }

        int i;
        Map<String, Object> temp;

        try
        {
            for (int j = list.size() - 1; j > 1; j--)
            {
                i = 0;
                for (int k = 0; k <= j; k++)
                {
                    if (compare(list.get(k), list.get(i), orderByCondition) > 0)
                    {
                        i = k;
                    }
                }
                temp = new HashMap<String, Object>();
                for (Map.Entry<String, Object> entry : list.get(i).entrySet())
                {
                    temp.put(entry.getKey(), entry.getValue());
                }
                list.set(i, list.get(j));
                list.set(j, temp);
            }

            returnList = new LinkedList<Map<String, Object>>();

            for (int n = startRow - 1; n < list.size() && n < endRow; n++)
            {
                returnList.add(list.get(n));
            }
            return returnList;
        }
        finally
        {
            returnList = null;
            temp = null;
        }
    }

    @Override
    public List<Map<String,Object>> getModelInfo(String modelID, String attrNM, String attrID, String dbid) throws Exception {

        SqlSession session = null;

        List<Map<String,Object>> temp = null;

        Map<String,Object> params = null;

        try{
            session = SessionFactory.getSqlSession(dbid);

            params = new HashMap<String, Object>();

            params.put("modelID", modelID);

            params.put("attrNM", attrNM);

            params.put("attrID", attrID);

            temp = session.getMapper(HelloWorldMapper.class).selectModelInfo(params);

            return temp;
        }catch(Exception e){
            throw e;
        }finally{
            temp = null;
            params = null;
            if(session != null){
                session.close();
            }
        }
    }

    private int compare(Map<String, Object> map1, Map<String, Object> map2, String... orderByCondition)
    {

        int n = 0;
        for (String condition : orderByCondition)
        {
            if (map1.get(condition) == null)
            {
                if (map2.get(condition) == null)
                {
                    continue;
                }
                else
                {
                    return -1;
                }
            }
            else
            {
                if (map2.get(condition) == null)
                {
                    return 1;
                }
                else
                {
                    if (map1.get(condition) instanceof String)
                    {
                        n = String.valueOf((map1.get(condition))).compareTo(String.valueOf((map2.get(condition))));
                        if (n == 0)
                        {
                            continue;
                        }
                        else
                        {
                            return n;
                        }
                    }
                    else
                    {
                        if (map1.get(condition) instanceof Date)
                        {
                            if (((Date) map1.get(condition)).getTime() == ((Date) map2.get(condition)).getTime())
                            {
                                continue;
                            }
                            else
                            {
                                if (((Date) map1.get(condition)).getTime() > ((Date) map2.get(condition)).getTime())
                                {
                                    return 1;
                                }
                                else
                                {
                                    return -1;
                                }
                            }
                        }
                    }
                }
            }
        }
        return 0;
    }
}



