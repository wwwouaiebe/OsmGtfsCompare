import RouteMasterComparator from './RouteMasterComparator.js';
import { theGtfsTree, theOsmTree } from './DataTree.js';
import theReport from './Report.js';
import theExcludeList from './ExcludeList.js';

class OsmGtfsComparator {

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
     * Coming soon
     */

	searchMissingOsmRouteMaster ( ) {

		theReport.add ( 'h1', 'Gtfs relations not found in the osm data' );

		// loop on the GTFS routes master
		theGtfsTree.routesMaster.forEach (
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
					theReport.addToDo ( routeMaster.routes.length );
				}
			}
		);
	}

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
		if ( ! gtfsRouteMaster ) {
			theReport.add ( 'h2', errorMessage );
		}
		return gtfsRouteMaster;
	}

	/**
     * Coming soon
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
	}
}

export default OsmGtfsComparator;