# jkef-wxe
微信企业号上的JKEF应用系统

##使用方法

### Docker
使用docker-compose：
```yaml
web:
  image: nagucc/jkef-wxe:1.0
  restart: always
  links:
  - redis:wx_redis
  ports:
  - 3000
  environment:
  - REDIS_HOST=wx_redis
  - MONGO_URL=your_mongo_url
redis:
  image: redis:2.8
  restart: always

```


### 环境变量
需要通过环境变量设置以下参数：

- `MONGO_URL` 必须的，MongoDB数据库的连接字符串
- `REDIS_HOST` 必须的，系统使用的Redis数据库的地址
- `REDIS_PORT` 默认为 `6379`，系统使用的Redis数据库的端口
- 微信企业号相关参数（v1.2以上需要）
  - `WX_CORPID` 必须的，微信企业号的corpId
  - `WX_SECRET` 必须的，微信企业号管理组secret
- `MANAGE_DEPT` 必须的，JKEF系统管理组的Id。
