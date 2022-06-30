package dao.datasource;

import java.io.InputStream;
import java.sql.SQLException;
import java.util.concurrent.ConcurrentHashMap;

import com.alibaba.druid.pool.DruidDataSource;
import entity.ConstantList;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.mapping.Environment;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.apache.ibatis.session.TransactionIsolationLevel;
import org.apache.ibatis.transaction.jdbc.JdbcTransactionFactory;


/**
 * @author Zhaohui_Gao
 */
public class SessionFactory
{

    private static ConcurrentHashMap<String, SqlSessionFactory> sessionFactoryPool = new ConcurrentHashMap<String, SqlSessionFactory>(50);;

    private static String resource = "mybatis-config.xml";

    private SessionFactory()
    {
    }

    /**
     * 获取sfisbase的sessionFactory，
     *
     * */
    public static SqlSessionFactory getBaseSessionFactory() throws Exception{

        String sfiswebdb = ConstantList.SFISWEBDB;
        SqlSessionFactory sessionFactory = sessionFactoryPool.get(sfiswebdb);
        if (sessionFactory == null){
            try(InputStream inputStream = Resources.getResourceAsStream(resource)){
                SqlSessionFactoryBuilder sessionFactoryBuilder = new SqlSessionFactoryBuilder();
                sessionFactory = sessionFactoryBuilder.build(inputStream, sfiswebdb);
                sessionFactoryPool.put(sfiswebdb,sessionFactory);
            }
        }
        return sessionFactory;
    }
    /**
     *
     * 通过db的url获取DruidDataSource
     *
     * */
    public static DruidDataSource getDruidDataSource(String dburl) throws SQLException {
        DruidDataSource druidDataSource = new DruidDataSource();
        druidDataSource.setUsername("JR_SFISAP");
        druidDataSource.setPassword("qaz*9ujm");
        druidDataSource.setUrl(dburl);
        druidDataSource.setMaxActive(200);
        druidDataSource.setInitialSize(5);
        druidDataSource.setMaxWait(120000);
        druidDataSource.setMinIdle(5);
        druidDataSource.setTimeBetweenEvictionRunsMillis(90000);
        druidDataSource.setMinEvictableIdleTimeMillis(60000);
        druidDataSource.setFilters("stat,log4j");
        druidDataSource.setTestWhileIdle(true);
        druidDataSource.setMaxOpenPreparedStatements(100);
        druidDataSource.setRemoveAbandoned(true);
        druidDataSource.setRemoveAbandonedTimeout(1800);
        druidDataSource.setLogAbandoned(true);
        return druidDataSource;
    }

    /**
     * 获取一个访问数据库的会话
     * 首先，从缓存中获取sessionFactory，如果获取不到,则调用getBaseSessionFactory()方法，获取base库的sessionFactory  --> baseSessionFactory
     * 使用baseSessionFactory获取session并查询到sid对应的url信息，然后，创建sid的DruiDataSource, Environment，将baseSessionFactory的
     * environment设置为sid的environment，即将baseSessionFactory转换成为了sid的sessionFactory
     *
     * @param sid
     *            指定是获取 sid 对应的数据库会话(case：SHPNDAP1QA)
     * @return 返回SqlSession实例
     * @throws Exception
     */
    public static SqlSession getSqlSession(String sid) throws Exception
    {
        SqlSessionFactory sessionFactory = sessionFactoryPool.get(sid);
        SqlSessionFactory baseSessionFactory = null;
        if (sessionFactory == null){
            baseSessionFactory = getBaseSessionFactory();
            try(SqlSession session = baseSessionFactory.openSession();
                InputStream inputStream = Resources.getResourceAsStream(resource)){
                SqlSessionFactoryBuilder sessionFactoryBuilder = new SqlSessionFactoryBuilder();
                sessionFactory = sessionFactoryBuilder.build(inputStream);
                IDBListMapper mapper = session.getMapper(IDBListMapper.class);
                String DBURL = mapper.getdburlbysid(sid);
                DruidDataSource druidDataSource = getDruidDataSource(DBURL);
                Environment environment = new Environment(sid,new JdbcTransactionFactory(),druidDataSource);
                sessionFactory.getConfiguration().setEnvironment(environment);
                sessionFactoryPool.put(sid,sessionFactory);
            }
        }
        return sessionFactory.openSession();
    }

    /**
     * 获取一个访问数据库的会话
     *
     * @param sid
     *            指定是获取 sid 对应的数据库会话(case：SHPNDAP1QA)
     * @param level
     *            定义事务的隔离级别<br/>
     *            (NONE、READ_UNCOMMITTED、READ_COMMITTED、REPEATABLE_READ、SERIALIZABLE)<br/>
     *            NONE:使用后端数据库默认的隔离级别<br/>
     *            READ_UNCOMMITTED:允许读取尚未提交的数据变更，可能导致脏读、幻读或不可重复读<br/>
     *            READ_COMMITTED:允许获取并发事务已经提交的数据变更，可以避免脏读，但是可能导致幻读或不可重复读<br/>
     *            REPEATABLE_READ：对同一字段的多次读取结果是一致的，除非数据是被本事务所修改，可以组织脏读和幻读<br/>
     *            SERIALIZABLE：最高的也是最慢的隔离级别，能够避免导致脏读、幻读及不可重复读，因为它通常是通过锁定事务相关的数据库表来实现<br/>
     * @return 返回SqlSession实例
     * @throws Exception
     */
    public static SqlSession getSqlSession(String sid, TransactionIsolationLevel level) throws Exception
    {
        SqlSessionFactory sessionFactory = sessionFactoryPool.get(sid);
        SqlSessionFactory baseSessionFactory = null;
        if (sessionFactory == null){
            baseSessionFactory = getBaseSessionFactory();
            try(SqlSession session = baseSessionFactory.openSession();
                InputStream inputStream = Resources.getResourceAsStream(resource)){
                SqlSessionFactoryBuilder sessionFactoryBuilder = new SqlSessionFactoryBuilder();
                sessionFactory = sessionFactoryBuilder.build(inputStream);
                IDBListMapper mapper = session.getMapper(IDBListMapper.class);
                String DBURL = mapper.getdburlbysid(sid);
                DruidDataSource druidDataSource = getDruidDataSource(DBURL);
                Environment environment = new Environment(sid,new JdbcTransactionFactory(),druidDataSource);
                sessionFactory.getConfiguration().setEnvironment(environment);
                sessionFactoryPool.put(sid,sessionFactory);
            }
        }
        return sessionFactory.openSession(level);
    }

