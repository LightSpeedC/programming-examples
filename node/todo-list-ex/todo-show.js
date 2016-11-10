	'use strict';

	const util = require('util');
	const todoList = require('./todo-list');

	const todoRoot = {};

	todoSet(todoRoot, todoList);
	console.log('\n*todoRoot');
	console.log(util.inspect(todoRoot, {depth: null, colors: true}));
	console.log('\n*todoList');
	console.log(util.inspect(todoList, {depth: null, colors: true}));

	function todoSet(root, todoList) {
		const temp = {};
		const list = todoList.map(todo => temp[todo.id] = merge({}, todo));
		console.log('\n*temp');
		console.log(util.inspect(temp, {depth: null, colors: true}));
		list.forEach(todo => {
			const par = todo.parent_id && temp[todo.parent_id] || root;
			if (!par.children) par.children = [];
			par.children.push(todo);
		});
	}

	// merge-light
	function merge(dst, src) {
		for (var i = 1; src = arguments[i], i < arguments.length; ++i)
			for (var p in src)
				if (src.hasOwnProperty(p) && !dst.hasOwnProperty(p) &&
						dst[p] !== src[p]) dst[p] = src[p];
		return dst;
	}

