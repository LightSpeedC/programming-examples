module.exports = {
	log: true,
	logsDirRoot: 'logs',
	services: {
		50000: {
			'::1': {
				id: 'localhost6',
				to: ['127.0.0.1', 51000],
			},
			'::ffff:127.0.0.1': {
				id: 'localhost4',
				to: ['127.0.0.1', 52000],
			},
			'*': {
				id: 'unknwon',
				to: ['127.0.0.1', 59000],
			},
		},
	},
};