    /**
     * 获取一个访问数据库的会话
     *
     * @param sid
     *            指定是获取 sid 对应的数据库会话(case：SHPNDAP1QA)
     * @param execType
     *            设定执行器类型(SIMPLE、REUSE、BATCH)<br/>
     *            SIMPLE:默认的类型，不做任何操作，为每条执行语句创建一个PreparedStatement<br/>
     *            REUSE:重用PreparedStatement<br/>
     *            BATCH：将会批量执行更新语句，如果SELECT在更新语句中被执行，要根据需要进行区分，确保动作易于理解<br/>
     * @return 返回SqlSession实例
     * @throws Exception
     */
    public static SqlSession getSqlSession(String sid, ExecutorType execType) throws Exception
    {

        SqlSessionFactory sessionFactory = sessionFactoryPool.get(sid);
        SqlSessionFactory baseSessionFactory = null;
        if (sessionFactory == null){
            baseSessionFactory = getBaseSessionFactory();
            try(SqlSession session = baseSessionFactory.openSession();
                InputStream inputStream = Resources.getResourceAsStream(resource)){
                SqlSessionFactoryBuilder sessionFactoryBuilder = new SqlSessionFactoryBuilder();
                sessionFactory = sessionFactoryBuilder.build(inputStream);
                IDBListMapper mapper = session.getMapper(IDBListMapper.class);
                String DBURL = mapper.getdburlbysid(sid);
                DruidDataSource druidDataSource = getDruidDataSource(DBURL);
                Environment environment = new Environment(sid,new JdbcTransactionFactory(),druidDataSource);
                sessionFactory.getConfiguration().setEnvironment(environment);
                sessionFactoryPool.put(sid,sessionFactory);
            }
        }
        return sessionFactory.openSession(execType);
    }

    /**
     * 获取一个访问数据库的会话
     *
     * @param sid
     *            指定是获取 sid 对应的数据库会话(case：SHPNDAP1QA)
     * @param execType
     *            设定执行器类型(SIMPLE、REUSE、BATCH)<br/>
     *            SIMPLE:默认的类型，不做任何操作，为每条执行语句创建一个PreparedStatement<br/>
     *            REUSE:重用PreparedStatement<br/>
     *            BATCH：将会批量执行更新语句，如果SELECT在更新语句中被执行，要根据需要进行区分，确保动作易于理解<br/>
     * @param level
     *            定义事务的隔离级别<br/>
     *            (NONE、READ_UNCOMMITTED、READ_COMMITTED、REPEATABLE_READ、SERIALIZABLE)<br/>
     *            NONE:使用后端数据库默认的隔离级别<br/>
     *            READ_UNCOMMITTED:允许读取尚未提交的数据变更，可能导致脏读、幻读或不可重复读<br/>
     *            READ_COMMITTED:允许获取并发事务已经提交的数据变更，可以避免脏读，但是可能导致幻读或不可重复读<br/>
     *            REPEATABLE_READ：对同一字段的多次读取结果是一致的，除非数据是被本事务所修改，可以组织脏读和幻读<br/>
     *            SERIALIZABLE：最高的也是最慢的隔离级别，能够避免导致脏读、幻读及不可重复读，因为它通常是通过锁定事务相关的数据库表来实现<br/>
     * @return 返回SqlSession实例
     * @throws Exception
     */
    public static SqlSession getSqlSession(String sid, ExecutorType execType, TransactionIsolationLevel level) throws Exception
    {

        SqlSessionFactory sessionFactory = sessionFactoryPool.get(sid);
        SqlSessionFactory baseSessionFactory = null;
        if (sessionFactory == null){
            baseSessionFactory = getBaseSessionFactory();
            try(SqlSession session = baseSessionFactory.openSession();
                InputStream inputStream = Resources.getResourceAsStream(resource)){
                SqlSessionFactoryBuilder sessionFactoryBuilder = new SqlSessionFactoryBuilder();
                sessionFactory = sessionFactoryBuilder.build(inputStream);
                IDBListMapper mapper = session.getMapper(IDBListMapper.class);
                String DBURL = mapper.getdburlbysid(sid);
                DruidDataSource druidDataSource = getDruidDataSource(DBURL);
                Environment environment = new Environment(sid,new JdbcTransactionFactory(),druidDataSource);
                sessionFactory.getConfiguration().setEnvironment(environment);
                sessionFactoryPool.put(sid,sessionFactory);
            }
        }
        return sessionFactory.openSession(execType,level);
    }

    public static void init() throws Exception {
        sessionFactoryPool = new ConcurrentHashMap<String, SqlSessionFactory>(50);
        getBaseSessionFactory();
    }

    public static void destory()
    {
        sessionFactoryPool.clear();
        sessionFactoryPool = null;
    }
}
