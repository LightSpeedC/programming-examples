function func(fn, val) {
	fn();
}

// 閉合(含合?) closure

var j = 0;
for (var i = 0; i < 10;  ++i) {
	setTimeout(() => { console.log(i, j); }, 10);

	// func(() => { console.log(i, j); }, 10);

	// (() => { console.log(i, j); })();
	// ((i, j) => { console.log(i, j); })(i, j);

	// ((i, j) => setTimeout(() => { console.log(i, j); }, 10))(i, j);
	++j;
}
i = 20;
