const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

async function wait(msec) {
	console.log('111');
	await sleep(msec);
	console.log('222');
	await sleep(msec);
	console.log('333');
}

wait(500);
