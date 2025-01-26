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

import theExcludeList from './ExcludeList.js';
import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class RouteMasterComparator {

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#gtfsRouteMaster;

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#osmRouteMaster;

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 * @param {Object} gtfsRoute Coming soon
	 */

	#searchMissingPlatforms ( osmRoute, gtfsRoute ) {

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
		if ( '' === missingOsmPlatforms && '' === missingOsmPlatforms ) {
			theReport.add ( 'p', 'No platforms to add or to remove. Verify the order of the platforms and the duplicates' );
		}
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#compareFromToLow ( osmRoute ) {
		let possibleGtfsRoutes = [ ];
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
			theReport.add ( 'p', 'No gtfs route found 🔴' );
			break;
		case 1 :
			theReport.add ( 'p', 'A gtfs route with similar from and to platforms found 🟡' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			this.#searchMissingPlatforms ( osmRoute, possibleGtfsRoutes [ 0 ] );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			break;
		default :
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
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#compareFromToHight ( osmRoute ) {
		let possibleGtfsRoutes = [ ];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.from === osmRoute.from && gtfsRoute.to === osmRoute.to ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		switch ( possibleGtfsRoutes.length ) {
		case 0 :
			this.#compareFromToLow ( osmRoute );
			break;
		case 1 :
			theReport.add ( 'p', 'A gtfs route with from and to platforms found 🔵' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			this.#searchMissingPlatforms ( osmRoute, possibleGtfsRoutes [ 0 ] );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			break;
		default :
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
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#comparePlatformsHight ( osmRoute ) {

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
			this.#compareFromToHight ( osmRoute );
			break;
		case 1 :
			theReport.add ( 'p', 'A gtfs route with all platforms found 🟢' );
			theReport.add ( 'p', possibleGtfsRoutes [ 0 ].name, null, possibleGtfsRoutes [ 0 ].shapePk );
			possibleGtfsRoutes [ 0 ].osmRoute = true;
			theReport.addDoneOk ( );
			break;
		default :
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
	 * Coming soon
	 */

	#compareRoutes ( ) {
		this.#osmRouteMaster.routes.forEach (
			osmRoute => {
				theReport.add (
					'h2',
					osmRoute.name + ( osmRoute.via ? ' via ' + osmRoute.via.replaceAll ( ';', ', ' ) : '' ),
					osmRoute
				);
				if ( ! theExcludeList.isOsmExcluded ( osmRoute.id, false ) ) {
					theReport.add ( 'h3', 'GTFS comparison results for route' );
					this.#comparePlatformsHight ( osmRoute );
				}
			}
		);
	}

	/**
	 * Coming soon
	 */

	#reportMissingOsmRoutes ( ) {
		let addHeading = true;
		this.#gtfsRouteMaster.routes.sort (
			( first, second ) => first.name.localeCompare ( second.name )
		);
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				let isIncluded = false;
				if ( ! gtfsRoute.osmRoute ) {
					if ( addHeading ) {
						theReport.add ( 'h2', 'Missing osm relations' );
						addHeading = false;
					}
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
						let isValidDate = new Date ( gtfsRoute.endDate ).valueOf ( ) > Date.now ( );
						theReport.add ( 'p', gtfsRoute.name + ( isValidDate ? ' 🔴' : ' ⚫' ), null, gtfsRoute.shapePk );
						if ( isValidDate ) {
							theReport.addToDo ( 1 );
						}
					}
				}
			}
		);
	}

	/**
	 * Coming soon
	 */

	#compareRouteMasterDescription ( ) {
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
	 * Coming soon
	 * @param {Object} osmRouteMaster Coming soon
	 * @param {Object} gtfsRouteMaster Coming soon
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