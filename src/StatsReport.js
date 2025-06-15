/*
Copyright - 2024 2025 - wwwouaiebe - Contact: https://www.ouaie.be/

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

import Report from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * The stats report
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class StatsReport extends Report {

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
	 * The constructor
	 */

	constructor ( ) {
		super ( );
		this.report = document.getElementById ( 'statsPane' );
		Object.freeze ( this );
		Object.seal ( this.#stats );
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
	 * Increment the validationErrors value of the stats
	 */

	addValidationError ( ) {
		this.#stats.validationErrors ++;
	}

	/**
	 * Increment the validationWarnings value of the stats
	 */

	addValidationWarning ( ) {
		this.#stats.validationWarnings ++;
	}

	/**
	 * Open the report ( = prepare the report for a new control)
	 */

	open ( ) {

		super.open ( );

		// clear the stats
		this.#stats.doneNotOk = 0;
		this.#stats.doneOk = 0;
		this.#stats.toDo = 0;
		this.#stats.validationErrors = 0;
		this.#stats.validationWarnings = 0;

	}

	/**
	 * Close the report ( = do some operations at the end of a control)
	 */

	close ( ) {
		this.add ( 'h1', 'Stats :' );
		this.add ( 'p', 'Osm route relations done and aligned on GTFS files: ' + this.#stats.doneOk );
		this.add ( 'p', 'Osm route relations done but not aligned on GTFS files: ' + this.#stats.doneNotOk );
		this.add ( 'p', 'Osm route relations todo: ' + this.#stats.toDo );
		this.add ( 'p', 'Validation errors to fix: ' + this.#stats.validationErrors );
		this.add ( 'p', 'Validation warnings nice to fix: ' + this.#stats.validationWarnings );
	}

}

/**
 * The one and only one object StatsReport
 * @type {StatsReport}
 */

const theStatsReport = new StatsReport;

export default theStatsReport;