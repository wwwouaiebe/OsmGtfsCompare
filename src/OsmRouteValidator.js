/*
Copyright - 2024 2025 - wwwouaiebe - Contact: https://www.ouaie.be/

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

import theRelationsReport from './RelationsReport.js';
import TagsValidator from './TagsValidator.js';
import RolesValidator from './RolesValidator.js';
import ContinuousRouteValidator from './ContinuousRouteValidator.js';
import NameFromToRefValidator from './NameFromToRefValidator.js';
import FixmeValidator from './FixmeValidator.js';
import TagKeyValue from './TagKeyValue.js';
import theOperator from './Operator.js';
import theDocConfig from './DocConfig.js';
import theExcludeList from './ExcludeList.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Validator for osm public_transport routes
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmRouteValidator {

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
	 * @type {Array.<Object>}
	 */

	#platforms = [];

	/**
	 * the ways associated to the route (= members without role but having an highway tag
	 * for bus or a railway tag for tram and subway)
	 * @type {Array.<Object>}
	 */

	#ways = [];

	/**
	 * Get the route TagKeyValue
	 * @type {Array}
	 */

	#routeTagKeyValues ( ) {
		return [
			new TagKeyValue ( 'public_transport:version', '2' ),
			new TagKeyValue (
				( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route',
				theDocConfig.vehicle
			),
			new TagKeyValue (
				'type',
				( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route'
			),
			new TagKeyValue (
				'operator',
				[ theOperator.osmOperator ]
			),
			new TagKeyValue (
				'network',
				[ theDocConfig.network ]
			)
		];
	}

	/**
	 * Validate a route
     * @param { Object } route The route to validate
	 */

	validateRoute ( route ) {

		this.#route = route;
		this.#platforms = [];
		this.#ways = [];
		this.#errorCounter = 0;

		theRelationsReport.add (
			'h2',
			'Route: ' +
			( this.#route.tags.name ?? '' ) + ' ' +
			( this.#route.tags.via ? 'via ' + this.#route.tags.via.replace ( ';', ', ' ) + ' ' : '' ),
			this.#route
		);

		if ( theExcludeList.isOsmExcluded ( this.#route.id, true ) ) {
			return;
		}

		theRelationsReport.add ( 'h3', 'Validation of tags, roles and members for route' );

		this.#errorCounter += new TagsValidator ( this.#route.tags, this.#routeTagKeyValues ( ) ).validate ( );
		this.#errorCounter += new FixmeValidator ( this.#route ).validate ( );
		this.#errorCounter += new RolesValidator ( this.#route, this.#platforms, this.#ways ).validate ( );
		this.#errorCounter += new ContinuousRouteValidator ( this.#route, this.#ways ).validate ( );
		this.#errorCounter += new NameFromToRefValidator ( this.#route, this.#platforms ).validate ( );

		if ( 0 === this.#errorCounter ) {
			theRelationsReport.add ( 'p', 'No validation errors found for route' );
		}
	}

 	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default OsmRouteValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */