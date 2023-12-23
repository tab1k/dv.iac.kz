function appendLoader(message) {
	let innerMSG = 'Пожалуйста, подождите';
	if ( message != undefined ) { innerMSG = message; }
	$('body').append('<div class="loader"><div class="loader_inner"></div><div class="loader-text">' + innerMSG + '</div></div>');
}

function removeLoader() {
	$('.loader').remove();
}