// @ts-check

main().catch(console.error);

async function main() {
	const wait1 = msec => new Promise(res => setTimeout(res, msec));
	const wait2 = msec => ({then: res => setTimeout(res, msec)});

	console.log('=============');
	await wait1(500);
	console.log('=============');
	await wait1(500);
	console.log('=============');
	await wait1(500);

	console.log('=============');
	await wait2(500);
	console.log('=============');
	await wait2(500);
	console.log('=============');
	await wait2(500);
}
