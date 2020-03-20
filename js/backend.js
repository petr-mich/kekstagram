class Backend {
	constructor() {
		this._methods = {
			'get': this.getData,
			'post': this.postData
		};
	}

	sendRequest({form, jsonType}) {
		return this._methods[form.method](arguments[0]);
	}

	getData({form, url}) {

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			url = form ? form.action : url;

			xhr.open('GET', url);
			xhr.responseType = 'json';

			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					resolve(xhr.response);
					// alert('Данные успешно загружены!');
				} else {
					reject(new Error(`Ошибка: ${xhr.status} ${xhr.statusText}`));
				}
			});
			xhr.addEventListener('error', () => reject(new Error('Произошла ошибка соединения')));

			xhr.send();
		});
	}

	postData({form, jsonType}) {

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			xhr.open('POST', form.action);

			xhr.addEventListener('load', () => {
				if (xhr.status === 200) {
					resolve();
					// alert('Данные успешно отправлены!');
				} else {
					reject(new Error(`Ошибка: ${xhr.status} ${xhr.statusText}`));
				}
			});
			xhr.addEventListener('error', () => reject(new Error('Произошла ошибка соединения')));

			let data = new FormData(form);

			if (jsonType) {
				xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

				const obj = {};

				data.forEach((value, key) => obj[key] = value);
				data = JSON.stringify(obj);
			}

			xhr.send(data);
		});
	}
}

export default new Backend();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// БЕЗ ИСПОЛЬЗОВАНИЯ ПРОМИСОВ:
// class Backend {
// 	constructor() {
// 		this._methods = {
// 			'get': this.getData,
// 			'post': this.postData
// 		};
// 	}

// 	sendRequest({form, jsonType = false, onSuccess, onProgress, onError = this.showError}) {
// 		this._methods[form.method.toLowerCase()](arguments[0]);
// 	}

// 	getData({form, url, onSuccess, onProgress, onError = this.showError}) {
// 		const xhr = new XMLHttpRequest();
// 		url = form ? form.action : url;

// 		xhr.open('GET', url);
// 		xhr.responseType = 'json';

// 		xhr.addEventListener('load', () => {
// 			if (xhr.status === 200) {
// 				onSuccess(xhr.response);
// 				// alert('Данные успешно загружены!');
// 			} else {
// 				onError(`Ошибка: ${xhr.status} ${xhr.statusText}`);
// 			}
// 		});
// 		xhr.addEventListener('error', () => onError('Произошла ошибка соединения'));

// 		xhr.send();
// 	}

// 	postData({form, jsonType, onSuccess, onProgress, onError = this.showError}) {
// 		const xhr = new XMLHttpRequest();

// 		xhr.open('POST', form.action);

// 		xhr.addEventListener('load', () => {
// 			if (xhr.status === 200) {
// 				onSuccess();
// 				// alert('Данные успешно отправлены!');
// 			} else {
// 				onError(`Ошибка: ${xhr.status} ${xhr.statusText}`);
// 			}
// 		});
// 		xhr.addEventListener('error', () => onError('Произошла ошибка соединения'));

// 		let data = new FormData(form);

// 		if (jsonType) {
// 			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

// 			const obj = {};

// 			data.forEach((value, key) => obj[key] = value);
// 			data = JSON.stringify(obj);
// 		}

// 		xhr.send(data);
// 	}

// 	showError(text) {
// 		document.body.insertAdjacentHTML('beforeend', `<div id="default-error"><p>${text}</p></div>`);

// 		const errorBlock = document.getElementById('default-error');
// 		const errorText = errorBlock.firstElementChild;

// 		errorBlock.style = `position: fixed;
// 							top: 0;
// 							left: 0;
// 							z-index: 9999;
// 							width: 100%;
// 							height: 100%;
// 							background-color: rgba(255, 146, 0, 0.9);`;
// 		errorText.style =  `position: absolute;
// 							top: 30%;
// 							left: 50%;
// 							transform: translateX(-50%);
// 							padding: 10px 20px;
// 							font-family: 'Verdana', sans-serif;
// 							line-height: 50px;
// 							font-size: 30px;
// 							font-weight: 700;
// 							color: rgba(0, 0, 0, 1);
// 							text-align: center;
// 							text-transform: uppercase;
// 							background-color: rgba(255, 146, 0, 1);
// 							border-radius: 5px;
// 							box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.5);`;
// 		setTimeout(function() {
// 			errorBlock.remove();
// 		}, 5000);
// 	}
// }
