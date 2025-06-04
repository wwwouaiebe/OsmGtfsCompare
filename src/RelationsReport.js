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
import Report from './Report.js';
import theStatsReport from './StatsReport.js';

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

class RelationsReport extends Report {

	/**
	 * The HTMLElement where the report will be added
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
	 * @type {HTMLElement}
	 */

	#currentDataDiv = null;

	/**
	 * the currently added HTMLElement
	 * @type {HTMLElement}
	 */

	#currentHTMLElement = null;

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

		// adding bus shortcuts
		let routesLinksdiv = document.createElement ( 'div' );
		routesLinksdiv.id = 'routesLinks';

		this.#report.insertBefore ( routesLinksdiv, this.#report.firstChild );

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

		this.#report = document.getElementById ( 'relationsPane' );

		// reset of the errorOnly class
		this.#report.classList.remove ( 'errorsOnly' );

		// clear the report
		while ( this.#report.firstChild ) {
			this.#report.removeChild ( this.#report.firstChild );
		}
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
			this.getJosmEdit ( osmObject );

		// Adding the isError class
		if ( text.startsWith ( 'Error' ) ) {
			this.#currentHTMLElement.classList.add ( 'isError' );
			theStatsReport.addValidationError ( );
		}

		// Adding the isWarning class
		if ( text.startsWith ( 'Warning' ) ) {
			this.#currentHTMLElement.classList.add ( 'isWarning' );
			theStatsReport.addValidationWarning ( );
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
			-1 !== text.indexOf ( '⚫' )
			||
			-1 !== text.indexOf ( '⚪' )
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
	 * @returns {String} a HTML string with an ButtonHTMLElement or an empty string when the shapePk is null
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
	 * The constructor
	 */

	constructor ( ) {
		super ( );
		Object.freeze ( this );
	}
}

/**
 * The one and only one object Report
 */

const theRelationsReport = new RelationsReport ( );

export default theRelationsReport;

/* --- End of file --------------------------------------------------------------------------------------------------------- */