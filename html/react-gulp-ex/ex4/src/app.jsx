'use strict';

//const React = require('react');
const createClass = require('react').createClass;
const render = require('react-dom').render;

const App = createClass({
	render: function () {
		return <h1>Hello App! {new Date + ''}</h1>;
	}
});

render(<App />, document.getElementById('container'));
