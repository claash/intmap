const IntMap = function(params) {
	const self = this;
	this.color = params.color;
	this.fontSize = params.fontSize;
	this.fontWeight = params.fontWeight;
	this.fontFamily = params.fontFamily;
	this.marker = params.marker;

	this.inlineSvg = (elemName) => {
		this.elemName = elemName;
		this.promises = [];

		document.querySelectorAll(this.elemName).forEach((el) => {
			this.promises.push(
				new Promise((resolve) => {
					const imgID = el.getAttribute('id');
					const imgClass = el.getAttribute('class');
					const imgURL = el.getAttribute('src');

					fetch(imgURL).then((r) => r.text()).then((data) => {
						const parser = new DOMParser();
						const xmlDoc = parser.parseFromString(data, 'text/html');
						const svg = xmlDoc.querySelector('svg');

						if (typeof imgID !== 'undefined' && imgID !== null) {
							svg.setAttribute('id', imgID);
						}

						if (typeof imgClass !== 'undefined' && imgClass !== null) {
							svg.setAttribute('class', imgClass + ' replaced-svg');
						}

						svg.removeAttribute('xmlns:a');

						el.parentNode.replaceChild(svg, el);

						resolve(svg);
					});
				})
			);
		});

		return Promise.all(this.promises);
	};

	this.getPosition = (elem) => {
		return document.querySelector(elem).getBBox();
	};

	this.setText = (id, text, marker) => {
		if (marker) {
			self.setMarker(id, this.marker.url, this.marker.height, this.marker.width);
		}

		const element = document.createElementNS('http://www.w3.org/2000/svg', 'text'),
			path = document.querySelector(id),
			pos = self.getPosition(id);

		if (path.querySelector('text') !== null) {
			path.querySelector('text').textContent = text;
			return;
		}

		const txt = document.createTextNode(text);

		const parentMiddle = {
			x: pos.x + pos.width / 2,
			y: pos.y + pos.height / 2
		};

		element.appendChild(txt);
		path.appendChild(element);

		const elementSize = element.getBBox();

		const setMiddle = {
			x: parentMiddle.x - elementSize.width / 2,
			y: parentMiddle.y - elementSize.height / 2
		};

		element.style.fill = self.color;
		element.style.fontSize = self.fontSize;
		element.style.fontFamily = self.fontFamily;
		element.style.fontWeight = self.fontWeight;
		element.setAttributeNS(null, 'x', setMiddle.x);
		element.setAttributeNS(null, 'y', setMiddle.y);
	};

	this.setMarker = (id, url, height, width) => {
		const element = document.createElementNS('http://www.w3.org/2000/svg', 'image'),
			path = document.querySelector(id),
			pos = self.getPosition(id);

		if (path.querySelector('image') !== null) {
			path.querySelector('image').href = url;
			return;
		}

		if (url == null || height == null || width == null) {
			url = this.marker.url;
			height = this.marker.height;
			width = this.marker.width;
		}

		const parentMiddle = {
			x: pos.x + pos.width / 2,
			y: pos.y + pos.height / 2
		};

		path.appendChild(element);

		const elementSize = element.getBBox();

		const setMiddle = {
			x: parentMiddle.x - elementSize.width / 2,
			y: parentMiddle.y - elementSize.height / 2
		};

		element.setAttributeNS(null, 'href', url);
		element.setAttributeNS(null, 'x', setMiddle.x);
		element.setAttributeNS(null, 'y', parentMiddle.y);
		element.setAttributeNS(null, 'height', height);
		element.setAttributeNS(null, 'width', width);
	};

	this.list = () => {
		const regions = document.querySelectorAll('.region'),
			regionNames = [ ...regions ].map((item) => {
				return item.id;
			});

		return regionNames.sort();
	};
};
