const { snapshot } = require("process-list");
main();
async function main() {
	{
		const tasks = await snapshot('pid', 'name');
		console.log(tasks);
	}

	{
		const tasks = await snapshot(
			'pid',			// : Number - process pid
			'ppid',			// : Number - parent process pid
			'name',			// : String - process name (title)
			'path',			// : String - full path to the process binary file
			'threads',		// : Number - threads per process
			'owner',		// : String - the owner of the process
			'priority',		// : Number - an os-specific process priority
			'cmdline',		// : String - full command line of the process
			'starttime',	// : Date - the process start date / time
			'vmem',			// : String - virtual memory size in bytes used by process
			'pmem',			// : String - physical memory size in bytes used by process
			'cpu',			// : Number - cpu usage by process in percent
			'utime',		// : String - amount of time in ms that this process has been scheduled in user mode
			'stime');		// : String - amount of time that in ms this process has been scheduled in kernel mode
		tasks
			.filter(x => x.owner === process.env.username)
			.filter(x => x.name !== 'chrome.exe')
			.filter(x => !console.log(x))
			.map(x => pad(x.name, 30) + x.cmdline)
			.forEach(x => console.log(x));
	}
}

function pad(s, n) {
	return (s + '                                             ').substr(0, n)
}
