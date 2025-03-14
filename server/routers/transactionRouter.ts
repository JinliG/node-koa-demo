import Router from 'koa-router';
import { rsaDecrypt } from '../global';
import TransactionDao from '../models/transactionDao';

const TransactionRouter = new Router();

TransactionRouter.all('/transaction/listAll', async (ctx) => {
  const transactionDao = await TransactionDao.getInstance();
  ctx.body = await transactionDao.listAll();
})
.post('/transaction/findBy', async (ctx) => {
  const payload = ctx.request.body || {};
  const transactionDao = await TransactionDao.getInstance();
  ctx.body = await transactionDao.findBy({
    ...payload,
    pageSize: 10
  });
})
.post('/transaction/add', async (ctx) => {
  const payload = ctx.request.body || {};
  // 解密存储
  const transactionDao = await TransactionDao.getInstance();
  ctx.body = { success: await transactionDao.add({
    ...payload,
    prd_code: rsaDecrypt(payload.prd_code),
    transaction_num: rsaDecrypt(payload.transaction_num),
    transaction_price: rsaDecrypt(payload.transaction_price),
  }) };
})
.post('/transaction/update/:id', async (ctx) => {
  const payload = ctx.request.body || {};
  const { id } = ctx.params;
  // 解密存储
  const transactionDao = await TransactionDao.getInstance();
  ctx.body = { success: await transactionDao.update(id, {
    ...payload,
    prd_code: rsaDecrypt(payload.prd_code),
    transaction_num: rsaDecrypt(payload.transaction_num),
    transaction_price: rsaDecrypt(payload.transaction_price),
  }) };
})
.post('/transaction/remove/:id', async (ctx) => {
  const { id } = ctx.params;
  const transactionDao = await TransactionDao.getInstance();
  ctx.body = { success: await transactionDao.remove(id) };
})

export default TransactionRouter;