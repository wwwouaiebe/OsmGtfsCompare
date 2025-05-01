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

import RouteMasterComparator from './RouteMasterComparator.js';
import { theGtfsTree, theOsmTree } from './DataTree.js';
import theReport from './Report.js';
import theExcludeList from './ExcludeList.js';
import theDocConfig from './DocConfig.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Compare the osm and GTFS route_master and routes
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmGtfsComparator {

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
     * Search all missing osm route_master
     */

	#searchMissingOsmRouteMaster ( ) {

		theReport.add ( 'h1', 'Gtfs relations not found in the osm data' );

		// loop on the GTFS routes master
		theGtfsTree.routesMaster.forEach (
			routeMaster => {
				if ( theDocConfig.vehicle !== [ 'tram', 'subway', 'train', 'bus', 'ferry,' ] [ routeMaster.type ] ) {
					return;
				}

				const excludedString = theExcludeList.getExcludedGTFSRelationReason ( routeMaster.ref );
				if ( excludedString ) {

					// Reporting the relation if excluded
					theReport.add ( 'h2', 'gtfs route ref : ' + routeMaster.ref + ' ' + routeMaster.description );
					theReport.add ( 'p', excludedString );
				}
				else if ( ! routeMaster.osmRouteMaster ) {

					// Reporting the relations if no osm route master
					theReport.add ( 'h2', 'gtfs route ref : ' + routeMaster.ref + ' ' + routeMaster.description );
					routeMaster.routes.forEach (
						route => {
							let isValidStartDate = new Date ( route.startDate ).valueOf ( ) < Date.now ( );
							let isValidEndDate = new Date ( route.endDate ).valueOf ( ) > Date.now ( );
							if ( isValidEndDate && isValidStartDate ) {
								theReport.add ( 'p', route.name + ' 🔴', null, route.shapePk );
								theReport.addToDo ( 1 );
							}
							else if ( isValidStartDate ) {
								theReport.add ( 'p', route.name + ' ⚫', null, route.shapePk );
							}
							else {
								theReport.add ( 'p', route.name + ' ⚪', null, route.shapePk );
							}
						}
					);
				}
			}
		);
	}

	/**
	 * Search a GTFS route master similar to the OSM route
	 * @param {Object} osmRouteMaster The osm route_master for witch a GTFS route_master is searched
	 * @returns {Object} a gtfs route_master with the same ref and description than the osmRouteMaster
	 */

	#SearchGtfsRouteMaster ( osmRouteMaster ) {
		let errorMessage = '';
		let gtfsRouteMaster = null;

		// Searching  GTFS routes master with the same ref
		let gtfsRoutesMaster =
            theGtfsTree.routesMaster.filter ( element => osmRouteMaster.ref === element.ref );
		switch ( gtfsRoutesMaster.length ) {
		case 0 : // no gtfs route master found
			errorMessage = 'The route ' + osmRouteMaster.ref + ' is not in the gtfs files.';
			break;
		case 1 : // one gtfs route master found
			gtfsRouteMaster = gtfsRoutesMaster [ 0 ];
			break;
		default :

			// more than one gtfs route master found
			// Searching a GTFS route master with the same ref and same description
			gtfsRoutesMaster = theGtfsTree.routesMaster.filter (
				element => {
					let returnValue =
                        osmRouteMaster.ref === element.ref
                        &&
						osmRouteMaster.description
						&&
                        0 === osmRouteMaster.description.toLowerCase ( ).localeCompare (
                        	element.description.toLowerCase ( )
                        );
					return returnValue;
				}
			);
			if ( 1 === gtfsRoutesMaster.length ) {

				// one gtfs route master found
				gtfsRouteMaster = gtfsRoutesMaster [ 0 ];
			}
			else {
				errorMessage = osmRouteMaster.name + ( osmRouteMaster.description ?? '' ) +
					' No GTFS route master found. ' +
                    'Be sure that the osm route master have the same ref and description than the GTFS route master.';
			}
			break;
		}
		if ( ! gtfsRouteMaster ) {
			theReport.add ( 'h2', errorMessage );
		}
		return gtfsRouteMaster;
	}

	/**
     * Search and compare the osm route_master and GTFS route_master
     */

	compare ( ) {

		// loop on osm route master
		theOsmTree.routesMaster.forEach (
			osmRouteMaster => {
				let gtfsRouteMaster = this.#SearchGtfsRouteMaster ( osmRouteMaster );
				if ( gtfsRouteMaster ) {

					// A GTFS route master exists. Adapting the GTFS route master
					gtfsRouteMaster.osmRouteMaster = true;

					// Start the comparison
					new RouteMasterComparator ( ).compare ( osmRouteMaster, gtfsRouteMaster );
				}
			}
		);

		if ( ! theDocConfig.ref && 'used' === theDocConfig.type ) {
			this.#searchMissingOsmRouteMaster ( );
		}
	}
}

export default OsmGtfsComparator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */