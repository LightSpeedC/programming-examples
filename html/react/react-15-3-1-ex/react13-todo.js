var TodoList = React.createClass({
	render() {
		return <ul>{this.props.items.map(
			item => <li key={item.id}>{item.text}</li>
		)}</ul>;
	}
});
var TodoApp = React.createClass({
	getInitialState() {
		return {items: [], text: ''};
	},
	onChange(e) {
		this.setState({text: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
		var nextText = '';
		this.setState({items: nextItems, text: nextText});
	},
	render() {
		return (
			<div>
				<h3>TODO</h3>
				<TodoList items={this.state.items} />
				<form onSubmit={this.handleSubmit}>
					<input onChange={this.onChange} value={this.state.text} />
					<button>{'Add #' + (this.state.items.length + 1)}</button>
				</form>
			</div>
		);
	}
});

ReactDOM.render(<TodoApp />, mountNode);
