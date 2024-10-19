import JosmButtonClickEL from './JosmButtonClickEL.js';
import GpxButtonClickEL from './GpxButtonClickEL.js';

class Report {

	#report;

	close ( ) {
		document.getElementById ( 'waitAnimation' ).style.visibility = 'hidden';
		let josmButtons = document.getElementsByClassName ( 'josmButton' );
		for ( let counter = 0; counter < josmButtons.length; counter ++ ) {
			josmButtons[ counter ].addEventListener ( 'click', new JosmButtonClickEL ( ) );
		}
		let gpxButtons = document.getElementsByClassName ( 'gpxButton' );
		for ( let counter = 0; counter < gpxButtons.length; counter ++ ) {
			gpxButtons[ counter ].addEventListener ( 'click', new GpxButtonClickEL ( ) );
		}
	}

	open ( ) {
		document.getElementById ( 'waitAnimation' ).style.visibility = 'visible';
		this.#report = document.getElementById ( 'report' );
		while ( this.#report.firstChild ) {
			this.#report.removeChild ( this.#report.firstChild );
		}
	}

	// eslint-disable-next-line max-params
	add ( htmlTag, text, osmId, shapePk ) {
		let htmlElement = document.createElement ( htmlTag );
		htmlElement.innerHTML =
			this.#getGpxDownload ( shapePk ) +
			text +
			this.#getOsmLink ( osmId ) +
			this.#getJosmEdit ( osmId );
		this.#report.appendChild ( htmlElement );
	}

	#getGpxDownload ( shapePk ) {
		let gpxDownload =
			shapePk
				?
				'<button title="download the gpx file" ' +
			'class="gpxButton" data-shape-pk="' +
			shapePk + '" >Download gpx</button>'
				:
				'';
		return gpxDownload;
	}

	#getJosmEdit ( osmId ) {
		let josmEdit =
            osmId
            	?
            	'<button title="Edit the relation with JOSM\nJOSM must be already opened!" ' +
                'class="josmButton" data-osm-obj-id="' +
                osmId + '" >JOSM </button>'
            	:
            	'';

		return josmEdit;
	}

	#getOsmLink ( osmId ) {
		let osmLink =
            osmId
            	?
            	'<a target="_blank" href="https://www.openstreetmap.org/' +
                'relation/' + osmId + '"> relation : ' + osmId + '</a>'
            	:
            	'';

		return osmLink;
	}

	constructor ( ) {

	}
}

const theReport = new Report ( );

export default theReport;