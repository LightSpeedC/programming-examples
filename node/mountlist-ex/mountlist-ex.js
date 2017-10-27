const mountlist = require('mountlist');

main();

async function main() {
	const list = await mountlist.getList();
	console.log(list);
}
