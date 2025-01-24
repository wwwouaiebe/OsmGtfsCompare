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

import theDocConfig from './DocConfig.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Simple container for the "operator" json file contains
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Operator {

	/**
	 * the contains of the "operator" json file
	 * @type {Object}
	 */

	#jsonOperator = {};

	/**
	 * An array with the networks name
	 * @type {Array.<String>}
	 */

	#networksAsStringArray = [];

	/**
	 * the operator name
	 * @type {String}
	 */

	get operator ( ) { return this.#jsonOperator.operator; }

	/**
	 * the operator name used in the osm data (can be different of the operator )
	 * @type {String}
	 */

	get osmOperator ( ) { return this.#jsonOperator.osmOperator; }

	/**
	 * an array with the networks names managed by the operator as used in the osm data
	 * (can be different than the GTFS networks see osm TECX + TECN = GTFS TECX)
	 * @type {Array.<String>}
	 */

	get networksAsStringArray ( ) {	return this.#networksAsStringArray; };

	/**
	 * An object with the values to exclude from the OSM GTFS comparison
	 * @type {Object}
	 */

	get excludeList ( ) {
		const network = this.#jsonOperator.networks.find ( element => element.osmNetwork === theDocConfig.network );
		return network.excludeList;
	}

	/**
	 * load the data from the "operator" json file
	 * @param {String} operator the name of the operator to load
	 */

	async loadData ( operator ) {

		const fileName = '../operators/' + operator.toLowerCase ( ) + '.json';
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
 * The one and only one object Operator
 * @type {Operator}
 */

const theOperator = new Operator ( );

export default theOperator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */