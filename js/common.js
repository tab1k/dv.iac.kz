// COOKIES HANDLING

function getCookie(cname)
{
  var results = document.cookie.match ( '(^|;) ?' + cname + '=([^;]*)(;|$)' );
   if ( results ) { return ( unescape ( results[2] ) ); } else { return null };
}

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + '; path=/; SameSite=Strict; secure';
}

function deleteCookie(cname) {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

// GET PARAMS

function findGetParameter(parameterName) {
    var result = null, tmp = [];
    location.search.substr(1).split("&").forEach(function (item) {
		tmp = item.split("=");
		if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
}

// LOCALIZATION

var availableLocales = [ 
	{ code: 'ru', flag: 'ru', title: 'Русский' }, 
	{ code: 'kk', flag: 'kz', title: 'Қазақша' },
	{ code: 'en', flag: 'us', title: 'English' }
];

var currentLocale = getCookie('locale'), currentLocaleObj = availableLocales.find(elem => elem.code == currentLocale);

translations = {};
availableLocales.forEach(function(item) { translations[item.code] = {}; });

// LANGUAGE UI EVENT HANLDERS

$('body').on('click', '.lang-selector-node', function() {
	var locale = $(this).attr('data-locale');
	setCookie('locale', locale);
	currentLocale = locale;	currentLocaleObj = availableLocales.find(elem => elem.code == currentLocale);	
	translate();
});

function translate() {
	$('[data-localized]').each(function(item) { 
	    let tag = $(this).attr('data-localized');
	    $(this).html(translations[currentLocale][tag]);
	});
}