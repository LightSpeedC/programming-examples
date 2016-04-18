// ai.js

void function () {
    'use strict';

    const net = require('net');

    module.exports = ai;

    function ai(config) {
        net.createServer(config.ai, c => {
            //
        });
    }
}();
