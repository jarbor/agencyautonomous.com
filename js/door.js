import ready from './modules/ready.js'

ready(function() {
	let $ = document.querySelector.bind(document);
	let onBodyClick = function() {
		$('body').classList.toggle('open')
	};

	$('body').addEventListener('click', onBodyClick);
});