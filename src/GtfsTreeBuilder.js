/*
Copyright - 2024 2025 - wwwouaiebe - Contact: https://www.ouaie.be/

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
import { theGtfsTree } from './DataTree.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Transform the GTFS tree in a way usable by JS. Reminder: json don't know maps...
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class GtfsTreeBuilder {

	/**
	 * Convert a date to the format year-month-day
	 * @param {String} sourceDate The date as in the json file. Dates in the json file are ISO date with UTC hours...
	 * @returns {String} the date in the format year-month-day
	 */

	#convertDate ( sourceDate ) {
		let tmpDate =
			new Date ( sourceDate )
				.toLocaleDateString ( )
				.split ( '/' );

		return tmpDate [ 2 ] + '-' + tmpDate [ 1 ] + '-' + tmpDate [ 0 ];
	}

	/**
	 * Build the GTFS tree
	 */

	buildTree ( ) {

		// Loop on route_master
		theGtfsTree.routesMaster.forEach (
			routeMaster => {

				// loop on route
				routeMaster.routes.forEach (
					route => {
						let fromName = '';
						let toName = '';

						// creating a map for platform names. the key of the map
						// is the platform id and the value is the platform name
						route.platformNames = new Map ( );

						// loop on platforms
						route.platforms.forEach (
							( platform, index ) => {

								// only platforms not marked as disused are added
								if ( ! theExcludeList.isGtfsDisusedPlatform ( platform.id ) ) {

									// platforms id are translated if needed
									let translatedPlatformId = theExcludeList.translateGtfsRefPlatform ( platform.id );

									// a csv string with valid platforms is created
									route.platformsString += translatedPlatformId + ';';
									if ( 0 === index ) {

										// Saving the first platforms name and id
										route.from = translatedPlatformId;
										fromName = platform.name;
									}

									// Saving the last platforms name and id
									route.to = translatedPlatformId;
									toName = platform.name;

									// adding the platform name to the map
									route.platformNames.set ( translatedPlatformId, platform.name );
								}
							}
						);

						// giving a name to the GTFS route
						route.name =
							[ 'Tram', 'Subway', 'Train', 'Bus', 'Ferry,' ] [ routeMaster.type ] +
								' ' + routeMaster.ref +
								' - from ' + fromName +
								' ( ' + route.from +
								' ) to ' + toName +
								' ( ' + route.to +
								' ) - ' + route.shapePk +
								' - valid from ' + this.#convertDate ( route.startDate ) +
								' - valid to ' + this.#convertDate ( route.endDate );

						// Adding a flag to the route. When true an osm route corresponding to the GTFS is found
						route.osmRoute = false;

						// Route is sealed. No more properties possible.
						Object.seal ( route );
					}
				);
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

export default GtfsTreeBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */