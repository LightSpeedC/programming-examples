require('node-thrust')(function(err, api) { 
	api.window({ root_url: 'https://www.google.com' }).show();
});
