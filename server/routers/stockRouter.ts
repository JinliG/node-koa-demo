import Router from 'koa-router';
import StockDao from '../models/stockDao';

const stockRouter = new Router();

stockRouter.all('/stock/listAll', async (ctx) => {
  const stockDao = await StockDao.getInstance();
  ctx.body = await stockDao.listAll();
})
.post('/stock/findBy', async (ctx) => {
  const payload = ctx.request.body || {};
  const stockDao = await StockDao.getInstance();
  ctx.body = await stockDao.findBy({
    ...payload,
    pageSize: 10
  });
});

export default stockRouter;