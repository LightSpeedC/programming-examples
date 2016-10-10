var React = require('react');
var render = require('react-dom').render;
var Child = require('./child.react.js');

render(
	<Child />,
	document.getElementById('container')
);
