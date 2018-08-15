module.exports = {
	log: true,
	ports: {
		8001: {
			"/": "http://localhost:8000",
			"/a": "http://localhost:8000/A",
			"/b": "http://localhost:8000/B",
			"/bb": "http://localhost:8000/BB",
		},
	},
};
