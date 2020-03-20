// шаблон для создания митиатюры изображения:
const templ = document.querySelector('template').content;
// блок разметки для вставки миниатюры изображений:
const thumbnailBlock = document.querySelector('.pictures');

export default insertThumbnails;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ФУНКЦИИ:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// СОЗДАНИЕ МИНИАТЮРЫ ИЗОБРАЖЕНИЯ:
function createThumbnail(obj, indexOfObjInArr, template) {
	const elem = template.querySelector('.picture').cloneNode(true);

	elem.querySelector('img').src = obj.url;
	elem.querySelector('.picture-likes').textContent = obj.likes;
	elem.querySelector('.picture-comments').textContent = obj.comments.length;
	elem.indexOfObjInArr = indexOfObjInArr;

	return elem;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ВСТАВКА МИНИАТЮР ИЗОБРАЖЕНИЙ В РАЗМЕТКУ:
function insertThumbnails(arrOfObj, template = templ, block = thumbnailBlock) {
	const thumbnails = [];

	arrOfObj.forEach((item, index) => {
		thumbnails.push(createThumbnail(item, index, template));
	});

	block.append(...thumbnails);
}
