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

import theExcludeList from './ExcludeList.js';
import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmGtfsComparator {

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

	#isOsmExcluded ( osmId ) {
		const excludeData = theExcludeList.getOsmData ( osmId );
		if ( excludeData?.note ) {
			theReport.add ( 'p', excludeData.note );
		}
		if ( excludeData?.reason ) {
			theReport.add ( 'p', 'This relation is excluded ( reason : ' + excludeData.reason + ' )' );
			return true;
		}
		return false;
	}

	/**
	 * Coming soon
	 * @param {Object} osmRouteMaster Coming soon
	 * @param {Object} gtfsRouteMaster Coming soon
	 */

	compareRoutesMaster ( osmRouteMaster, gtfsRouteMaster ) {
		this.#gtfsRouteMaster = gtfsRouteMaster;
		this.#osmRouteMaster = osmRouteMaster;
		theReport.add (
			'h1',
			this.#osmRouteMaster.name + ': ' + ( this.#osmRouteMaster.description ?? '' ),
			this.#osmRouteMaster.id
		);

		if (
			( this.#osmRouteMaster.description ?? '' ).toLowerCase ( ).replaceAll ( ' ', '' )
			!==
			( this.#gtfsRouteMaster.description ?? '' ).toLowerCase ( ).replaceAll ( ' ', '' )
		) {
			theReport.add (
				'p',
				'The osm description is not equal to the GTFS route long name 🔴',
				null,
				null
			);
		}

		// console.log ( osmRouteMaster );
		// console.log ( gtfsRouteMaster );

		if ( this.#isOsmExcluded ( osmRouteMaster.id ) ) {
			return;
		}

		this.#osmRouteMaster.routes.forEach (
			osmRoute => {
				theReport.add ( 'h2', osmRoute.name, osmRoute.id );
				if ( ! this.#isOsmExcluded ( osmRoute.id ) ) {
					this.#comparePlatformsHight ( osmRoute );
				}
			}
		);
		theReport.add ( 'h2', 'Missing osm relations' );
		this.#gtfsRouteMaster.routes.sort (
			( first, second ) => first.name.localeCompare ( second.name )
		);
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				let isIncluded = false;
				if ( ! gtfsRoute.osmRoute ) {
					this.#osmRouteMaster.routes.forEach (
						osmRoute => {
							if ( osmRoute.platforms.match ( gtfsRoute.platformsString ) ) {
								if ( ! isIncluded ) {
									theReport.add ( 'p', gtfsRoute.name + ' 🟣', null, gtfsRoute.shapePk );
									isIncluded = true;
								}
								theReport.add ( 'p', 'This relation is a part of ' + osmRoute.name, osmRoute.id, null );
							}
						}
					);
					if ( ! isIncluded ) {
						theReport.add ( 'p', gtfsRoute.name + ' 🔴', null, gtfsRoute.shapePk );
						theReport.addToDo ( );
					}
				}
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

export default OsmGtfsComparator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */