// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
	res.json({
		req: {
			method: req.method,
			url: req.url,
			query: req.query,
			body: req.body,
		},
	});
	// res.send({ name: 'John Doe' });
};
