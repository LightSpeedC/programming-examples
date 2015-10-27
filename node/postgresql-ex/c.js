console.log('\n見映えが悪い。配列に無理やり押し込んでる。\n',
	[11, 22, 33].reduce((a, v, i)=>(a[a[i]] = v, a), ['x', 'y', 'z'])
	);

console.log('\n見映えが悪い。"_"の要素に配列がある。\n',
	[11, 22, 33].reduce((a, v, i)=>(a[a._[i]] = v, a), {_:['x', 'y', 'z']})
	);

console.log('\nキレイだけどちょっと遅い。何も隠れていない。\n',
	[11, 22, 33].reduce((a, v, i)=>(a[Object.keys(a)[i]] = v, a), {x:0, y:0, z:0})
	);

console.log('\n見映えが良い。実は"_"の要素は見えない様に隠れている。\n',
	[11, 22, 33].reduce((a, v, i)=>(a[a._[i]] = v, a), Object.create(null, {_: {value: ['x', 'y', 'z']}}))
	);

console.log('\n見映えが良い。実は"_"の要素はプロトタイプに隠れている。\n',
	[11, 22, 33].reduce((a, v, i)=>(a[a._[i]] = v, a), Object.create({_: ['x', 'y', 'z']}))
	);
