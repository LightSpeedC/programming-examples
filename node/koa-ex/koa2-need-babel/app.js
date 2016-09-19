// Koa application is now a class and requires the new operator. 
const app = new Koa();

// uses async arrow functions 
app.use(async (ctx, next) => {
	try {
		await next(); // next is now a function 
	} catch (err) {
		ctx.body = { message: err.message };
		ctx.status = err.status || 500;
	}
});

app.use(async ctx => {
	const user = await User.getById(ctx.session.userid); // await instead of yield 
	ctx.body = user; // ctx instead of this 
});
