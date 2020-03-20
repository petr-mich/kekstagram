// import {randomPictures, getRandomIntInclusive} from './random-picture.js';
import insertThumbnails from './thumbnail.js';
import backend from './backend.js';

// переменная для хранения фотографий, полученных при успешной загрузке данных с сервера:
let pictures = null;
// блок разметки с миниатюрами изображений:
const thumbnailBlock = document.querySelector('.pictures');
// блок для увеличенного изображения:
const gallery = document.querySelector('.big-picture');
// обнуление значений галереи:
resetGallery();

const closeGalleryButton = gallery.querySelector('.big-picture-cancel');

const preview = gallery.querySelector('.big-picture-preview');
// предотвращаем выход (с помощью клавиши 'Tab') из галереи:
const previewTabElems = [...preview.getElementsByTagName('*')].filter((elem) => elem.tabIndex >= 0);

previewTabElems[0].addEventListener('keydown', preventShiftToPrevElem);
previewTabElems[previewTabElems.length - 1].addEventListener('keydown', preventShiftToNextElem);

thumbnailBlock.addEventListener('click', openGallery);

closeGalleryButton.addEventListener('click', closeGallery);
closeGalleryButton.addEventListener('keydown', evt => {
	if (evt.key === 'Enter') {
		closeGallery();
	}
});

// предварительно скроем количество комментариев и кнопку загрузки новых комментариев:
gallery.querySelector('.social-comment-count').classList.add('hidden');
gallery.querySelector('.social-comment-loadmore').classList.add('hidden');
// для наглядности вставим случайно сгенерированные изображения:
// insertThumbnails(randomPictures);

backend.getData({url: 'https://js.dump.academy/kekstagram/data'})
	.then(response => {
		pictures = response;
		insertThumbnails(pictures);
	})
	.catch(error => showError(error));

export {preventShiftToPrevElem, preventShiftToNextElem, showError};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ФУНКЦИИ:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ПОКАЗ БЛОКА ГАЛЕРЕИ УВЕЛИЧЕННОГО ИЗОБРАЖЕНИЯ:
function openGallery(evt) {
	const target = evt.target.closest('.picture');

	if (!target || !this.contains(target)) {
		return;
	}
	// предотвращаем переход по ссылке по умолчанию:
	evt.preventDefault();

	renderGallery(pictures[target.indexOfObjInArr]);

	gallery.classList.remove('hidden');
	gallery.focus();

	document.body.classList.add('modal-open');

	document.addEventListener('keydown', closeGalleryWithEsc);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ПРЕДОТВРАЩЕНИЕ ПЕРЕХОДА С ПОМОЩЬЮ КЛАВИШИ 'Tab' НА ПРЕДЫДУЩИЙ ЭЛЕМЕНТ:
function preventShiftToPrevElem(evt) {
	if (evt.key === 'Tab' && evt.shiftKey) {
		evt.preventDefault();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ПРЕДОТВРАЩЕНИЕ ПЕРЕХОДА С ПОМОЩЬЮ КЛАВИШИ 'Tab' НА СЛЕДУЮЩИЙ ЭЛЕМЕНТ:
function preventShiftToNextElem(evt) {
	if (evt.key === 'Tab' && !evt.shiftKey) {
		evt.preventDefault();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// РЕНДИНГ БЛОКА ГАЛЕРЕИ УВЕЛИЧЕННОГО ИЗОБРАЖЕНИЯ:
function renderGallery(obj) {
	gallery.querySelector('.big-picture-img img').src = obj.url;
	gallery.querySelector('.likes-count').textContent = obj.likes;
	gallery.querySelector('.comments-count').textContent = obj.comments.length;
	gallery.querySelector('.social-caption').textContent = obj.description;
	
	let commentsBlock = gallery.querySelector('.social-comments');

	obj.comments.forEach((comment) => {
		commentsBlock.insertAdjacentHTML('beforeend',
			`<li class="social-comment social-comment-text"> 
			<img class="social-picture" 
			src=${comment.avatar}
			alt="Аватар комментатора фотографии" 
			width="35" 
			height="35">
			<p class="social-text">
			<a class="social-comment-author" href="#">${comment.name}</a>
			${comment.message}</p> 
			</li>`
		);
	});
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// ДЛЯ СЛУЧАЙНО СГЕНЕРИРОВАННЫХ ФОТОГРАФИЙ:
	// obj.comments.forEach((comment) => {
	// 	commentsBlock.insertAdjacentHTML('beforeend',
	// 		`<li class="social-comment social-comment-text"> 
	// 		<img class="social-picture" 
	// 		src="img/avatar-${getRandomIntInclusive(1, 6)}.svg" 
	// 		alt="Аватар комментатора фотографии" 
	// 		width="35" 
	// 		height="35"> 
	// 		<p class="social-text">${comment}</p> 
	// 		</li>`
	// 	);
	// });
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ЗАКРЫТИЕ БЛОКА ГАЛЕРЕИ УВЕЛИЧЕННОГО ИЗОБРАЖЕНИЯ:
function closeGallery() {
	gallery.classList.add('hidden');

	resetGallery();

	document.body.classList.remove('modal-open');

	document.removeEventListener('keydown', closeGalleryWithEsc);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ОБНУЛЕНИЕ ЗНАЧЕНИЙ ГАЛЕРЕИ УВЕЛИЧЕННОГО ИЗОБРАЖЕНИЯ:
function resetGallery() {
	gallery.querySelector('.big-picture-img img').src = '';
	gallery.querySelector('.likes-count').textContent = '';
	gallery.querySelector('.comments-count').textContent = '';
	gallery.querySelector('.social-caption').textContent = '';
	
	let commentsBlock = gallery.querySelector('.social-comments');
	// удаление существующих в разметке комментариев:
	while (commentsBlock.firstElementChild) {
		commentsBlock.firstElementChild.remove();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ЗАКРЫТИЕ БЛОКА ГАЛЕРЕИ УВЕЛИЧЕННОГО ИЗОБРАЖЕНИЯ С ПОМОЩЬЮ КЛАВИШИ 'Escape':
function closeGalleryWithEsc(evt) {
	if (evt.key === 'Escape') {
		closeGallery();
	}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ОТОБРАЖЕНИЕ ОШИБКИ ПРИ БЕЗУСПЕШНОЙ ОТПРАВКЕ / ПОЛУЧЕНИИ ДАННЫХ С СЕРВЕРА:
function showError(error) {
	document.body.insertAdjacentHTML('beforeend',
		`<div id="default-error"><p>${error.message}</p></div>`);

	const errorBlock = document.getElementById('default-error');
	const errorText = errorBlock.firstElementChild;

	errorBlock.style = `position: fixed;
						top: 0;
						left: 0;
						z-index: 9999;
						width: 100%;
						height: 100%;							
						background-color: rgba(255, 146, 0, 0.9);`;
	errorText.style = `position: absolute;
						top: 30%;
						left: 50%;
						transform: translateX(-50%);
						padding: 10px 20px;
						font-family: 'Verdana', sans-serif;
						line-height: 50px;
						font-size: 30px;
						font-weight: 700;
						color: rgba(0, 0, 0, 1);
						text-align: center;
						text-transform: uppercase;
						background-color: rgba(255, 146, 0, 1);
						border-radius: 5px;
						box-shadow: 6px 6px 10px 0 rgba(0, 0, 0, 0.5);`;

	console.error(error);

	setTimeout(function() {
		errorBlock.remove();
	}, 5000);
}
