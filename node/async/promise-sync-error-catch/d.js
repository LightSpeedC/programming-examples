console.log('111');
new Promise(res => res(JSON.parse('[1,2,3,4]')))
.then(val => console.log(val));
// [1,2,3]

console.log('222');
new Promise(res => res(JSON.parse('[1,2,3,4')))
.catch(e => console.error(e));
// SyntaxError: JSON.parse: end of data when ',' or ']' was expected

console.log('333');
