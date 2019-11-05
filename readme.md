# Interactive Ukraine map

#### HTML

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <style>
            svg, img {
                width: 100%;
                opacity: 0;
                transition: opacity .3s ease;
            }

            .region {
                cursor: pointer;
            }

            .replaced-svg {
                opacity: 1;
            }
        </style>
        <figure>
            <img class="ukrmap" src="http://127.0.0.1:8080/uaMap.svg" alt="">
        </figure>
        <script src="intMap.js"></script>
        <script src="app.js"></script>
    </body>
    </html>
#### Init JS
|  option  |  type  |  Description  |
| --- | --- | --- |
| color | string | text color |
| fontSize | int | font-size |
| fontWeight | int | font-weight |
| fontFamily | string | font-family |
| multiple | string | multiple points in region (horizontal, vertical) default false |
| marker | object | default marker settings |

    const intMap = new IntMap({
		color: '#003B61',
		fontSize: 14,
		fontWeight: 600,
		fontFamily: 'Open Sans',
		multiple: 'horizontal',
		marker: {
			url: 'http://127.0.0.1:8080/marker.svg',
			height: '16px',
			width: '16px'
		}
	});
	
#### img to inline-svg

	intMap.inlineSvg('.ukrmap').then((values) => {
		// code
	});

#### List of regions (return array with regions name)
    intMap.list();

#### Add text

|  option  |  type  |  Description  |
| --- | --- | --- |
|  region_id  |  string  |  # + 'region name' from IntMap.list()  |
|  text  |  string  |  whatever text  |
|  default_marker  |  bool  |  Using default marker  |



    intMap.setText(region_id, text, default_marker);

#### Add marker

| option | type | Description |
| --- | --- | --- |
| region_id | string | # + 'region name' from IntMap.list() |
| marker_url | string | url to marker image |
| height  | string | marker height |
| width  | string | marker width |

    intMap.setMarker(region_id, marker_url, height, width);