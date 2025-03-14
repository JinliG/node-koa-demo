import Router from 'koa-router';
import aiChatModel from '../models/aiChatModel';

const chatRouter = new Router();

chatRouter.get('/chat/ai/complete', async (ctx) => {
  const aiChat = aiChatModel.getInstance();
  const { msg } = ctx.request.query;

  const res = await aiChat.complete(msg || '');
  ctx.body = {
    status: res.status,
    statusText: res.statusText,
    data: res.data
  };
});

export default chatRouter;