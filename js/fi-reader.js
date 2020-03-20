// РАСШИРЕННЫЙ КЛАСС ДЛЯ ЧТЕНИЯ ФАЙЛА ИЗ 'input' type="file":
export class FIReader {
	constructor({fileInput, resultHandler, fileTypes}) {
		this._fileTypes = fileTypes;
		this._fileInput = fileInput;
		this._resultHandler = resultHandler;
		this._fileInput.addEventListener('change', this.onFileInputChange.bind(this));
	}

	onFileInputChange() {
		this.handleFiles(this._fileInput.files);
	}

	// С ИСПОЛЬЗОВАНИЕМ ПРОМИСОВ:
	handleFiles(files) {
		let promises = [];

		for (let file of files) {

			if (this._fileTypes) {
				const matches = this._fileTypes.some((item) => file.name.endsWith(item));

				if (!matches) {
					continue;
				}
			}

			promises.push(new Promise(resolve => {

				const reader = new FileReader();

				reader.onload = evt => {
					resolve(evt.currentTarget.result);
				};

				reader.readAsDataURL(file);

			}));
		}

		Promise.allSettled(promises)
			.then(promisesResults => this._resultHandler(promisesResults.map(result => result.value)));
	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////
	// БЕЗ ИСПОЛЬЗОВАНИЯ ПРОМИСОВ:
	// handleFiles(files) {
	// 	let results = [];

	// 	for (let file of files) {

	// 		if (this._fileTypes) {
	// 			const matches = this._fileTypes.some((item) => file.name.endsWith(item));

	// 			if (!matches) {
	// 				continue;
	// 			}
	// 		}

	// 		const reader = new FileReader();

	// 		reader.onload = evt => {
	// 			results.push(evt.currentTarget.result);

	// 			if (results.length === files.length) {
	// 				this._resultHandler(results);
	// 			}
	// 		}
	// 		reader.readAsDataURL(file);
	// 	}
	// }
	/////////////////////////////////////////////////////////////////////////////////////////////////////

	reset() {
		this._fileInput.files = new DataTransfer().files;
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// РАСШИРЕННЫЙ КЛАСС ДЛЯ ЧТЕНИЯ ФАЙЛА ИЗ 'input' type="file" (С ТЕХНОЛОГИЕЙ 'drag & drop'):
export class DropFIReader extends FIReader {
	constructor({fileInput, resultHandler, fileTypes, dropbox}) {
		super({fileInput, resultHandler, fileTypes});
		this._dropbox = dropbox;
		this._dropbox.addEventListener('dragenter', this.onDrag.bind(this));
		this._dropbox.addEventListener('dragover', this.onDrag.bind(this));
		this._dropbox.addEventListener('drop', this.onDrop.bind(this));
	}

	onDrag(evt) {
		evt.stopPropagation();
		evt.preventDefault();
	}

	onDrop(evt) {
		evt.stopPropagation();
		evt.preventDefault();

		if (this._fileInput.disabled ||
			this._fileInput.closest('fieldset') && this._fileInput.closest('fieldset').disabled) {
			return;
		}

		let files = evt.dataTransfer.files;

		if (files.length > 1 && !this._fileInput.multiple) {
			return;
		}

		this._fileInput.files = files;
		this.handleFiles(files);
	}
}
