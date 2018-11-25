const tm = '2018-11-26 00:25';

const dt0 = new Date();
console.log(tm, dt0.toLocaleDateString(), dt0.toLocaleTimeString(), 'loaded');

export default () => {
	const dt = new Date();
	console.log(tm, dt.toLocaleDateString(), dt.toLocaleTimeString() /*, req.method, req.url*/);

	return <div>
		Hello world!<br/>
		build: {tm}<br/>
		load: {dt0.toLocaleDateString() + ' ' + dt0.toLocaleTimeString()}<br/>
		req: {dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()}<br/>
	</div>
}
