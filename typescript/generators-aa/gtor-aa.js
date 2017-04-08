"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// declare function require(mod: string) : any;
const wait = (msec, val) => new Promise(resolve => setTimeout(resolve, msec, val));
// const aa = require('aa');
const aa = require("aa");
function aaa() {
    return aa(function* () {
        console.log(yield wait(200, 'a'));
        console.log(yield wait(200, 'b'));
        console.log(yield wait(200, 'c'));
    });
}
aaa();
