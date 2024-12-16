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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Simple click event handler for the 'Show errors only' button of the web page
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class ErrorsOnlyButtonClickEL {

	/**
	 * The initial value for the error button
	 * @type {String}
	 */

	#buttonValue = 'Errors only';

	#currentH1 = null;

	#currentH2 = null;

	#currentP = [];

	#errorFound = false;

	/**
	 * The contructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	#showOnError ( ) {
		if ( this.#errorFound ) {
			if ( this.#currentH1 ) {
				this.#currentH1.classList.add ( 'showOnError' );
			}

			if ( this.#currentH2 ) {
				this.#currentH2.classList.add ( 'showOnError' );
			}

			this.#currentP.forEach (
				node => { node.classList.add ( 'showOnError' ); }
			);
		}
	}

	/**
	 * event handler
	 * @param {Object} event The event to handle
	 */

	handleEvent ( event ) {
		event.target.value = 'All' === event.target.value ? 'Error only' : 'All';
		let report = document.getElementById ( 'report' );
		report.classList.toggle ( 'errorsOnly' );

		this.#currentH1 = null;
		this.#currentH2 = null;
		this.#currentP = [];
		this.#errorFound = false;

		report.childNodes.forEach (
			node => {
				node.classList.remove ( 'showOnError' );
				switch ( node.tagName ) {
				case 'H1' :
					this.#showOnError ( );
					this.#currentH1 = null;
					this.#currentH2 = null;
					this.#currentP = [];
					this.#errorFound = false;
					if ( node.textContent.startsWith ( 'Bus ' ) ) {
						this.#currentH1 = node;
					}
					if (
						'Stats :' === node.textContent
						||
						'Gtfs relations not found in the osm data' === node.textContent
					) {
						this.#currentH1 = node;
						this.#errorFound = true;
					}
					break;
				case 'H2' :
					this.#showOnError ( );
					this.#currentH2 = null;
					this.#currentP = [];
					this.#errorFound = false;
					if (
						node.textContent.startsWith ( 'Bus ' )
						||
						'Missing osm relations' === node.textContent
					) {
						this.#currentH2 = node;
					}
					break;
				case 'P' :
					this.#currentP.push ( node );
					if (
						-1 !== node.textContent.indexOf ( '🔵' )
						||
						-1 !== node.textContent.indexOf ( '🟡' )
						||
						-1 !== node.textContent.indexOf ( '🔴' )
					) {
						this.#errorFound = true;
					}
					break;
				default :
					break;
				}
			}
		);
		this.#showOnError ( );
	}
}

export default ErrorsOnlyButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */