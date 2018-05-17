//#common/js/jsx/app.jsx
// Reactをインポート
import React from "react";
import ReactDOM from "react-dom";

// コンポーネント
class Test extends React.Component {
	render(){
		return (
			<h1>React.jsのテスト</h1>
		);
	}
}
// レンダリング
ReactDOM.render(
	<Test />,
	document.getElementById('container')
);
