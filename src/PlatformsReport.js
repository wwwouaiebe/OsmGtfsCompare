import Report from './Report.js';
class PlatformsReport extends Report {

	#report;

	constructor ( ) {
		super ( );
		Object.freeze ( this );
	}

	open ( ) {
		this.#report = document.getElementById ( 'platformsPane' );

		// clear the report
		while ( this.#report.firstChild ) {
			this.#report.removeChild ( this.#report.firstChild );
		}
	}

	close ( ) {

	}

	add ( htmlTag, text, osmObject ) {

		let htmlElement = document.createElement ( htmlTag );
		htmlElement.innerHTML =

            text +

			// JOSM button
			this.getJosmEdit ( osmObject );

		this.#report.appendChild ( htmlElement );
	}

}

const thePlatformsReport = new PlatformsReport;

export default thePlatformsReport;