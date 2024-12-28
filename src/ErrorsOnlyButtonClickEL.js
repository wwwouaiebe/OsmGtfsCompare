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

	/*
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
	*/

	/**
	 * event handler
	 * @param {Object} event The event to handle
	 */

	handleEvent ( event ) {
		event.target.value = 'All' === event.target.value ? 'Error only' : 'All';
		let report = document.getElementById ( 'report' );
		report.classList.toggle ( 'errorsOnly' );
	}
}

export default ErrorsOnlyButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */