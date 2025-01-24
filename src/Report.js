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
Doc reviewed 20250124
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import JosmButtonClickEL from './JosmButtonClickEL.js';
import GpxButtonClickEL from './GpxButtonClickEL.js';
import theOsmDataLoader from './OsmDataLoader.js';

/*
Structure of the report:
+--------------------------------------+
| div id=osm.....                      |
| +----------------------------------+ |
| | h1                               | |
| +----------------------------------+ |
| +----------------------------------+ |
| | div id=osm.....DataDiv           | |
| | +------------------------------+ | |
| | | h3                           | | |
| |	+------------------------------+ | |
| | +------------------------------+ | |
| | | p                            | | |
| | +------------------------------+ | |
| +----------------------------------+ |
| +----------------------------------+ |
| | div id=osm.....                  | |
| | +------------------------------+ | |
| | | h2                           | | |
| | +------------------------------+ | |
| | +------------------------------+ | |
| | | div id=osm.....DataDiv       | | |
| | | +--------------------------+ | | |
| | | | h3                       | | | |
| | | +--------------------------+ | | |
| | | +--------------------------+ | | |
| | | | p                        | | | |
| | | +--------------------------+ | | |
| | | +--------------------------+ | | |
| | | | p                        | | | |
| | | +--------------------------+ | | |
| | +------------------------------+ | |
| +----------------------------------+ |
+--------------------------------------+
*/

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * This class contains methods to create the report
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Report {

	/**
	 * The HTMLElement where the report will be added (= the main HTMLElement)
	 * @type {HTMLElement}
	 */

	#report;

	/**
	 * The current div with a h1 heading where the element of the report will be added
	 * @type {HTMLElement}
	 */

	#currentH1Div = null;

	/**
	 * The current div with a h2 heading where the element of the report will be added
	 * @type {HTMLElement}
	 */

	#currentH2Div = null;

	/**
	 * The current div with a osm...DataDiv id where the element of the report will be added
	 * @type {Object}
	 */

	#currentDataDiv = null;

	#currentHTMLElement = null;

	/**
	 * An object with somme properties for storing statistics
	 * @type {HTMLElement}
	 */

	#stats = {
		doneNotOk : 0,
		doneOk : 0,
		toDo : 0,
		validationErrors : 0,
		validationWarnings : 0
	};

	/**
	 * This method close the report (= do some actions at the end of the process)
	 */

	close ( ) {

		// Add event listeners on josm buttons
		const josmButtons = document.getElementsByClassName ( 'josmButton' );
		for ( let counter = 0; counter < josmButtons.length; counter ++ ) {
			josmButtons[ counter ].addEventListener ( 'click', new JosmButtonClickEL ( ) );
		}

		// Add event listeners on gpx buttons
		const gpxButtons = document.getElementsByClassName ( 'gpxButton' );
		for ( let counter = 0; counter < gpxButtons.length; counter ++ ) {
			gpxButtons[ counter ].addEventListener ( 'click', new GpxButtonClickEL ( ) );
		}

		// Adding stats on top of the report
		const firstChild = this.#report.firstChild;

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

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Validation errors to fix: ' + this.#stats.validationErrors;
		this.#report.insertBefore ( htmlElement, firstChild );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Validation warnings nice to fix: ' + this.#stats.validationWarnings;
		this.#report.insertBefore ( htmlElement, firstChild );

		// adding bus shortcuts
		const routesLinksdiv = document.getElementById ( 'routesLinks' );
		theOsmDataLoader.routeMasters.forEach (
			routeMaster => {
				let routeLink = document.createElement ( 'a' );
				routeLink.classList.add ( 'busShortcutAnchor' );
				routeLink.innerText = routeMaster.tags.ref + ' ';
				routeLink.href = '#osm' + routeMaster.id;
				routesLinksdiv.appendChild ( routeLink );
			}
		);

		// Hidding the animation
		document.getElementById ( 'waitAnimation' ).style.visibility = 'hidden';

	}

	/**
	 * This method open the report (= do some actions at the beginning of the process)
	 */

	open ( ) {

		// show the animation
		document.getElementById ( 'waitAnimation' ).style.visibility = 'visible';

		this.#report = document.getElementById ( 'report' );

		// clear the stats
		this.#stats.doneNotOk = 0;
		this.#stats.doneOk = 0;
		this.#stats.toDo = 0;
		this.#stats.validationErrors = 0;
		this.#stats.validationWarnings = 0;

		// clear the route links
		const routesLinksdiv = document.getElementById ( 'routesLinks' );
		while ( routesLinksdiv.firstChild ) {
			routesLinksdiv.removeChild ( routesLinksdiv.firstChild );
		}

		// reset of the errorOnly class
		this.#report.classList.remove ( 'errorsOnly' );

		// clear the report
		while ( this.#report.firstChild ) {
			this.#report.removeChild ( this.#report.firstChild );
		}
	}

	/**
	 * Increment the doneOk value of the stats
	 */

	addDoneOk ( ) {
		this.#stats.doneOk ++;
	}

	/**
	 * Increment the doneOk value of the stats
	 */

	addDoneNotOk ( ) {
		this.#stats.doneNotOk ++;
	}

	/**
	 * Increment the toDo value of the stats
	 * @param {Number} quantity
	 */

	addToDo ( quantity ) {
		this.#stats.toDo += quantity;
	}

	/**
	 * This method creates all the needed HTMLElements when an H1HTMLElement is added to the report
	 * @param {Object} osmObject An osmObject linked to the added HTMLElement
	 */

	#createH1HTMLElements ( osmObject ) {

		// adding the osm id to the currentH1Div and currentDataDiv if an OSM object is present
		if ( osmObject ) {
			this.#currentH1Div = document.getElementById ( 'osm' + osmObject.id );
			this.#currentDataDiv = document.getElementById ( 'osm' + osmObject.id + 'DataDiv' );
		}
		else {
			this.#currentH1Div = null;
		}
		if ( ! this.#currentH1Div ) {

			// creating the currentH1Div...
			this.#currentH1Div = document.createElement ( 'div' );
			this.#report.appendChild ( this.#currentH1Div );
			this.#currentH1Div.appendChild ( this.#currentHTMLElement );

			// and the currentDataDiv
			this.#currentDataDiv = document.createElement ( 'div' );
			this.#currentH1Div.appendChild ( this.#currentDataDiv );
			if ( osmObject ) {
				this.#currentH1Div.id = 'osm' + osmObject.id;
				this.#currentDataDiv.id = 'osm' + osmObject.id + 'DataDiv';
			}
		}

		// set the currentH2Div to null
		this.#currentH2Div = null;
	}

	/**
	 * This method creates all the needed HTMLElements when an H2HTMLElement is added to the report
	 * @param {Object} osmObject An osmObject linked to the added HTMLElement
	 */

	#createH2HTMLElements ( osmObject ) {

		// adding the osm id to the currentH2Div and currentDataDiv if an OSM object is present
		if ( osmObject ) {
			this.#currentH2Div = document.getElementById ( 'osm' + osmObject.id );
			this.#currentDataDiv = document.getElementById ( 'osm' + osmObject.id + 'DataDiv' );
		}
		else {
			this.#currentH2Div = null;
		}
		if ( ! this.#currentH2Div ) {

			// creating the currentH2Div...
			this.#currentH2Div = document.createElement ( 'div' );
			this.#currentH1Div.appendChild ( this.#currentH2Div );
			this.#currentH2Div.appendChild ( this.#currentHTMLElement );

			// and the currentDataDiv
			this.#currentDataDiv = document.createElement ( 'div' );
			this.#currentH1Div.appendChild ( this.#currentDataDiv );
			this.#currentDataDiv = document.createElement ( 'div' );
			this.#currentH2Div.appendChild ( this.#currentDataDiv );
			if ( osmObject ) {
				this.#currentH2Div.id = 'osm' + osmObject.id;
				this.#currentDataDiv.id = 'osm' + osmObject.id + 'DataDiv';
			}
		}
	}

	/**
	 * Add an HTMLElement to the report
	 * @param {String} htmlTag The HTML tag to add (h1, h2, h3 or p)
	 * @param {String} text The text to add in the HTMLElement
	 * @param {Object} osmObject an OSM object to add as a link or a JOSM buton in the HTMLElement
	 * @param {Number} shapePk A unique identifier given to a GTFS route and coming from mySQL db
	 */

	// eslint-disable-next-line max-params
	add ( htmlTag, text, osmObject, shapePk ) {

		// creation of the HTMLElement
		this.#currentHTMLElement = document.createElement ( htmlTag );

		switch ( htmlTag ) {
		case 'h1' :
			this.#createH1HTMLElements ( osmObject );
			break;
		case 'h2' :
			this.#createH2HTMLElements ( osmObject );
			break;
		case 'h3' :
		case 'p' :
			if ( this.#currentDataDiv ) {
				this.#currentDataDiv.appendChild ( this.#currentHTMLElement );
			}
			break;
		default :
			break;
		}

		// Adding text in the HTMLElement
		this.#currentHTMLElement.innerHTML =

			// gpx button
			this.#getGpxDownload ( shapePk ) +
			text +

			// OSM link
			this.getOsmLink ( osmObject ) +

			// JOSM button
			this.#getJosmEdit ( osmObject );

		// Adding the isError class
		if ( text.startsWith ( 'Error' ) ) {
			this.#currentHTMLElement.classList.add ( 'isError' );
			this.#stats.validationErrors ++;
		}

		// Adding the isWarning class
		if ( text.startsWith ( 'Warning' ) ) {
			this.#currentHTMLElement.classList.add ( 'isWarning' );
			this.#stats.validationWarnings ++;
		}

		// Adding the haveErrors class
		if (
			-1 !== text.indexOf ( '🔵' )
			||
			-1 !== text.indexOf ( '🟡' )
			||
			-1 !== text.indexOf ( '🔴' )
			||
			-1 !== text.indexOf ( '🟣' )
			||
			text.startsWith ( 'Error' )
			||
			text.startsWith ( 'Warning' )
		) {
			if ( this.#currentDataDiv ) {
				this.#currentDataDiv.classList.add ( 'haveErrors' );
			}
			if ( this.#currentH2Div ) {
				this.#currentH2Div.classList.add ( 'haveErrors' );
			}
			if ( this.#currentH1Div ) {
				this.#currentH1Div.classList.add ( 'haveErrors' );
			}
		}
	}

	/**
	 * Return an HTML string with a "Download gpx" button
	 * @param {?Number} shapePk A unique identifier given to a GTFS route and coming from mySQL db
	 * @returns a HTML string with an ButtonHTMLElement or an empty string when the shapePk is null
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
	 * Return an HTML string with a "JOSM" button
	 * @param {?Object} osmObject The OSM object for witch the button must be created
	 * @returns {String} a HTML string with an ButtonHTMLElement or an empty string when the osmObject is null
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

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
		Object.seal ( this.#stats );
	}
}

/**
 * The one and only one object Report
 */

const theReport = new Report ( );

export default theReport;

/* --- End of file --------------------------------------------------------------------------------------------------------- */