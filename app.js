document.addEventListener('DOMContentLoaded', () => {
	const intMap = new IntMap({
		color: '#003B61',
		fontFamily: 'Arial',
		multiple: 'horizontal',
		marker: {
			url: 'http://127.0.0.1:8080/marker.svg',
			height: '16px',
			width: '16px'
		}
	});

	intMap.inlineSvg('.ukrmap').then((values) => {
		intMap.setText('#Kyiv', 'Kyiv');

		intMap.setMarker('#Kyiv');
		intMap.setMarker('#Kyiv');

		intMap.setText('#Lutsk', 'Lutsk');

		intMap.setMarker('#Lutsk');
		intMap.setMarker('#Lutsk');
		intMap.setMarker('#Lutsk');
		intMap.setMarker('#Lutsk');

		intMap.setText('#Lutsk', 'Lviv');
	});
});
