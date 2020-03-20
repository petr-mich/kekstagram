export default class Validator {
	constructor(resultHandler) {
		// варианты валидации формы:
		this._validations = {
			'email': this.validateEmail.bind(this),
			'hashtag': this.validateHashtag.bind(this),
			'text': this.validateText.bind(this)
		};

		this._validationFields = [];
		this.initValidation = this.initValidation.bind(this);
		this._resultHandler = resultHandler;
	}

	initValidation() {
		[...document.forms].forEach(form => {
			let formValidation = false;

			const valFields = [...form.elements].filter(field => field.dataset.val);

			this._validationFields = this._validationFields.concat(valFields);

			valFields.forEach(field => {
				field.addEventListener('change', this.onFieldChange.bind(this));
				formValidation = true;
			});

			if (formValidation) {
				form.addEventListener('submit', this.onFormSubmit.bind(this));
				form.addEventListener('reset', this.onFormReset.bind(this));
			}
		});
	}

	onFieldChange(evt) {
		const field = evt.currentTarget;

		this._validations[field.dataset.val.toLowerCase()](field);
	}

	validateEmail(field) {
		this.removeError(field);
		const add = this.addError;
		const email = field.value.trim();

		if (field.hasAttribute('data-val-required') && !email) {
			add(field, `Обязательное поле для заполнения`);
			return;
		}

		if (email) {
			if (!(/\b[a-z0-9._]+@[a-z0-9.-]+\.[a-z]{2,4}\b/.test(email))) {
				add(field, `Неверно указан адрес электронной почты.
							Пример для заполнения: ivanov.ivan@email.com`);
				return;
			}
		}
	}

	validateHashtag(field) {
		this.removeError(field);
		const add = this.addError;
		const hashtags = field.value.toLowerCase().trim().split(/\s+/);

		if (field.hasAttribute('data-val-required') && hashtags == '') {
			add(field, `Обязательное поле для заполнения`);
			return;
		}

		if (hashtags != '') {
			for (let hashtag of hashtags) {
				switch (true) {
					case !hashtag.startsWith('#'):
						add(field, `Хештег должен начинаться с символа "#" (решетка)`);
						return;
					case /^#$/.test(hashtag):
						add(field, `Хештег не может состоять из одного символа "#" (решетка)`);
						return;
					case hashtag.match(/#/g).length > 1:
						add(field, `Хештег не может содержать несколько символов "#" (решетка)`);
						return;
					case /[^a-zа-я0-9_]/i.test(hashtag.slice(1)):
						add(field, `Хештег может содержать только алфавитно-цифровые символы
									и символ подчеркивания`);
						return;
					case hashtags.filter((item) => item === hashtag).length > 1:
						add(field, `Хештег не должен повторяться`);
						return;
						// указан атрибут 'data-val-maxlength':
					case field.dataset.valMaxlength && hashtag.length > field.dataset.valMaxlength:
						add(field, `Длина хештега не должна превышать ${field.dataset.valMaxlength}
				 					символов (включая символ "#" (решетка))`);
						return;
						// указан атрибут 'data-val-maxnumber':
					case field.dataset.valMaxnumber && hashtags.length > field.dataset.valMaxnumber:
						add(field, `Количество хештегов не должно превышать ${field.dataset.valMaxnumber}.
					 				Текущее количество: ${hashtags.length}`);
						return;
				}
			}
		}
	}

	validateText(field) {
		this.removeError(field);
		const add = this.addError;
		const text = field.value.trim();

		if (field.hasAttribute('data-val-required') && !text) {
			add(field, `Обязательное поле для заполнения`);
			return;
		}

		if (text) {
			// указан атрибут 'data-val-maxlength':
			if (field.dataset.valMaxlength && field.value.length > field.dataset.valMaxlength) {
				add(field, `Количество символов не должно превышать ${field.dataset.valMaxlength}.
					 		Текущее количество: ${field.value.length}`);
				return;
			}
		}
	}

	onFormSubmit(evt) {
		evt.preventDefault();
		let IsValid = true;

		const form = evt.currentTarget;
		const fields = this._validationFields.filter(field => field.form === form);

		for (let field of fields) {
			this._validations[field.dataset.val.toLowerCase()](field);

			if (field.classList.contains('invalid')) {
				IsValid = false;
				break;
			}
		}

		if (IsValid) {
			if (this._resultHandler) {
				this._resultHandler(form);
			}
		} /*else {
			evt.preventDefault();
			alert('Допущены ошибки при заполнении формы.');
		}*/
	}

	onFormReset(evt) {
		const form = evt.currentTarget;

		this.removeAllErrors(form);
	}

	addError(field, errorText) {
		const fieldLeft = field.getBoundingClientRect().left - field.parentNode.getBoundingClientRect().left;
		const fieldBottom = field.getBoundingClientRect().bottom - field.parentNode.getBoundingClientRect().top;
		const error = document.createElement('span');

		field.classList.add('invalid');
		field.parentNode.style.position = 'relative';

		error.classList.add('invalid-message');
		error.style = `position: absolute;
						z-index: 100;
						left: ${fieldLeft}px;
						top: ${fieldBottom}px;
						userSelect: none;`;
		error.textContent = errorText;

		field.parentNode.append(error);
		field.invalidField = error;
	}

	removeError(field) {
		if (field.classList.contains('invalid')) {
			field.classList.remove('invalid');
			field.invalidField.remove();
			delete field.invalidField;
			field.parentNode.style.position = '';
		}
	}

	removeAllErrors(form) {
		this._validationFields.filter(field => field.form === form)
							  .forEach(field => this.removeError(field));
	}
}
