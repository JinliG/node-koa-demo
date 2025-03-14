import Router from 'koa-router';
import { pubKey } from '../global';

const publicRouter = new Router();

publicRouter.get('/public/rsa/pubkey', async (ctx) => {
  ctx.body = {
    success: true,
    pubKey
  };
})

export default publicRouter;