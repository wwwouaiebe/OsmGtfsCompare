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

import OsmDataLoader from './OsmDataLoader.js';
import theGtfsDataLoader from './GtfsDataLoader.js';
import theOsmDataTreeBuilder from './OsmDataTreeBuilder.js';
import OsmGtfsComparator from './OsmGtfsComparator.js';
import theReport from './Report.js';
import theExcludeList from './ExcludeList.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoader {

	/**
     * The costructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
     * Coming soon
     */

	#compareOsmGtfs ( ) {

		// loop on osm route master
		theOsmDataTreeBuilder.osmTree.routesMaster.forEach (
			osmRouteMaster => {
				let errorMessage = '';
				let gtfsRouteMaster = null;

				// Searching a GTFS route master with the same ref
				let gtfsRoutesMaster =
					theGtfsDataLoader.gtfsTree.routesMaster.filter ( element => osmRouteMaster.ref === element.ref );
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
					gtfsRoutesMaster = theGtfsDataLoader.gtfsTree.routesMaster.filter (
						element => {
							let returnValue =
								osmRouteMaster.ref === element.ref
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
						errorMessage = 'No GTFS route master found. ' +
							'Be sure that the osm route master have the same description than the GTFS route master.';
					}
					break;
				}

				if ( gtfsRouteMaster ) {

					// A GTFS route master exists. Adapting the GTFS route master
					gtfsRouteMaster.osmRouteMaster = true;

					// Start the comparison
					new OsmGtfsComparator ( ).compareRoutesMaster ( osmRouteMaster, gtfsRouteMaster );
				}
				else {

					// no GTFS route master found
					theReport.add ( 'h2', errorMessage );
				}
			}
		);
	}

	/**
     * Coming soon
     */

	#searchMissingOsmRouteMaster ( ) {

		theReport.add ( 'h1', 'Gtfs relations not found in the osm data' );

		// loop on the GTFS routes master
		theGtfsDataLoader.gtfsTree.routesMaster.forEach (
			routeMaster => {
				const excludedString = theExcludeList.getExcludeReason ( routeMaster.ref );
				if ( excludedString ) {
					theReport.add ( 'p', excludedString );
				}
				else if ( ! routeMaster.osmRouteMaster ) {
					theReport.add ( 'p', 'gtfs route ref : ' + routeMaster.ref );
					routeMaster.routes.forEach (
						route => {
							theReport.add ( 'p', route.name, null, route.shapePk );
						}
					);
					theReport.addToDo ( routeMaster.routes.lenght );
				}
			}
		);
	}

	/**
	 * Coming soon
	 */

	async start ( ) {

		// reset of the Errors only button
		document.getElementById ( 'errorsOnlyInput' ).value = 'Errors only';

		// reading the form
		let osmRef = document.getElementById ( 'osmRef' ).value;
		let osmNetwork = document.getElementById ( 'osmNetworkSelect' ).value;
		let osmVehicle = document.getElementById ( 'osmVehicleSelect' ).value;

		// opening report
		theReport.open ( );

		// loading exclude list
		await theExcludeList.loadData ( osmNetwork );

		// loading osm data
		await new OsmDataLoader ( ).fetchData (
			{
				osmNetwork : osmNetwork,
				osmVehicle : osmVehicle,
				osmRef : osmRef
			}
		);
		theOsmDataTreeBuilder.buildTree ( );

		// loading gtfs data
		await theGtfsDataLoader.loadData ( osmNetwork );

		// compare existing osm route master with gtfs route
		this.#compareOsmGtfs ( );

		// Search Missing osm route master only if no osm ref given by user
		if ( ! osmRef ) {
			this.#searchMissingOsmRouteMaster ( );
		}

		// close...
		theReport.close ( );
	}
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */