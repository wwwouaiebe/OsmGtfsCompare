class Report {

	constructor ( ) {

	}

	/**
	 * Return an HTML string with a "JOSM" button
	 * @param {?Object} osmObject The OSM object for witch the button must be created
	 * @returns {String} a HTML string with an ButtonHTMLElement or an empty string when the osmObject is null
	 */

	getJosmEdit ( osmObject ) {
		if ( ! osmObject?.id || ! osmObject?.type ) {
			return '';
		}

		return '<button title="Edit the relation with JOSM\nJOSM must be already opened!" ' +
        	'class="josmButton" data-osm-obj-id="' +
            osmObject.id + '" data-osm-obj-type="' + osmObject.type + '" >JOSM </button>';
	}

	/**
	 * Return an HTML string with a OSM link
	 * @param {?Object} osmObject The OSM object for witch the link must be created
	 * @returns {String} a HTML string with an AnchorHTMLElement or an empty string when the osmObject is null
	 */

	getOsmLink ( osmObject ) {
		let osmId = '';
		if ( osmObject?.id && osmObject?.type ) {
			osmId = osmObject.id;
		}
		else if ( osmObject?.ref && osmObject?.type ) {
			osmId = osmObject.ref;
		}
		else {
			return '';
		}
		let osmType = osmObject.type;

		return '<a target="_blank" href="https://www.openstreetmap.org/' +
			osmType +
			'/' + osmId + '"> ' + osmType + ' : ' + osmId + '</a>';
	}

	open ( ) {

	}

	close ( ) {

	}
}

export default Report;