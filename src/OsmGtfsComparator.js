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

import RouteMasterComparator from './RouteMasterComparator.js';
import { theGtfsTree, theOsmTree } from './DataTree.js';
import theReport from './Report.js';
import theExcludeList from './ExcludeList.js';
import theDocConfig from './DocConfig.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
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
     * Coming soon
     */

	searchMissingOsmRouteMaster ( ) {

		if ( 'used' !== theDocConfig.type ) {
			return;
		}

		theReport.add ( 'h1', 'Gtfs relations not found in the osm data' );

		// loop on the GTFS routes master
		theGtfsTree.routesMaster.forEach (
			routeMaster => {
				let vehicle = document.getElementById ( 'osmVehicleSelect' ).value;
				if ( vehicle !== [ 'tram', 'subway', 'train', 'bus', 'ferry,' ] [ routeMaster.type ] ) {
					return;
				}
				const excludedString = theExcludeList.getExcludeReason ( routeMaster.ref );
				if ( excludedString ) {
					theReport.add ( 'h2', 'gtfs route ref : ' + routeMaster.ref + ' ' + routeMaster.description );
					theReport.add ( 'p', excludedString );
				}
				else if ( ! routeMaster.osmRouteMaster ) {
					theReport.add ( 'h2', 'gtfs route ref : ' + routeMaster.ref + ' ' + routeMaster.description );
					routeMaster.routes.forEach (
						route => {
							theReport.add ( 'p', route.name + ' 🔴', null, route.shapePk );
						}
					);
					theReport.addToDo ( routeMaster.routes.length );
				}
			}
		);
	}

	/**
	 * Coming soon
	 * @param {Object} osmRouteMaster Coming soon
	 * @returns {Object} Coming soon
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
     * Coming soon
     */

	compare ( ) {

		if ( 'used' !== theDocConfig.type ) {
			return;
		}

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
	}
}

export default OsmGtfsComparator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */