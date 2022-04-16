import Router from 'koa-router';
import userRouter from './userRouter';
import stockRouter from './stockRouter';
import transactionRouter from './transactionRouter';
import publicRouter from './publicRouter';
import chatRouter from './chatRouter';

const router = new Router();
const viewRouter = new Router();

viewRouter
	.get('/404', async (ctx) => {
		await ctx.render('404', {
			title: 'haha',
		});
	})
	.get('/no_permission', async (ctx) => {
		await ctx.render('noPermission');
	});

// 注册所有 api 路由
router.use(
	'/api/v1',
	userRouter.routes(),
	userRouter.allowedMethods(),
	chatRouter.routes(),
	chatRouter.allowedMethods()
);
router.use('/api/v1', stockRouter.routes(), stockRouter.allowedMethods());
router.use(
	'/api/v1',
	transactionRouter.routes(),
	transactionRouter.allowedMethods()
);
router.use('', publicRouter.routes(), publicRouter.allowedMethods());

// 注册页面路由
router.use('/page', viewRouter.routes(), viewRouter.allowedMethods());

export default router;
