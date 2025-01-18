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

import theReport from './Report.js';
import theDocConfig from './DocConfig.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * fixme tag validator
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class NameFromtoRefValidator {

	/**
     * A counter for the errors
     * @type {Number}
     */

	#errorCounter = 0;

	/**
	 * The route currently controlled
	 * @type {Object}
	 */

	#route = null;

	/**
	 * The platforms associated to the route (= members with 'platform' role)
	 * @type {Array}
	 */

	#platforms;

	/**
	* Verify that the route have a from tag, a to tag, a name tag and a ref tag
	 */

	#haveTagsNameFromToRef ( ) {
		return this.#route?.tags?.from && this.#route?.tags?.to && this.#route?.tags?.name && this.#route?.tags?.ref;
	}

	/**
	* Validate the from tag
	 */

	#validateFrom ( ) {

		if ( ! this.#route?.tags?.from ) {

			// no from tag
			theReport.add (
				'p',
				'Error R002: a from tag is not found for route'
			);
			this.#errorCounter ++;
		}
		else if (
			this.#route?.tags?.from !== this.#platforms[ 0 ]?.tags?.name
			&&
			this.#route?.tags?.from !== ( this.#platforms [ 0 ]?.tags [ 'name:' + this.#route?.tags?.operator ] ?? '' )
		) {

			// from tag is not the same than the name of the first platform
			theReport.add (
				'p',
				'Error R003: the from tag is not equal to the name of the first platform for route '
			);
			this.#errorCounter ++;
		}
	}

	/**
	* Validate the to tag
	 */

	#validateTo ( )	{
		if ( ! this.#route?.tags?.to ) {

			// no to tag
			theReport.add (
				'p',
				'Error R004: a to tag is not found for route'
			);
			this.#errorCounter ++;
		}
		else if (
			this.#route?.tags?.to !== this.#platforms.toReversed ( )[ 0 ]?.tags?.name
			&&
			(
				this.#route?.tags?.to
				!==
				( this.#platforms.toReversed ( ) [ 0 ]?.tags [ 'name:' + this.#route?.tags?.operator ] ?? '' )
			)
		) {

			// to tag is not the same than the name of the last platform
			theReport.add (
				'p',
				'Error R005: the to tag is not equal to the name of the last platform for route'
			);
			this.#errorCounter ++;
		}
	}

	/**
	* Verify that the name is compliant with the osm rules
	 */

	#validateName ( ) {
		let vehicle = theDocConfig.vehicle.substring ( 0, 1 ).toUpperCase ( ) +
		theDocConfig.vehicle.substring ( 1 ) + ' ';
		if ( this.#haveTagsNameFromToRef ( ) ) {
			let goodName = vehicle + this.#route?.tags?.ref + ': ' + this.#route?.tags?.from + ' → ' + this.#route?.tags?.to;
			if ( this.#route?.tags?.name !== goodName ) {
				theReport.add (
					'p',
					'Error R006: Invalid name ("' + this.#route?.tags?.name + '" but expected "' + goodName + '") for route '
				);
				this.#errorCounter ++;
			}
		}
		else {
			theReport.add (
				'p',
				'Error R007: missing from, to, ref or name tags for route'
			);
			this.#errorCounter ++;
		}
	}

	/**
	 * Coming soon
	 */

	validate ( ) {
		this.#errorCounter = 0;
		this.#validateFrom ( );
		this.#validateTo ( );
		this.#validateName ( );
		return this.#errorCounter;
	}

	/**
	 * The constructor
	 * @param {Object} route the route to validate
	 * @param {Array} platforms The platforms attached to the route
	 */

	constructor ( route, platforms ) {
		this.#route = route;
		this.#platforms = platforms;
		Object.freeze ( this );
	}
}

export default NameFromtoRefValidator;