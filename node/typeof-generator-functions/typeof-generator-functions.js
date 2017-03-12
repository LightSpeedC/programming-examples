// http://qiita.com/kura07/items/d1a57ea64ef5c3de8528

function isGeneratorFunction(func){
	return typeof func === "function" && func.constructor.name === "GeneratorFunction";
	// return typeof func === "function" && func.constructor === function*(){}.constructor;
	// return typeof func === "function" && func instanceof function*(){}.constructor;
	// return typeof func === "function" && Object.getPrototypeOf(func) === Object.getPrototypeOf(function*(){})
}

function normalFunc(){}
function* generatorFunc(){}
console.log( isGeneratorFunction(normalFunc) ); // false
console.log( isGeneratorFunction(generatorFunc) ); // true
