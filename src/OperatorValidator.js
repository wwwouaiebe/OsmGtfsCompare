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

import theOperator from './Operator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Validator for the tag operator
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OperatorValidator {

	/**
     * A reference to the osm object to validate
     * @type {Object}
     */

	#osmObject = {};

	/**
     * A counter for the errors
     * @type {Number}
     */

	#errorCounter = 0;

	/**
	* Validate the operator tag
	 */

	validate ( ) {
		this.#errorCounter = 0;
		if ( this.#osmObject?.tags?.operator ) {

			let operators = this.#osmObject?.tags?.operator.split ( ';' );
			let validOperatorFound = false;
			operators.forEach (
				operator => {
					if ( operator === theOperator.osmOperator ) {
						validOperatorFound = true;
					}
				}
			);
			if ( ! validOperatorFound ) {
				theReport.add (
					'p',
					'Error T004: the operator is not valid ( expected '
					+ theOperator.osmOperator + ' but found ' + this.#osmObject?.tags?.operator + ' )'
				);
				this.#errorCounter ++;
			}
		}
		else {
			theReport.add (
				'p',
				'Error T005: no operator tag found'
			);
			this.#errorCounter ++;
		}

		return this.#errorCounter;
	}

	/**
     * The constructor
     * @param {Object} osmObject an OSM object with an operator tag
     */

	constructor ( osmObject ) {
		this.#osmObject = osmObject;
	}
}

export default OperatorValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */