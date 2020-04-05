import React from 'react';
import jsonStringify from '../lib/json-stringify';
import * as fetch from 'isomorphic-fetch';
import { withRouter } from 'next/router';

export default withRouter(class extends React.Component {
	static async getInitialProps (args) {
		// const res = await fetch('https://api.company.com/user/123')
		// const data = await res.json()
		// return { username: data.profile.username };
		// const keys = Object.keys(args).reduce((a, x) => (a[x] = Object.prototype.toString.call(args[x]), a), {});
		return { username: 'nishizawa', getInitialProps: JSON.parse(jsonStringify(args)), pathname: args.pathname, query: args.query, asPath: args.asPath };
		// , getInitialProps: args };
	}
	render() {
		return <pre>
			this.props: {jsonStringify(this.props, null, ':  ', '=')}
		</pre>;
	}
/*
	static async getInitialProps ({ res }) {
		return res
			? { userAgent: res.headers['user-agent'] }
			: { userAgent: navigator.userAgent }
	}
*/
});
