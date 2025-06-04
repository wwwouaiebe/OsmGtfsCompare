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

import theRelationsReport from './RelationsReport.js';
import TagsValidator from './TagsValidator.js';
import theDocConfig from './DocConfig.js';
import FixmeValidator from './FixmeValidator.js';
import OsmRouteValidator from './OsmRouteValidator.js';
import theExcludeList from './ExcludeList.js';
import theOsmDataLoader from './OsmDataLoader.js';
import TagKeyValue from './TagKeyValue.js';
import theOperator from './Operator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * route_master validator
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmRouteMasterValidator {

	/**
     * A counter for the errors
     * @type {Number}
     */

	#errorCounter = 0;

	/**
	 * The currently validated route master
	 * @type {Object}
	 */

	#routeMaster;

	/**
	 * verify that
	 * - the members are relations
	 * - the relation members are route relations
	 */

	#validateMembers ( ) {
		this.#routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = theOsmDataLoader.routes.get ( member.ref );
					if ( ! route ) {
						theRelationsReport.add (
							'p',
							'Error M003: a relation member of the route master is not a ' +
                            theDocConfig.vehicle + ' relation'
						);
						this.#errorCounter ++;
					}
				}
				else {
					theRelationsReport.add (
						'p',
						'Error M004: a member of the route master is not a relation (' +
                        member.type + ' ' + member.ref + ' )'
					);
					this.#errorCounter ++;
				}
			}
		);
	}

	/**
	 * Verify that the route_master have a ref tag
	 */

	#validateRefTag ( ) {
		if ( ! this.#routeMaster?.tags?.ref ) {
			theRelationsReport.add (
				'p',
				'Error M005: route_master without ref tag '
			);
			this.#errorCounter ++;
		}
	}

	/**
	 * verify that
	 * - the ref tag is the same on the route_master and on all route members
	 */

	#validateSameRefTag ( ) {
		this.#routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = theOsmDataLoader.routes.get ( member.ref );
					if ( route ) {
						if ( this.#routeMaster.tags.ref !== route.tags.ref ) {
							theRelationsReport.add (
								'p',
								'Error M006: ref tag of the route master (' + this.#routeMaster.tags.ref +
								') is not the same than the ref tag of the route (' + route.tags.ref + ')'
							);
							this.#errorCounter ++;
						}
					}
				}
			}
		);
	}

	/**
	 * verify that the name tag is compliant with the osm rules
	 */

	#validateName ( ) {
		if ( ! this.#routeMaster?.tags?.name ) {
			theRelationsReport.add (
				'p',
				'Error M008: no name tag for route_master'
			);
			this.#errorCounter ++;
		}
		if ( this.#routeMaster?.tags?.name && this.#routeMaster?.tags?.ref ) {
			let vehicle = theDocConfig.vehicle.substring ( 0, 1 ).toUpperCase ( ) +
       			theDocConfig.vehicle.substring ( 1 ) + ' ';
			if ( this.#routeMaster.tags.name !== vehicle + this.#routeMaster.tags.ref ) {
				theRelationsReport.add (
					'p',
					'Error M007: invalid name for route_master (must be ' + vehicle + ' ' + this.#routeMaster.tags.ref + ')'
				);
				this.#errorCounter ++;
			}
		}
	}

	/**
	 * validate each route associated to the route_master
	 */

	#validateRoutes ( ) {
		let routeArray = [];
		this.#routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = theOsmDataLoader.routes.get ( member.ref );
					if ( route ) {
						routeArray.push ( route );
					}
				}
			}
		);
		routeArray.sort ( ( first, second ) => first.tags.name.localeCompare ( second.tags.name ) );
		routeArray.forEach (
			route => new OsmRouteValidator ( ).validateRoute ( route )
		);
	}

	/**
	 * Verify that a route is attached to only one route_master
	 */

	#validateOnlyOneRouteMaster ( ) {
		let errorCounter = 0;
		theRelationsReport.add ( 'h1', 'Routes with more than one route_master' );
		theOsmDataLoader.routes.forEach (
			route => {
				if ( 1 !== route.routeMasters.length ) {
					let text = 'Error R018: route with more than one route_master (route_masters:';
					route.routeMasters.forEach (
						routeMaster => {
							text +=
								theRelationsReport.getOsmLink (
									theOsmDataLoader.routeMasters.find ( element => element.id === routeMaster )
								)
								+ ' ';
						}
					);
					text += ') routes:' + theRelationsReport.getOsmLink ( route );
					theRelationsReport.add ( 'p', text );
					errorCounter ++;
				}
			}
		);
		if ( 0 === errorCounter ) {
			theRelationsReport.add ( 'p', 'Nothing found' );
		}
	}

	/**
	 * A list of TagKeyValue to use for the validation of tags
	 * @returns {Array.<TagKeyValue>} An array with TagKeyValues to use for the validation of tags
	 */

	#routeMasterTagKeyValues ( ) {
		return [
			new TagKeyValue ( 'description', null ),
			new TagKeyValue (
				( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route_master',
				theDocConfig.vehicle
			),
			new TagKeyValue (
				'type',
				( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route_master'
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
	 * validate completely a route_master
	 */

	#validateRouteMaster ( ) {

		this.#errorCounter = 0;

		// heading for the route master in the report
		theRelationsReport.add (
			'h1',
			'Route_master: ' +
			( this.#routeMaster.tags.name ?? '' ) + ' ' +
            ( this.#routeMaster.tags.description ?? '' ) + ' ',
			this.#routeMaster
		);

		if ( theExcludeList.isOsmExcluded ( this.#routeMaster.id, true ) ) {
			return;
		}

		// heading for validation
		theRelationsReport.add ( 'h3', 'Validation of tags, roles and members for route master' );

		// validation of the route_master

		this.#errorCounter += new TagsValidator ( this.#routeMaster.tags, this.#routeMasterTagKeyValues ( ) ).validate ( );

		this.#errorCounter += new FixmeValidator ( this.#routeMaster ).validate ( );

		this.#validateMembers ( );
		this.#validateRefTag ( );
		this.#validateSameRefTag ( );
		this.#validateName ( );

		if ( 0 === this.#errorCounter ) {
			theRelationsReport.add ( 'p', 'No validation errors found for route_master' );
		}

		this.#validateRoutes ( );

	}

	/**
	 * the main procedure
	 */

	validate ( ) {

		this.#validateOnlyOneRouteMaster ( );

		theOsmDataLoader.routeMasters.forEach (
			routeMaster => {
				this.#routeMaster = routeMaster;
				this.#validateRouteMaster ( );
			}
		);
	}

	/**
	 * The constructor
 	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default OsmRouteMasterValidator;