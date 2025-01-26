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
Doc reviewed 20250126
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * fixme tag validator
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class FixmeValidator {

	/**
     * A counter for the errors
     * @type {Number}
     */

	#errorCounter = 0;

	/**
     * A reference to the osm object to validate
     * @type {Object}
     */

	#osmObject = {};

	/**
	 *  Validate the fixme tags
	 */

	validate ( ) {
		this.#errorCounter = 0;
		if ( this.#osmObject?.tags?.fixme ) {
			theReport.add (
				'p',
				'Warning R019: a fixme exists for this object (' + this.#osmObject.tags.fixme + ')'
			);
			this.#errorCounter ++;
		}
		return this.#errorCounter;
	}

	/**
	 * The constructor
 	 * @param {Object} osmObject
  	 */

	constructor ( osmObject ) {
		this.#osmObject = osmObject;
		Object.freeze ( this );
	}
}

export default FixmeValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */