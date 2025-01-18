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

import theDocConfig from './DocConfig.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Operator {

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#jsonOperator = {};

	/**
	 * Coming soon
	 * @type {Array}
	 */

	#networksAsStringArray = [];

	/**
	 * Coming soon
	 * @type {String}
	 */

	get mySqlDbName ( ) { return this.#jsonOperator.mySqlDbName; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get gtfsDirectory ( ) { return this.#jsonOperator.gtfsDirectory; }

	/**
	 * Coming soon
	 * @type {Object}
	 */

	get operator ( ) { return this.#jsonOperator.operator; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get osmOperator ( ) { return this.#jsonOperator.osmOperator; }

	/**
	 * Coming soon
	 * @type {Array}
	 */

	get networksAsStringArray ( ) {	return this.#networksAsStringArray; };

	/**
	 *
	 * @returns {Object} Coming soon
	 */

	getExcludeList ( ) {
		let network = this.#jsonOperator.networks.find ( element => element.osmNetwork === theDocConfig.network );
		return network.excludeList;
	}

	/**
	 * Coming soon
	 * @param {Operator} operator Coming soon
	 */

	async loadData ( operator ) {

		let fileName = '../operators/' + operator.toLowerCase ( ) + '.json';

		let success = false;
		await fetch ( fileName )
			.then (
				response => {
					if ( response.ok ) {
						return response.json ( );
					}
					console.error ( String ( response.status ) + ' ' + response.statusText );
					return false;
				}
			)
			.then (
				jsonResponse => {
					if ( jsonResponse ) {
						this.#jsonOperator = jsonResponse;
						this.#networksAsStringArray = [];
						this.#jsonOperator.networks.forEach (
							network => {
								this.#networksAsStringArray.push ( network.osmNetwork );
							}
						);
						Object.freeze ( this.#networksAsStringArray );
						success = true;
					}
				}
			)
			.catch (
				err => {
					console.error ( err );
				}
			);
		return success;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

}

/**
 * The one and only one object operator
 * @type {Object}
 */

const theOperator = new Operator ( );

export default theOperator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */