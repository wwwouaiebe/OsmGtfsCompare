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

import TagsBuilder from './TagsBuilder.js';
import theReport from './Report.js';
import TagsValidator from './TagsValidator.js';
import theDocConfig from './DocConfig.js';
import FixmeValidator from './FixmeValidator.js';
import OsmRouteValidator from './OsmRouteValidator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * route_master validator
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmRouteMasterValidator {

	/**
     * Coming soon
     * @type {Object}
     */

	#osmDataLoader = {};

	/**
     * the used tags
     * @type {Object}
     */

	#tags;

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
					let route = this.#osmDataLoader.routes.get ( member.ref );
					if ( ! route ) {
						theReport.add (
							'p',
							'A relation member of the route master is not a ' +
                            theConfig.osmVehicle + ' relation'
					 );
					}
				}
				else {
					theReport.add (
						'p',
						'A member of the route master is not a relation (' +
                        member.type + ' ' + member.ref + ' )'
					);
				}
			}
		);
	}

	/**
	 * Verify that the route_master have a ref tag
	 */

	#validateRefTag ( ) {
		if ( ! this.#routeMaster?.tags?.ref ) {
			theReport.add (
				'p',
				'Route_master without ref tag '
			);
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
					let route = this.#osmDataLoader.routes.get ( member.ref );
					if ( route ) {
						if ( this.#routeMaster.tags.ref !== route.tags.ref ) {
							theReport.add (
								'p',
								'ref tag of the route master (' + this.#routeMaster.tags.ref +
								') is not the same than the ref tag of the route (' + route.tags.ref + ')'
							);
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
		let vehicle = theDocConfig.vehicle.substring ( 0, 1 ).toUpperCase ( ) +
        theDocConfig.vehicle.substring ( 1 ) + ' ';
		if ( this.#routeMaster.tags.name !== vehicle + this.#routeMaster.tags.ref ) {
			theReport.add (
				'p',
				'Invalid name for route_master (must be ' + vehicle + this.#routeMaster.tags.ref + ')'
			);
		}
	}

	/**
	 * validate each route associated to the route_master
	 */

	#validateRoutes ( ) {
		this.#routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = this.#osmDataLoader.routes.get ( member.ref );
					if ( route ) {
						new OsmRouteValidator ( ).validateRoute ( route, this.#osmDataLoader );
					}
				}
			}
		);
	}

	/**
	 * Verify that only one route_master use a route
	 */

	#validateOnlyOneRouteMaster ( ) {
		theReport.add ( 'h1', 'Routes with more than one route_master' );
		this.#osmDataLoader.routes.forEach (
			route => {
				if ( 1 !== route.routeMasters.length ) {
					let text = 'Route with more than one route_master (route_masters:';
					route.routeMasters.forEach (
						routeMaster => {
							text += theReport.getOsmLink ( this.#osmDataLoader.routeMasters.get ( routeMaster ) ) + ' ';
						}
					);
					text += ') routes:' + theReport.getOsmLink ( route );
					theReport.add ( 'p', text );
				}
			}

		);
	}

	/**
	 * validate completely a route_master
	 */

	#validateRouteMaster ( ) {

		// heading in the report
		theReport.add (
			'h1',
			( this.#routeMaster.tags.name ?? '' ) + ' ' +
            ( this.#routeMaster.tags.description ?? '' ) + ' ',
			this.#routeMaster
		);

		// validation of the route_master
		new TagsValidator ( this.#routeMaster, this.#tags ).validate ( );
		this.#validateMembers ( );
		this.#validateRefTag ( );
		this.#validateSameRefTag ( );
		this.#validateName ( );
		new FixmeValidator ( ).validate ( this.#routeMaster );
		this.#validateRoutes ( );
	}

	/**
	 * the main procedure
	 */

	validate ( ) {

		// await new MissingRouteMasterValidator ( ).fetchData ( );
		this.#validateOnlyOneRouteMaster ( );

		this.#osmDataLoader.routeMasters.forEach (
			routeMaster => {
				this.#routeMaster = routeMaster;
				this.#validateRouteMaster ( );
			}
		);
	}

	/**
	 * The constructor
     * @param {OsmDataLoader} osmDataLoader Coming soon
	 */

	constructor ( osmDataLoader ) {
		this.#osmDataLoader = osmDataLoader;
		this.#tags = new TagsBuilder ( ).getRouteMasterTags ( );
		Object.freeze ( this );
	}
}

export default OsmRouteMasterValidator;