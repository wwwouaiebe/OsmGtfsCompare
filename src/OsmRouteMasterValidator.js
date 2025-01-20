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
import theExcludeList from './ExcludeList.js';
import theOsmDataLoader from './OsmDataLoader.js';
import OperatorValidator from './OperatorValidator.js';
import NetworkValidator from './NetworkValidator.js';

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
						theReport.add (
							'p',
							'Error M003: a relation member of the route master is not a ' +
                            theDocConfig.vehicle + ' relation'
						);
						this.#errorCounter ++;
					}
				}
				else {
					theReport.add (
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
			theReport.add (
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
							theReport.add (
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
			theReport.add (
				'p',
				'Error M008: no name tag for route_master'
			);
			this.#errorCounter ++;
		}
		if ( this.#routeMaster?.tags?.name && this.#routeMaster?.tags?.ref ) {
			let vehicle = theDocConfig.vehicle.substring ( 0, 1 ).toUpperCase ( ) +
       			theDocConfig.vehicle.substring ( 1 ) + ' ';
			if ( this.#routeMaster.tags.name !== vehicle + this.#routeMaster.tags.ref ) {
				theReport.add (
					'p',
					'Error M007: invalid name for route_master (must be ' + vehicle + this.#routeMaster.tags.ref + ')'
				);
				this.#errorCounter ++;
			}
		}
	}

	/**
	 * validate each route associated to the route_master
	 */

	#validateRoutes ( ) {
		this.#routeMaster.members.forEach (
			member => {
				if ( 'relation' === member.type ) {
					let route = theOsmDataLoader.routes.get ( member.ref );
					if ( route ) {
						new OsmRouteValidator ( ).validateRoute ( route );
					}
				}
			}
		);
	}

	/**
	 * Verify that only one route_master use a route
	 */

	#validateOnlyOneRouteMaster ( ) {
		let errorCounter = 0;
		theReport.add ( 'h1', 'Routes with more than one route_master' );
		theOsmDataLoader.routes.forEach (
			route => {
				if ( 1 !== route.routeMasters.length ) {
					let text = 'Error R018: route with more than one route_master (route_masters:';
					route.routeMasters.forEach (
						routeMaster => {
							text +=
								theReport.getOsmLink (
									theOsmDataLoader.routeMasters.find ( element => element.id === routeMaster )
								)
								+ ' ';
						}
					);
					text += ') routes:' + theReport.getOsmLink ( route );
					theReport.add ( 'p', text );
					errorCounter ++;
				}
			}
		);
		if ( 0 === errorCounter ) {
			theReport.add ( 'p', 'Nothing found' );
		}
	}

	/**
	 * Coming soon
	 * @param {String} osmId Coming soon
	 * @returns {boolean} Coming soon
	 */

	#isOsmExcluded ( osmId ) {
		const excludeData = theExcludeList.getOsmData ( osmId );
		if ( excludeData?.note ) {
			theReport.add ( 'p', excludeData.note );
		}
		if ( excludeData?.reason ) {
			theReport.add ( 'p', 'This relation is excluded from the comparison  ( reason : ' + excludeData.reason + ' )' );
			return true;
		}
		return false;
	}

	/**
	 * validate completely a route_master
	 */

	#validateRouteMaster ( ) {

		this.#errorCounter = 0;

		// heading for the route masterin the report
		theReport.add (
			'h1',
			'Route_master: ' +
			( this.#routeMaster.tags.name ?? '' ) + ' ' +
            ( this.#routeMaster.tags.description ?? '' ) + ' ',
			this.#routeMaster
		);

		// heading for validation
		theReport.add ( 'h3', 'Validation of tags, roles and members for route master' );

		if ( this.#isOsmExcluded ( this.#routeMaster.id ) ) {
			return;
		}

		// validation of the route_master
		this.#errorCounter += new TagsValidator ( this.#routeMaster, TagsBuilder.RouteMasterTags ).validate ( );
		this.#errorCounter += new OperatorValidator ( this.#routeMaster ).validate ( );
		this.#errorCounter += new NetworkValidator ( this.#routeMaster ).validate ( );
		this.#errorCounter += new FixmeValidator ( this.#routeMaster ).validate ( );

		this.#validateMembers ( );
		this.#validateRefTag ( );
		this.#validateSameRefTag ( );
		this.#validateName ( );

		if ( 0 === this.#errorCounter ) {
			theReport.add ( 'p', 'No validation errors found for route_master' );
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