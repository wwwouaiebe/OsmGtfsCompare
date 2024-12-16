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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class GtfsDataLoader {

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#gtfsTree = {
		routesMaster : []
	};

	#convertDate ( sourceDate ) {
		let tmpDate =
			new Date ( sourceDate )
				.toLocaleDateString ( )
				.split ( '/' );

		return tmpDate [ 2 ] + '-' + tmpDate [ 1 ] + '-' + tmpDate [ 0 ];
	}

	/**
	 * Coming soon
	 * @param {Object} jsonResponse Coming soon
	 */

	#buildGtfsTree ( jsonResponse ) {

		document.getElementById ( 'GTFSValidity' ).textContent =
			'GTFS files valid from ' +
			new Date ( jsonResponse.startDate )
				.toLocaleDateString (
					'en-BE',
					{
						weekday : 'long',
						year : 'numeric',
						month : 'long',
						day : 'numeric'
					}
				);

		this.#gtfsTree = jsonResponse;

		this.#gtfsTree.routesMaster.forEach (
			routeMaster => {
				routeMaster.routes.forEach (
					route => {
						let fromName = '';
						let toName = '';
						route.platformNames = new Map ( );
						route.platforms.forEach (
							( platform, index ) => {
								if ( ! theExcludeList.isGtfsDisusedPlatform ( platform.id ) ) {
									let translatedPlatformId = theExcludeList.translateGtfsRefPlatform ( platform.id );
									route.platformsString += translatedPlatformId + ';';
									if ( 0 === index ) {
										route.from = translatedPlatformId;
										fromName = platform.name;
									}
									route.to = translatedPlatformId;
									toName = platform.name;
									route.platformNames.set ( translatedPlatformId, platform.name );
								}
							}
						);
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
					}
				);
			}
		);
	}

	/**
	 * Coming soon
	 * @type {Object}
	 */

	get gtfsTree ( ) { return this.#gtfsTree; }

	/**
	 * Coming soon
	 * @param {String} network Coming soon
	 */

	async loadData ( network ) {
		let fileName = '../json/gtfs-' + network + '.json';

		let success = false;
		await fetch ( fileName )
			.then (
				response => {
					if ( response.ok ) {
						return response.json ( );
					}
					console.error ( String ( response.status ) + ' ' + response.statusText );
				}
			)
			.then (
				jsonResponse => {
					this.#buildGtfsTree ( jsonResponse );
					success = true;
				}
			)
			.catch (
				err => {
					console.error ( err );
				}
			);
		return success;
	}

	/**
	 * Coming soon
	 * @param {String} shapePk Coming soon
	 */

	getRouteFromShapePk ( shapePk ) {
		let iShapePk = Number.parseInt ( shapePk );
		let returnRoute = null;
		this.#gtfsTree.routesMaster.forEach (
			routeMaster => {
				routeMaster.routes.forEach (
					route => {
						if ( route.shapePk === iShapePk ) {
							returnRoute = route;
						}
					}
				);
			}
		);
		return returnRoute;
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

}

/**
 * Coming soon
 * @type {Object}
 */

const theGtfsDataLoader = new GtfsDataLoader ( );

export default theGtfsDataLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */