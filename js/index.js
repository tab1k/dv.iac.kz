$(document).ready(function() {

	// LOCALS

	function getLocals() {
		return $.ajax({ 
			type: "GET", 
			url: 'locals.php',
			data: { 'getLocalsJSON': true },
			dataType: 'json'
		});
	}

	getLocals().then(function(json) {

		translations = json;

		// EDU FORMS

		translations['kk']['eduForms.1'] = 'күндізгі'; translations['ru']['eduForms.1'] = 'очная';
		translations['kk']['eduForms.2'] = 'кешкі'; translations['ru']['eduForms.2'] = 'вечерняя';
		translations['kk']['eduForms.3'] = 'сырттай'; translations['ru']['eduForms.3'] = 'заочная';
		translations['kk']['eduForms.4'] = 'экстернат'; translations['ru']['eduForms.4'] = 'экстернат';
		translations['kk']['eduForms.5'] = 'қашықтықтан оқыту'; translations['ru']['eduForms.5'] = 'дистанционное обучение';
		translations['kk']['eduForms.7'] = 'күндізгі (ҚОТ қолданумен)'; translations['ru']['eduForms.7'] = 'очная (с применением ДОТ)';

		// STUDENT INFO PRELOADER

		function tryGetParams() {
			var iin = findGetParameter('iin'), diploma_series = findGetParameter('diploma_series'), diploma_number = findGetParameter('diploma_number');
			if ( iin != undefined ) { $('#iin-field').val(iin); }
			if ( diploma_series != undefined ) { $('#diploma-series-field').val(diploma_series); }
			if ( diploma_number != undefined ) { $('#diploma-number-field').val(diploma_number); }
			if ( diploma_series != undefined && diploma_number != undefined ) { process(iin, diploma_series, diploma_number); }
		}

		tryGetParams();

	});

	// SRC DATA VALIDITY

	function isFilled() {

		// RULES

		var validationRules = [
			{ code: 'IINinvalid', field: $('#iin-field'), result: $('#iin-field').val().length > 0 && $('#iin-field').val().match('[0-9]{12}') == null },
			{ code: 'DiplomaSeriesUnfilled', field: $('#diploma-series-field'), result: $('#diploma-series-field').val().length == 0 },
			{ code: 'DiplomaNumberUnfilled', field: $('#diploma-number-field'), result: $('#diploma-number-field').val().length == 0 }
		];

		// PRE-VALIDATION CLEARANCE

		$('.help-block.with-errors').empty();

		// VALIDATION

		var validationResults = validationRules.filter(e => e.result == true);

		if ( validationResults.length > 0 ) {
			validationResults.forEach(function(validation) {
				switch (validation.code) {
					case 'IINinvalid': validation.field.siblings('.help-block.with-errors').html('ИИН указан некорректно'); break;
					case 'DiplomaSeriesUnfilled': validation.field.siblings('.help-block.with-errors').html('Серия диплома не заполнена'); break;
					case 'DiplomaNumberUnfilled': validation.field.siblings('.help-block.with-errors').html('Номер диплома не заполнен'); break;
				}
			});
			return false; 
		} else { 
			return true;
		}

	}

	// VERIFICATION

	$('#verify-btn').click(function() {
		const iin = $('#iin-field').val(), diploma_series = $('#diploma-series-field').val(), diploma_number = $('#diploma-number-field').val();
		process(iin, diploma_series, diploma_number);
	});

	$('#iin-field, #diploma-series-field, #diploma-number-field').on('keypress',function(e) {
		if ( e.which == 13 ) { 
			const iin = $('#iin-field').val(), diploma_series = $('#diploma-series-field').val(), diploma_number = $('#diploma-number-field').val(); 
			process(iin, diploma_series, diploma_number); 
		}
	});

	//

	function validateRecaptcha() {

		return new Promise(function(resolve, reject) {

			grecaptcha.ready(function() {

				grecaptcha.execute('6LdDDq4UAAAAAKUEPY8km4ySkU1sBC11qaH5c8fh', { action: 'homepage' }).then(function(token) { 			

					resolve(token);

				});

			});

		});

	}
	
	//

	async function process(iin, diploma_series, diploma_number) {

		// Удаление результатов прошлой проверки (если они есть)

		if ( $('#verify-result').length == 1 ) { $('#verify-result').remove(); }

		// Не заполнено

		if ( isFilled() !== true ) { return; }

		// recaptcha token

		const token = await validateRecaptcha();

		// Лоадер

		appendLoader(translations[currentLocale]['pleasewait']);

		// API-запрос

		let json;

		try {

			json = await $.ajax({ 
				type: "POST", 
				url: '/vuz-verify/api/verify-api.php',
				data: { recaptcha_response: token, iin, diploma_series, diploma_number },
				dataType: 'json'
			});

		} catch (err) {

			console.log(err);

			$('#verify-result').html('<p style="color: red" data-localized="diploma-states-nodata">' + translations[currentLocale]['diploma-states-nodata'] + '</p>');

			return;

		} finally {

			removeLoader();
			
		}

		//

		$('#userforms').append('<div id="verify-result" class="bordered-container"></div>');

		// Если диплом валиден

	  	if ( json.result == 'success' && json.valid == true ) { 

	  		translations['kk']['activeRecordEduOrgName'] = json.record.eduOrgName.kk; 
	  		translations['ru']['activeRecordEduOrgName'] = json.record.eduOrgName.ru;

	  		translations['kk']['activeRecordSpeciality'] = json.record.specName.kk; 
	  		translations['ru']['activeRecordSpeciality'] = json.record.specName.ru;

	  		$('#verify-result').empty();

	  		$('#verify-result').append(`
	  			<div style="color: green" data-localized="diploma-states-valid">${translations[currentLocale]['diploma-states-valid']}</div>
	  		`);

	  		// Кем выдан

	  		$('#verify-result').append(`
	  			<div class="info-field">
	  				<div class="info-field-header" data-localized="diploma-info-issuer">${translations[currentLocale]['diploma-info-issuer']}</div>
	  				<div class="info-field-contents" data-localized="activeRecordEduOrgName">${json.record.eduOrgName[currentLocale]}</div>
	  			</div>
	  		`);

	  		// Полное ФИО

	  		$('#verify-result').append(`
	  			<div class="info-field">
	  				<div class="info-field-header" data-localized="diploma-info-fullname">${translations[currentLocale]['diploma-info-fullname']}</div>
	  				<div class="info-field-contents">${json.record.fullname}</div>
	  			</div>
	  		`);

	  		// Специальность

	  		$('#verify-result').append(`
	  			<div class="info-field">
	  				<div class="info-field-header" data-localized="diploma-info-speciality">${translations[currentLocale]['diploma-info-speciality']}</div>
	  				<div class="info-field-contents" data-localized="activeRecordSpeciality">${json.record.specName[currentLocale]}</div>
	  			</div>
	  		`);

	  		// Срок обучения

	  		if ( ['PD', 'PHD'].includes(diploma_series) == false ) {
	  			$('#verify-result').append(`
	  				<div class="info-field">
	  					<div class="info-field-header" data-localized="diploma-info-period">${translations[currentLocale]['diploma-info-period']}</div>
	  					<div class="info-field-contents">${json.record.enterYear} - ${json.record.leaveYear}</div>
	  				</div>
	  			`);
	  		}

	  		// Форма обучения

	  		$('#verify-result').append(`
	  			<div class="info-field">
	  				<div class="info-field-header" data-localized="diploma-info-eduform">${translations[currentLocale]['diploma-info-eduform']}</div>
	  				<div class="info-field-contents" data-localized="eduForms.${json.record.eduForm}">${translations[currentLocale]['eduForms.' + json.record.eduForm]}</div>
	  			</div>
	  		`);

	  		//

	  		history.pushState({iin: iin, diploma_series: diploma_series, diploma_number: diploma_number}, '', '?iin=' + iin + '&diploma_series=' + diploma_series + '&diploma_number=' + diploma_number);

		}

		// Если диплом не валиден

		if ( json.result == 'success' && json.valid == false ) { 

			$('#verify-result').append(`
				<div style="color: red" data-localized="diploma-states-invalid">${translations[currentLocale]['diploma-states-invalid']}</div>
			`); 

			$('#verify-result').append(`
				<div style="margin-top: 16px;" data-localized="diploma-states-invalid-details">${translations[currentLocale]['diploma-states-invalid-details']}</div>
			`);

			$('#verify-result').append(`
				<div style="margin-top: 16px;">
					<button id="contacts-btn" class="btn btn-success" data-localized="">Просмотреть список</button>
				</div>
			`);

			$('#contacts-btn').click(async function() {

				const contactsModal = new modal();

				contactsModal.element.css('width', '95%');

				$('.modal-title', contactsModal.element).html('Контакты');

				$('.modal-content', contactsModal.element).html(`
					<table id="contacts-table">
						<thead>
							<th>${translations[currentLocale]['contacts-table-c1']}</th>
							<th>${translations[currentLocale]['contacts-table-c2']}</th>
							<th>${translations[currentLocale]['contacts-table-c3']}</th>
							<th>${translations[currentLocale]['contacts-table-c4']}</th>
							<th>${translations[currentLocale]['contacts-table-c5']}</th>
							<th>${translations[currentLocale]['contacts-table-c6']}</th>
						</thead>
						<tbody></tbody>
					</table>
				`);

				$('.modal-content', contactsModal.element).css('overflow-y', 'auto');

				const contactsData = await $.getJSON('https://dv.iac.kz/vuz-verify/contacts.json');

				for ( university of contactsData ) {

					for ( employee of university.employees ) {

						$('#contacts-table tbody').append(`
							<tr>
								<td>${university.city}</td>
								<td>${university.name}</td>
								<td>${university.address}</td>
								<td>${employee.fullname}</td>
								<td>${employee.post}</td>
								<td>${employee.contacts}</td>
							</tr>
						`);

					}

				}

			});

		}

		//

		if ( json.result == 'fail' ) { 
			switch ( json.errorCode ) {
				case 'NEDBConnectionError': $('#verify-result').html('<p style="color: red;" data-localized="">Ошибка подключения к НОБД</p>'); break;
				case 'SQLStateError': $('#verify-result').html('<p style="color: red;" data-localized="">Ошибка запроса</p>'); break;
				default: $('#verify-result').html('<p style="color: red;" data-localized="">Ошибка</p>'); break;
			}
			//$('#verify-result').html('<p style="color: red" data-localized="diploma-states-nodata">' + translations[currentLocale]['diploma-states-nodata'] + '</p>'); 
		}

	}


});