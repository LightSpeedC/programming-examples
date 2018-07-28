new Promise(res => res(JSON.parse('[1,2,3,4]')))
.then(val => console.log(val));
// [1,2,3]

new Promise(res => res(JSON.parse('[1,2,3,4')))
.catch(e => console.error(e));
// SyntaxError: JSON.parse: end of data when ',' or ']' was expected
