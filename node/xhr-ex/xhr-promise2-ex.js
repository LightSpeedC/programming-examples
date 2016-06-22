// http://js-next.hatenablog.com/entry/2013/11/28/093230

function ajax(url) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest
		xhr.open('GET', url)
		xhr.onload = function () {
			if (xhr.status == 200) {
				resolve(xhr.response) // 成功時
			} else {
				reject(new Error(xhr.statusText))  // 404エラーなど
			} 
		}
		xhr.onerror = reject // urlに問題がある場合など
		xhr.send()
	})
}
