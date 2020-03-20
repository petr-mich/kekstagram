import {DropFIReader} from './fi-reader.js';
import Slider from './slider.js';
import {preventShiftToPrevElem, preventShiftToNextElem} from './gallery.js';
import Validator from './validator.js';
import backend from './backend.js';

const scales = {
	SIZE_DEFAULT: '100%',
	STEP: 25,
	SIZE_MIN: 25,
	SIZE_MAX: 100
};
// форма загрузки изображения:
const uploadForm = document.upload;

const dropFIReader = new DropFIReader({
	fileTypes: ['jpeg', 'jpg', 'png', 'gif'],
	fileInput: uploadForm.filename,
	dropbox: uploadForm.filename.labels[0],
	resultHandler: openImageEditor
});
// блок для редактирования изображения:
const imageEditor = uploadForm.querySelector('.upload-overlay');
const imagePreview = imageEditor.querySelector('.effect-image-preview');
const imagePreviewDefault = imagePreview.src;
const resizeControls = imageEditor.querySelector('.upload-resize-controls');
const resizeInput = resizeControls.elements.scale;

const slider = new Slider({
	elem: imageEditor.querySelector('.upload-effect-level'),
	line: imageEditor.querySelector('.upload-effect-level-line'),
	thumb: imageEditor.querySelector('.upload-effect-level-pin'),
	volume: imageEditor.querySelector('.upload-effect-level-val'),
	resultHandler: handleSliderValue
});

const effectControls = imageEditor.querySelector('.upload-effect-controls');
const effectImages = effectControls.querySelectorAll('.upload-effect-preview');
const closeEditorButton = imageEditor.querySelector('#upload-cancel');
// поля, при фокусе на которых предотвращается закрытие редактора изображений:
const preventInputs = [
	uploadForm.hashtags,
	uploadForm.description
];

const formsHandlers = {
	'upload': {
		onSuccess: handleUploadSuccess,
		onError: handleUploadError
	}
};

const validator = new Validator(form => {
	backend.sendRequest({form})
		.then(response => formsHandlers[form.name].onSuccess(response))
		.catch(error => formsHandlers[form.name].onError(error));
});

resizeControls.addEventListener('click', evt => {
	const target = evt.target.closest('.upload-resize-controls-button');

	if (target && resizeControls.contains(target)) {
		setImagePreviewScale(target);
	}
});
// первоначальное значение поля масштаба изображения:
resizeInput.value = scales.SIZE_DEFAULT;

effectControls.addEventListener('change', evt => {
	const target = evt.target.closest('[name=effect]');

	if (target && effectControls.contains(target)) {
		const effect = target.value;

		setImagePreviewEffect(effect);
	}
});
// предотвращаем выход (с помощью клавиши 'Tab') из редактора изображения:
const imgEdTabElems = [...imageEditor.getElementsByTagName('*')].filter((elem) => elem.tabIndex >= 0);

imgEdTabElems[0].addEventListener('keydown', preventShiftToPrevElem);
imgEdTabElems[imgEdTabElems.length - 1].addEventListener('keydown', preventShiftToNextElem);

closeEditorButton.addEventListener('click', evt => {
	// убираем действие по умолчанию с целью предотвращения лишнего вызова метода '.reset()' для формы:
	evt.preventDefault();

	closeImageEditor();
});

