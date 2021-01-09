// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const sleep = msec => ({ then: res => setTimeout(res, msec) });

export default async (req, res) => {
	// res.statusCode = 200
	await sleep(3000);
	res.status(200).json({ name: 'John Doe' });
};
