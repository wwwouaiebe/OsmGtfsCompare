/*
Copyright - 2024 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
/*
Changes:
	- v1.0.0:
		- created
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import JosmButtonClickEL from './JosmButtonClickEL.js';
import GpxButtonClickEL from './GpxButtonClickEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Report {

	/**
	 * Coming soon
	 * @type {HTMLElement}
	 */

	#report;

	/**
	 * Coming soon
	 */

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

	/**
	 * Coming soon
	 */

	open ( ) {
		document.getElementById ( 'waitAnimation' ).style.visibility = 'visible';
		this.#report = document.getElementById ( 'report' );
		while ( this.#report.firstChild ) {
			this.#report.removeChild ( this.#report.firstChild );
		}
	}

	/**
	 * Coming soon
	 * @param {String} htmlTag Coming soon
	 * @param {String} text Coming soon
	 * @param {Number} osmId Coming soon
	 * @param {Number} shapePk Coming soon
	 */

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

	/**
	 * Coming soon
	 * @param {Number} shapePk Coming soon
	 */

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

	/**
	 * Coming soon
	 * @param {Number} osmId Coming soon
	 */

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

	/**
	 * Coming soon
	 * @param {Number} osmId Coming soon
	 */

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

	/**
	 * The constructor
	 */

	constructor ( ) {

	}
}

/**
	 * Coming soon
	 */

const theReport = new Report ( );

export default theReport;

/* --- End of file --------------------------------------------------------------------------------------------------------- */