document.addEventListener('DOMContentLoaded', validator.initValidation);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ФУНКЦИИ:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ОТКРЫТИЕ РЕДАКТОРА ИЗОБРАЖЕНИЙ:
function openImageEditor(images) {
	renderUploadForm(images[0]);

	imageEditor.classList.remove('hidden');
	imageEditor.focus();

	document.body.classList.add('modal-open');

	document.addEventListener('keydown', closeImageEditorWithEsc);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// УСТАНОВКА ПЕРВОНАЧАЛЬНЫХ ЗНАЧЕНИЙ РЕДАКТОРА ИЗОБРАЖЕНИЙ:
function renderUploadForm(image) {

	for (let item of effectImages) {
		item.style.backgroundImage = `url(${image})`;
	}

	imagePreview.src = image;
	slider.hide();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// УСТАНОВКА РЕДАКТОРА ИЗОБРАЖЕНИЯ СОГЛАСНО ТЕКУЩЕМУ ВЫБОРУ ЭФФЕКТА:
function setImagePreviewEffect(effect) {

	(effect === 'none') ? slider.hide() : slider.show();

	imagePreview.className = `effect-image-preview effect-${effect}`;
	slider.reset();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ИЗМЕНЕНИЕ МАСШТАБА ПРОСМАТРИВАЕМОГО ИЗОБРАЖЕНИЯ:
function setImagePreviewScale(elem) {
	const hasClass = (cls) => elem.classList.contains(cls);
	let scale = parseInt(resizeInput.value);

	switch (true) {
		case hasClass('upload-resize-controls-button-dec'):
			scale = (scale === scales.SIZE_MIN) ? scales.SIZE_MIN : scale - scales.STEP;
			break;
		case hasClass('upload-resize-controls-button-inc'):
			scale = (scale === scales.SIZE_MAX) ? scales.SIZE_MAX : scale + scales.STEP;
			break;
	}

	resizeInput.value = `${scale}%`;
	imagePreview.style.transform = `scale(${scale / 100})`;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТКА ДРОБНОГО ЗНАЧЕНИЯ, ПОЛУЧЕННОГО РЕЗУЛЬТАТЕ ПЕРЕДВИЖЕНИЯ ТУМБЛЕРА СЛАЙДЕРА:
function handleSliderValue(ratio) {
	uploadForm['effect-level'].value = Math.round(ratio * 100);
	renderImagePreview(ratio);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// РАСЧЕТ ЗНАЧЕНИЯ ЭФФЕКТА, НАЛОЖЕННОГО НА ИЗОБРАЖЕНИЕ 'imagePreview':
function renderImagePreview(ratio) {
	const effects = {
		'chrome': `grayscale(${ratio})`,
		'sepia': `sepia(${ratio})`,
		'marvin': `invert(${ratio * 100}%)`,
		'phobos': `blur(${ratio * 3}px)`,
		'heat': `brightness(${ratio * 2 + 1})`,
		'none': ''
	};
	const effectCurrent = uploadForm.effect.value;

	imagePreview.style.filter = effects[effectCurrent];
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТКА УСПЕШНОЙ ОТПРАВКИ 'uploadForm':
function handleUploadSuccess() {
	blurFocusedInput(preventInputs);
	closeImageEditor();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// СНЯТИЕ ФОКУСА С ПОЛЕЙ ВВОДА ФОРМЫ 'uploadForm':
function blurFocusedInput([...args]) {
	for (let input of args) {
		if (input === document.activeElement) {
			input.blur();
			break;
		}
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТКА ОШИБКИ ПРИ БЕЗУСПЕШНОЙ ОТПРАВКЕ 'uploadForm':
function handleUploadError(error) {
	const errorBlock = uploadForm.querySelector('.img-upload-message-error');
	const repeatLink = errorBlock.querySelector('.error-link-repeat');
	const loadAnotherLink = errorBlock.querySelector('.error-link-load-another');

	errorBlock.classList.remove('hidden');

	repeatLink.onclick = () => {
		errorBlock.classList.add('hidden');
		repeatLink.onclick = loadAnotherLink.onclick = null;
		// предотвращаем переход по ссылке по умолчанию:
		return false;
	};

	loadAnotherLink.onclick = () => {
		errorBlock.classList.add('hidden');

		blurFocusedInput(preventInputs);
		closeImageEditor();

		loadAnotherLink.onclick = repeatLink.onclick = null;
		// предотвращаем переход по ссылке по умолчанию:
		return false;
	};

	console.error(error);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ЗАКРЫТИЕ БЛОКА РЕДАКТИРОВАНИЯ ИЗОБРАЖЕНИЯ С ПОМОЩЬЮ КЛАВИШИ 'Escape':
function closeImageEditorWithEsc(evt) {
	if (evt.key === 'Escape') {
		closeImageEditor();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ЗАКРЫТИЕ БЛОКА РЕДАКТИРОВАНИЯ ИЗОБРАЖЕНИЯ:
function closeImageEditor() {
	for (let input of preventInputs) {
		if (input === document.activeElement) {
			return;
		}
	}
	resetUploadForm();

	imageEditor.classList.add('hidden');
	document.body.classList.remove('modal-open');

	document.removeEventListener('keydown', closeImageEditorWithEsc);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// УСТАНОВКА ЗНАЧЕНИЙ ФОРМЫ 'uploadForm' ПО УМОЛЧАНИЮ:
function resetUploadForm() {
	uploadForm.reset();

	for (let item of effectImages) {
		item.style.backgroundImage = '';
	}

	imagePreview.src = imagePreviewDefault;
	imagePreview.style.transform = '';
	resizeInput.value = scales.SIZE_DEFAULT;

	setImagePreviewEffect('none');
}
