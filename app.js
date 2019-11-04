document.addEventListener('DOMContentLoaded', () => {
	const intMap = new IntMap({
		color: '#003B61',
		marker: {
			url: 'http://127.0.0.1:8080/marker.svg',
			height: '16px',
			width: '16px'
		}
	});

	intMap.inlineSvg('.ukrmap').then((values) => {
		intMap.setText('#Zaporizhia', 'Мелитополь', true);

		intMap.setText('#Crimea', 'Крим', true);

		intMap.setText('#Donetsk', 'Донецк', true);

		intMap.setText('#Kharkiv', 'Харьков', true);
		intMap.setMarker('#Lutsk');
	});
});
