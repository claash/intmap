const IntMap = function(params) {
	const self = this;
	this.color = params.color;
	this.fontSize = params.fontSize;
	this.fontWeight = params.fontWeight;
	this.fontFamily = params.fontFamily;
	this.multiple = typeof params.multiple !== 'undefined' ? params.multiple : false;
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

	this.setText = (id, text, position, marker) => {
		const element = document.createElementNS('http://www.w3.org/2000/svg', 'text'),
			path = document.querySelector(id),
			pos = self.getPosition(id);

		var prevElement = path.querySelector('text');

		if (document.body.contains(prevElement)) {
			prevElement.textContent = text;
			return;
		}

		let textPos = {};

		const txt = document.createTextNode(text);

		element.appendChild(txt);
		path.appendChild(element);

		const elementSize = element.getBBox();

		switch (position) {
			case 'bottom':
				const patentBt = {
					x: pos.x + pos.width / 2,
					y: pos.y + pos.height
				};

				textPos = {
					x: patentBt.x - elementSize.width / 2,
					y: patentBt.y - elementSize.height / 2
				};
				break;
			case 'top':
				const patentTop = {
					x: pos.x + pos.width / 2,
					y: pos.y + elementSize.height
				};

				textPos = {
					x: patentTop.x - elementSize.width / 2,
					y: patentTop.y - elementSize.height / 2
				};
				break;
			default:
				const parentMiddle = {
					x: pos.x + pos.width / 2,
					y: pos.y + pos.height / 2
				};

				textPos = {
					x: parentMiddle.x - elementSize.width / 2,
					y: parentMiddle.y - elementSize.height / 2
				};
				break;
		}

		element.style.fill = self.color;
		element.style.fontSize = self.fontSize;
		element.style.fontFamily = self.fontFamily;
		element.style.fontWeight = self.fontWeight;
		element.setAttributeNS(null, 'x', textPos.x);
		element.setAttributeNS(null, 'y', textPos.y);

		if (marker) {
			self.textMarker(element);
		}
	};

	this.textMarker = (element) => {
		const textPos = element.getBBox(),
			parentId = element.parentNode.id;

		let markerPos = {};

		markerPos.x = textPos.x + textPos.width / 2 - parseInt(self.marker.width) / 2;
		markerPos.y = textPos.y + textPos.height + parseInt(self.marker.height) / 2;

		self.setMarker(
			'#' + parentId,
			self.marker.url,
			self.marker.height,
			self.marker.width,
			markerPos.x,
			markerPos.y
		);
	};

	this.setMarker = (id, url, height, width, x, y) => {
		const element = document.createElementNS('http://www.w3.org/2000/svg', 'image'),
			path = document.querySelector(id),
			pos = self.getPosition(id);

		if (!this.multiple) {
			var prevElement = path.querySelector('image');

			if (document.body.contains(prevElement)) {
				prevElement.remove();
			}
		}

		let markerPos = {};

		if (url == null || height == null || width == null) {
			url = this.marker.url;
			height = this.marker.height;
			width = this.marker.width;
		}

		if (typeof x !== 'undefined' && typeof y !== 'undefined') {
			markerPos = {
				x: x,
				y: y
			};
		} else {
			markerPos = {
				x: pos.x + pos.width / 2,
				y: pos.y + pos.height / 2
			};
		}

		path.appendChild(element);

		element.setAttributeNS(null, 'href', url);
		element.setAttributeNS(null, 'class', 'mapMarker');
		element.setAttributeNS(null, 'height', height);
		element.setAttributeNS(null, 'width', width);

		let imagesList = path.querySelectorAll('image');

		const elementSize = element.getBBox();

		let point = {
			x: markerPos.x - elementSize.width / 2,
			y: markerPos.y - elementSize.height / 2
		};

		if (imagesList.length > 1) {
			let part = pos.width / imagesList.length,
				move = part - part / 2;

			switch (this.multiple) {
				case 'horizontal':
					[ ...imagesList ].map((node, index) => {
						// console.log();

						let pointX = pos.x + part * (index + 1) - move;

						node.setAttributeNS(null, 'x', pointX);
						node.setAttributeNS(null, 'y', markerPos.y);
					});
					break;
				case 'vertical':
					[ ...imagesList ].map((node, index) => {
						// console.log();

						let pointY = pos.y + part * (index + 1) - move;

						node.setAttributeNS(null, 'x', point.x);
						node.setAttributeNS(null, 'y', pointY);
					});
					break;
				default:
					break;
			}
		} else {
			element.setAttributeNS(null, 'x', point.x);
			element.setAttributeNS(null, 'y', markerPos.y);
		}
	};

	this.list = () => {
		const regions = document.querySelectorAll('.region'),
			regionNames = [ ...regions ].map((item) => {
				return item.id;
			});

		return regionNames.sort();
	};
};
