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

import theExcludeList from './ExcludeList.js';
import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Route_master comparator. Compare a GTFS route_master with an OSM route_master
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteMasterComparator {

	/**
	 * The compared GTFS route_master
	 * @type {Object}
	 */

	#gtfsRouteMaster;

	/**
	 * The compared OSM route_master
	 * @type {Object}
	 */

	#osmRouteMaster;

	/**
	 * Compare the platforms of a GTFS route and an OSMRoute and do a list of platforms to add to or remove from OSM
	 * @param {Object} osmRoute The OSM route
	 * @param {Object} gtfsRoute The GTFS route
	 */

	#searchMissingPlatforms ( osmRoute, gtfsRoute ) {

		// Loop on the GTFS platforms
		let missingOsmPlatforms = '';
		gtfsRoute.platformsString.slice ( 0, -1 ).split ( ';' )
			.forEach (
				gtfsPlatform => {
					if ( ! osmRoute.platformNames.get ( gtfsPlatform ) ) {
						missingOsmPlatforms += ' ' +
						gtfsRoute.platformNames.get ( gtfsPlatform ) +
						' ( ' + gtfsPlatform + ' )';
					}
				}
			);
		theReport.add ( 'p', 'Platforms to add in the osm relation:' + missingOsmPlatforms );

		// loop on the OSM platforms
		let missingGtfsPlatforms = '';
		osmRoute.platforms.slice ( 0, -1 ).split ( ';' )
			.forEach (
				osmPlatform => {
					if ( ! gtfsRoute.platformNames.get ( osmPlatform ) ) {
						missingGtfsPlatforms += ' ' +
						osmRoute.platformNames.get ( osmPlatform ) +
						' ( ' + osmPlatform + ' )';
					}
				}
			);
		theReport.add ( 'p', 'Platforms to remove in the osm relation:' + missingGtfsPlatforms );

		// Warning when no missing platforms
		if ( '' === missingOsmPlatforms && '' === missingOsmPlatforms ) {
			theReport.add ( 'p', 'No platforms to add or to remove. Verify the order of the platforms and the duplicates' );
		}
	}

	/**
	 * Compare an osm route with the gtfs routes
	 * We compare only a part of the first and last platforms
	 * @param {Object} osmRoute The osm route to compare
	 */

	#compareFromToLow ( osmRoute ) {
		let possibleGtfsRoutes = [ ];

		// loop on the GTFS route
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if (
					gtfsRoute.from.slice ( 0, -1 ) === osmRoute.from.slice ( 0, -1 )
                    &&
                    gtfsRoute.to.slice ( 0, -1 ) === osmRoute.to.slice ( 0, -1 )
				) {
					possibleGtfsRoutes.push ( gtfsRoute );
 				}
			}
		);
		switch ( possibleGtfsRoutes.length ) {

		case 0 :

			// No gtfs route found.
 			theReport.add ( 'p', 'No gtfs route found 🔴' );
			break;

		case 1 :

			// only one GTFS route found. Completing the report and making a list of missing platforms
			theReport.add ( 'p', 'A gtfs route with similar from and to platforms found 🟡' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			this.#searchMissingPlatforms ( osmRoute, possibleGtfsRoutes [ 0 ] );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			break;

		default :

			// Multiple GTFS route found. Completing the report and making a list of missing platforms
			theReport.add ( 'p', 'Multiple gtfs routes with similar from and to platforms found 🟡' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					theReport.add ( 'p', possibleGtfsRoute.name, null, possibleGtfsRoute.shapePk );
					this.#searchMissingPlatforms ( osmRoute, possibleGtfsRoute );
					possibleGtfsRoute.osmRoute = true;
				}
			);
			break;
		}
	}

	/**
	 * Compare an osm route with the gtfs routes
	 * We compare only the first and last platforms
	 * @param {Object} osmRoute The osm route to compare
	 */

	#compareFromToHight ( osmRoute ) {
		let possibleGtfsRoutes = [ ];

		// loop on the GTFS route
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if (
					gtfsRoute.from === osmRoute.from
					&&
					gtfsRoute.to === osmRoute.to
					&&
					! gtfsRoute.osmRoute
				) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);

		switch ( possibleGtfsRoutes.length ) {

		case 0 :

			// No gtfs route found. We will try to compare only on a part of the starting and ending platforms
			this.#compareFromToLow ( osmRoute );
			break;

		case 1 :

			// only one GTFS route found. Completing the report and making a list of missing platforms
			theReport.add ( 'p', 'A gtfs route with from and to platforms found 🔵' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			this.#searchMissingPlatforms ( osmRoute, possibleGtfsRoutes [ 0 ] );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			break;

		default :

			// Multiple GTFS route found. Completing the report and making a list of missing platforms
			theReport.add ( 'p', 'Multiple gtfs routes with from and to platforms found 🔵' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					theReport.add ( 'p', possibleGtfsRoute.name, null, possibleGtfsRoute.shapePk );
					this.#searchMissingPlatforms ( osmRoute, possibleGtfsRoute );
					possibleGtfsRoute.osmRoute = true;
				}
			);
			break;
		}
	}

	/**
	 * Compare an osm route with the gtfs routes.
	 * We compare first the csv platforms string. If all the platforms are the same and in the same order,
	 * we consider that the osm route and gtfs route are the same
	 * @param {Object} osmRoute The osm route to compare
	 */

	#comparePlatformsHight ( osmRoute ) {

		// loop on the gtfs routes
		let possibleGtfsRoutes = [];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.platformsString === osmRoute.platforms ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);

		switch ( possibleGtfsRoutes.length ) {

		case 0 :
			theReport.addDoneNotOk ( );

			// No gtfs route found. We will try to compare only the starting and ending platforms
			this.#compareFromToHight ( osmRoute );
			break;

		case 1 :

			// only one GTFS route found. Completing the report
			theReport.add ( 'p', 'A gtfs route with all platforms found 🟢' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			theReport.addDoneOk ( );
			break;

		default :

			// Multiple GTFS routes found (Yes that can...). Completing the report
			theReport.add ( 'p', 'Multiple gtfs routes with all platforms found 🟢' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					theReport.add ( 'p', possibleGtfsRoute.name, null, possibleGtfsRoute.shapePk );
					possibleGtfsRoute.osmRoute = true;
				}
			);
			theReport.addDoneOk ( );
			break;
		}
	}

	/**
	 * Add to the report the gtfs routes for witch no OSM route was found
	 */

	#reportMissingOsmRoutes ( ) {
		let addHeading = true;
		this.#gtfsRouteMaster.routes.sort (
			( first, second ) => first.name.localeCompare ( second.name )
		);

		// loop on the GTFS routes
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {

				// skip the route if an osm route was found
				if ( gtfsRoute.osmRoute ) {
					return;
				}

				// Heading
				if ( addHeading ) {
					theReport.add ( 'h2', 'Missing osm relations' );
					addHeading = false;
				}

				// loop on the osm routes , searching an osm route with the same sequence of platforms
				// and reporting similar routes
				let isIncluded = false;
				this.#osmRouteMaster.routes.forEach (
					osmRoute => {
						if ( osmRoute.platforms.match ( gtfsRoute.platformsString ) ) {
							if ( ! isIncluded ) {
								theReport.add ( 'p', gtfsRoute.name + ' 🟣', null, gtfsRoute.shapePk );
								isIncluded = true;
							}
							theReport.add ( 'p', 'This relation is a part of ' + osmRoute.name, osmRoute, null );
							theReport.addToDo ( 1 );
						}
					}
				);

				if ( ! isIncluded ) {

					// reporting the route as missing if the route start date is in the past
					let isValidDate = new Date ( gtfsRoute.endDate ).valueOf ( ) > Date.now ( );
					theReport.add ( 'p', gtfsRoute.name + ( isValidDate ? ' 🔴' : ' ⚫' ), null, gtfsRoute.shapePk );
					if ( isValidDate ) {
						theReport.addToDo ( 1 );
					}
				}
			}
		);
	}

	/**
	 * Compare the routes linked to the route_master
	 */

	#compareRoutes ( ) {

		// loop on the osm routes
		this.#osmRouteMaster.routes.forEach (
			osmRoute => {
				theReport.add (
					'h2',
					osmRoute.name + ( osmRoute.via ? ' via ' + osmRoute.via.replaceAll ( ';', ', ' ) : '' ),
					osmRoute
				);
				if ( ! theExcludeList.isOsmExcluded ( osmRoute.id, false ) ) {
					theReport.add ( 'h3', 'GTFS comparison results for route' );

					// starting to compare the platforms
					this.#comparePlatformsHight ( osmRoute );
				}
			}
		);
	}

	/**
	 * Compare the route_master description. Route_master description is needed when when multiple
	 * OSM route_master have the same ref
	 */

	#compareRouteMasterDescription ( ) {

		// Needed to remove white spaces due to double white spaces or trailing white spaces on the GTFS side
		if (
			( this.#osmRouteMaster.description ?? '' ).toLowerCase ( ).replaceAll ( ' ', '' )
			!==
			( this.#gtfsRouteMaster.description ?? '' ).toLowerCase ( ).replaceAll ( ' ', '' )
		) {
			theReport.add (
				'p',
				'Error C001: the osm description of the route_master ( ' +
				this.#osmRouteMaster.description +
				') is not equal to the GTFS route long name ( ' +
				this.#gtfsRouteMaster.description +
				' )'
			);
			return false;
		}
		theReport.add ( 'p', 'No validation errors found for route_master' );

		return true;
	}

	/**
	 * Start the comparison between route_master
	 * @param {Object} osmRouteMaster The osm route to compare
	 * @param {Object} gtfsRouteMaster The GTFS route to compare
	 */

	compare ( osmRouteMaster, gtfsRouteMaster ) {

		this.#gtfsRouteMaster = gtfsRouteMaster;
		this.#osmRouteMaster = osmRouteMaster;
		theReport.add (
			'h1',
			this.#osmRouteMaster.name + ': ' + ( this.#osmRouteMaster.description ?? '' ),
			this.#osmRouteMaster
		);

		if ( theExcludeList.isOsmExcluded ( osmRouteMaster.id, false ) ) {
			return;
		}

		theReport.add ( 'h3', 'GTFS comparison results for route_master' );

		this.#compareRouteMasterDescription ( );

		this.#compareRoutes ( );

		this.#reportMissingOsmRoutes ( );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default RouteMasterComparator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */