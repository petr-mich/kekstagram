const params = {
	NUMBER_OF_PICTURES: 25,
	count: 1,
	commentSentences: [
		'Всё отлично!',
		'В целом всё неплохо. Но не всё.',
		'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.' +
		' В конце концов это просто непрофессионально.',
		'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
		'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
		'Лица у людей на фотке перекошены, как будто их избивают.',
		'Как можно было поймать такой неудачный момент?!'
	],
	descriptionSentences: [
		'Тестим новую камеру!',
		'Затусили с друзьями на море',
		'Как же круто тут кормят',
		'Отдыхаем...',
		'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья.' +
			' Не обижайте всех словами......',
		'Вот это тачка!'
	]
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// КОНСТРУКТОР ИЗОБРАЖЕНИЙ:
class RandomPicture {
	constructor() {
		this.url = `photos/${params.count++}.jpg`;
		this.likes = getRandomIntInclusive(15, 200);
		this.comments = getRandomComments();
		this.description = params.descriptionSentences[getRandomIntInclusive(
			0, params.descriptionSentences.length - 1
		)];
	}
}
// массив случайно сгенерированных изображений:
const randomPictures = createRandomPicturesArr(params.NUMBER_OF_PICTURES);

export {randomPictures, getRandomIntInclusive};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ФУНКЦИИ:
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ГЕНЕРАЦИЯ СЛУЧАЙНЫХ ЧИСЕЛ:
function getRandomIntInclusive(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ГЕНЕРАТОР СЛУЧАЙНЫХ ПРЕДЛОЖЕНИЙ КОММЕНТАРИЕВ:
function getRandomSentences() {
	const sentences = [];
	const randomNumber = getRandomIntInclusive(1, 2);

	for (let i = 0; i < randomNumber; i++) {
		const sentence = params.commentSentences[getRandomIntInclusive(0, params.commentSentences.length - 1)];

		if (sentences.includes(sentence)) {
			i--;
			continue;
		}

		sentences.push(sentence);
	}

	return sentences.join(' ');
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ГЕНЕРАТОР СЛУЧАЙНЫХ КОММЕНТАРИЕВ:
function getRandomComments() {
	const comments = [];
	const randomNumber = getRandomIntInclusive(0, 5);

	for (let i = 0; i < randomNumber; i++) {
		const comment = getRandomSentences();

		if (comments.includes(comment)) {
			i--;
			continue;
		}

		comments.push(comment);
	}

	return comments;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// СОЗДАНИЕ МАССИВА СЛУЧАЙНЫХ ИЗОБРАЖЕНИЙ:
function createRandomPicturesArr(numberOfPictures) {
	const pictures = [];

	for (let i = 0; i < numberOfPictures; i++) {
		pictures.push(new RandomPicture());
	}

	return pictures;
}
