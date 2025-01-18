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
import TagsValidator from './TagsValidator.js';
import RolesValidator from './RolesValidator.js';
import ContinuousRouteValidator from './ContinuousRouteValidator.js';
import NameFromtoRefValidator from './NameFromToRefValidator.js';
import TagsBuilder from './TagsBuilder.js';
import FixmeValidator from './FixmeValidator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Validator for osm public_transport routes
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmRouteValidator {

 	/**
	 * The route currently controlled
	 * @type {Object}
	 */

	#route = null;

	/**
	 * The platforms associated to the route (= members with 'platform' role)
	 * @type {Array}
	 */

	#platforms = [];

	/**
	 * the ways associated to the route (= members without role but having an highway tag
	 * for bus or a railway tag for tram and subway)
	 * @type {Array}
	 */

	#ways = [];

	/**
     * the used tags
     * @type {Object}
     */

	#tags;

	/**
	* Validate the operator tag
	 */

	#validateOperator ( ) {
		if ( this.#route?.tags?.operator ) {
			let operators = this.#route?.tags?.operator.split ( ';' );
			const validOperators = [ 'TEC', 'De lijn', 'STIB/MIVB' ];
			let validOperatorFound = false;
			operators.forEach (
				operator => {
					if ( -1 !== validOperators.indexOf ( operator ) ) {
						validOperatorFound = true;
					}
				}
			);
			if ( ! validOperatorFound ) {
				theReport.add (
					'p',
					'The operator is not valid for route'
				);

			}
		}
		else {

			// no operator tag
			theReport.add (
				'p',
				'An operator tag is not found for route'
			);
		}
	}

	/**
	 * Validate a route
     * @param { Object } route The route to validate
	 */

	validateRoute ( route ) {

		this.#route = route;
		this.#platforms = [];
		this.#ways = [];

		theReport.add (
			'h2',
			'\nNow validating route ' +
			( this.#route.tags.name ?? '' ) + ' ' +
			( this.#route.tags.via ? 'via ' + this.#route.tags.via.replace ( ';', ', ' ) + ' ' : '' ),
			this.#route
		);

		this.#validateOperator ( );
		new FixmeValidator ( ).validate ( this.#route );
		new TagsValidator ( this.#route, this.#tags ).validate ( );
		new RolesValidator ( this.#route, this.#platforms, this.#ways ).validate ( );
		new ContinuousRouteValidator ( this.#route, this.#ways ).validate ( );
		new NameFromtoRefValidator ( this.#route, this.#platforms ).validate ( );
	}

 	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
		this.#tags = new TagsBuilder ( ).getRouteTags ( );
	}
}

export default OsmRouteValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */