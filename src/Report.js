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
Doc reviewed 20250110
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
	 * @type {Object}
	 */

	#currentH1Div = null;

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#currentH2Div = null;

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#currentH3Div = null;

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#stats = {
		doneNotOk : 0,
		doneOk : 0,
		toDo : 0
	};

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

		let firstChild = this.#report.firstChild;

		let htmlElement = document.createElement ( 'h1' );
		htmlElement.textContent = 'Stats :';
		this.#report.insertBefore ( htmlElement, firstChild );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Osm route relations done and aligned on GTFS files: ' + this.#stats.doneOk;
		this.#report.insertBefore ( htmlElement, firstChild );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Osm route relations done but not aligned on GTFS files: ' + this.#stats.doneNotOk;
		this.#report.insertBefore ( htmlElement, firstChild );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Osm route relations todo: ' + this.#stats.toDo;
		this.#report.insertBefore ( htmlElement, firstChild );
	}

	/**
	 * Coming soon
	 */

	open ( ) {
		this.#stats.doneNotOk = 0;
		this.#stats.doneOk = 0;
		this.#stats.toDo = 0;
		document.getElementById ( 'waitAnimation' ).style.visibility = 'visible';
		this.#report = document.getElementById ( 'report' );
		this.#report.classList.remove ( 'errorsOnly' );
		while ( this.#report.firstChild ) {
			this.#report.removeChild ( this.#report.firstChild );
		}
	}

	/**
	 * Coming soon
	 */

	addDoneOk ( ) {
		this.#stats.doneOk ++;
	}

	/**
	 * Coming soon
	 */

	addDoneNotOk ( ) {
		this.#stats.doneNotOk ++;
	}

	/**
	 * Coming soon
	 * @param {Number} quantity
	 */

	addToDo ( quantity ) {
		this.#stats.toDo += quantity ? quantity : 1;
	}

	/**
	 * Coming soon
	 * @param {String} htmlTag Coming soon
	 * @param {String} text Coming soon
	 * @param {Object} osmObject Coming soon
	 * @param {Number} shapePk Coming soon
	 */

	// eslint-disable-next-line max-params, complexity
	add ( htmlTag, text, osmObject, shapePk ) {

		let htmlElement = document.createElement ( htmlTag );

		switch ( htmlTag ) {
		case 'h1' :
			if ( osmObject ) {
				this.#currentH1Div = document.getElementById ( 'routeMaster' + osmObject.id );
			}
			else {
				this.#currentH1Div = null;
			}
			if ( ! this.#currentH1Div ) {
				this.#currentH1Div = document.createElement ( 'div' );
				if ( osmObject ) {
					this.#currentH1Div.id = 'routeMaster' + osmObject.id;
				}
				this.#report.appendChild ( this.#currentH1Div );
				this.#currentH1Div.appendChild ( htmlElement );
			}
			this.#currentH2Div = null;
			this.#currentH3Div = null;
			break;
		case 'h2' :
			if ( osmObject ) {
				this.#currentH2Div = document.getElementById ( 'route' + osmObject.id );
			}
			else {
				this.#currentH2Div = null;
			}
			if ( ! this.#currentH2Div ) {
				this.#currentH2Div = document.createElement ( 'div' );
				if ( osmObject ) {
					this.#currentH2Div.id = 'route' + osmObject.id;
				}
				this.#currentH1Div.appendChild ( this.#currentH2Div );
				this.#currentH2Div.appendChild ( htmlElement );
			}
			this.#currentH3Div = null;
			break;
		case 'h3' :
			this.#currentH3Div = document.createElement ( 'div' );
			this.#currentH2Div.appendChild ( this.#currentH3Div );
			this.#currentH3Div.appendChild ( htmlElement );
			break;
		case 'p' :
			if ( this.#currentH3Div ) {
				this.#currentH3Div.appendChild ( htmlElement );
			}
			else if ( this.#currentH2Div ) {
				this.#currentH2Div.appendChild ( htmlElement );
			}
			else if ( this.#currentH1Div ) {
				this.#currentH1Div.appendChild ( htmlElement );
			}
			break;
		default :
			break;
		}

		htmlElement.innerHTML =
			this.#getGpxDownload ( shapePk ) +
			text +
			this.getOsmLink ( osmObject ) +
			this.#getJosmEdit ( osmObject );

		if (
			-1 !== text.indexOf ( '🔵' )
			||
			-1 !== text.indexOf ( '🟡' )
			||
			-1 !== text.indexOf ( '🔴' )
			||
			-1 !== text.indexOf ( '🟣' )
		) {
			if ( this.#currentH3Div ) {
				this.#currentH3Div.classList.add ( 'haveErrors' );
			}
			if ( this.#currentH2Div ) {
				this.#currentH2Div.classList.add ( 'haveErrors' );
			}
			if ( this.#currentH1Div ) {
				this.#currentH1Div.classList.add ( 'haveErrors' );
			}
		}

		/*
		else {
			htmlElement.classList.add ( 'noErrors' );
		}
		*/

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
	 * @param {Object} osmObject Coming soon
	 */

	#getJosmEdit ( osmObject ) {
		if ( ! osmObject?.id || ! osmObject?.type ) {
			return '';
		}

		return '<button title="Edit the relation with JOSM\nJOSM must be already opened!" ' +
        	'class="josmButton" data-osm-obj-id="' +
            osmObject.id + '" data-osm-obj-type="' + osmObject.type + '" >JOSM </button>';
	}

	/**
	 * Coming soon
	 * @param {Object} osmObject Coming soon
	 */

	getOsmLink ( osmObject ) {
		if ( ! osmObject?.id || ! osmObject?.type ) {
			return '';
		}
		let osmId = osmObject.id;
		let osmType = osmObject.type;
		return '<a target="_blank" href="https://www.openstreetmap.org/' +
				osmType +
                '/' + osmId + '"> ' + osmType + ' : ' + osmId + '</a>';
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
		Object.seal ( this.#stats );
	}
}

/**
	 * Coming soon
	 */

const theReport = new Report ( );

export default theReport;

/* --- End of file --------------------------------------------------------------------------------------------------------- */