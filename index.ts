import Koa from 'koa';
import views from 'koa-views';
import path from 'path';
import router from './server/routers';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import cluster from 'cluster';
import os from 'os';
import * as dotenv from 'dotenv';

// 加载环境变量
dotenv.config();
const numOfCPUs = os.cpus().length;
const cors = require('koa-cors');

// 使用 cluster 利用多核 cpu，并自动控制负载均衡
if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 正在运行`);

  for (let i = 0; i< numOfCPUs; i++) {
    // 创建子进程
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`--- 工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  const app = new Koa();

  app.use(cors());
  // 注册模板引擎
  app.use(views(path.join(__dirname, './server/views'), {
    extension: 'ejs'
  }));
  // 注册 ctx.body 解析中间件
  app.use(bodyParser());
  // 注册路由
  app.use(router.routes()).use(router.allowedMethods())
  // 注册日志中间件
  app.use(logger());

  app.listen(8100, () => {
    console.log(`工作进程 ${process.pid} 已启动`);
  });
}
