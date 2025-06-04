import Report from './Report.js';

class StatsReport extends Report {

	/**
	 * The HTMLElement where the report will be added
	 * @type {HTMLElement}
	 */

	#report;

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

	constructor ( ) {
		super ( );
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

	addValidationError ( ) {
		this.#stats.validationErrors ++;
	}

	addValidationWarning ( ) {
		this.#stats.validationWarnings ++;
	}
	open ( ) {

		this.#report = document.getElementById ( 'statsPane' );

		// clear the report
		while ( this.#report.firstChild ) {
			this.#report.removeChild ( this.#report.firstChild );
		}

		// clear the stats
		this.#stats.doneNotOk = 0;
		this.#stats.doneOk = 0;
		this.#stats.toDo = 0;
		this.#stats.validationErrors = 0;
		this.#stats.validationWarnings = 0;

	}

	close ( ) {

		// Adding stats on top of the report

		let htmlElement = document.createElement ( 'h1' );
		htmlElement.textContent = 'Stats :';
		this.#report.appendChild ( htmlElement );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Osm route relations done and aligned on GTFS files: ' + this.#stats.doneOk;
		this.#report.appendChild ( htmlElement );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Osm route relations done but not aligned on GTFS files: ' + this.#stats.doneNotOk;
		this.#report.appendChild ( htmlElement );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Osm route relations todo: ' + this.#stats.toDo;
		this.#report.appendChild ( htmlElement );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Validation errors to fix: ' + this.#stats.validationErrors;
		this.#report.appendChild ( htmlElement );

		htmlElement = document.createElement ( 'p' );
		htmlElement.textContent = 'Validation warnings nice to fix: ' + this.#stats.validationWarnings;
		this.#report.appendChild ( htmlElement );

	}

}

const theStatsReport = new StatsReport;

export default theStatsReport;