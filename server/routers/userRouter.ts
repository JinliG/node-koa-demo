import Router from 'koa-router';
import UserDao from '../models/userDao';

const userRouter = new Router();
userRouter.all('/user/listAll', async (ctx) => {
  const userDao = await UserDao.getInstance();
  ctx.body = await userDao.listAll();
})
.post('/user/findBy', async (ctx) => {
  const payload = ctx.request.body;
  const userDao = await UserDao.getInstance();
  ctx.body = await userDao.findBy({
    ...payload,
    pageSize: 20
  });
})
.get('/user/:id', async (ctx) => {})
.del('/user/:id', async (ctx) => {})
.post('/user/add', async (ctx) => {})
.post('/user/update', async (ctx) => {})

export default userRouter;