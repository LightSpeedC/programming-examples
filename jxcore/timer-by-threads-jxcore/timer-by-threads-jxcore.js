var threadId = process.threadId || 0;
var delay = 1000 * (threadId + 1 );

setTimeout(function () {
    console.log("I'm here after " + (delay / 1000) +
        " secs. ThreadId: ", threadId);
}, delay);

console.log("I'm here immediately. ThreadID: " + threadId);
