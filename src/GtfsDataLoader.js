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

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#gtfsTree4Gpx;

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
		this.#gtfsTree4Gpx = jsonResponse;

		this.#gtfsTree = {
			routesMaster : []
		};

		jsonResponse.routesMaster.forEach (
			gtfsRouteMaster => {
				let gtfsTreeRouteMaster = {
					ref : gtfsRouteMaster.routeMasterRef,
					routes : [],
					osmRouteMaster : false
				};
				gtfsRouteMaster.routes.forEach (
					gtfsRoute => {
						let gtfsTreeRoute = {
							name : '',
							platforms : '',
							from : '',
							to : '',
							validFrom : this.#convertDate ( gtfsRoute.startDate ),
							validTo : this.#convertDate ( gtfsRoute.endDate ),
							platformNames : new Map ( ),
							osmRoute : false,
							shapePk : gtfsRoute.shapePk
						};
						let gtfsFromName = '';
						let gtfsToName = '';
						gtfsRoute.platforms.forEach (
							( gtfsPlatform, index ) => {
								if ( ! theExcludeList.isGtfsDisusedPlatform ( gtfsPlatform.id ) ) {
									let gtfsTranslatedPlatformId = theExcludeList.translateGtfsRefPlatform ( gtfsPlatform.id );
									gtfsTreeRoute.platforms += gtfsTranslatedPlatformId + ';';
									if ( 0 === index ) {
										gtfsTreeRoute.from = gtfsTranslatedPlatformId;
										gtfsFromName = gtfsPlatform.name;
									}
									gtfsTreeRoute.to = gtfsTranslatedPlatformId;
									gtfsToName = gtfsPlatform.name;
									gtfsTreeRoute.platformNames.set ( gtfsTranslatedPlatformId, gtfsPlatform.name );
								}
							}
						);
						gtfsTreeRoute.name =
						[ 'Tram', 'Subway', 'Train', 'Bus', 'Ferry,' ] [ gtfsRouteMaster.routeMasterType ] +
							' ' + gtfsRouteMaster.routeMasterRef +
							' - from ' + gtfsFromName +
							' ( ' + gtfsTreeRoute.from +
							' ) to ' + gtfsToName +
							' ( ' + gtfsTreeRoute.to +
							' ) - ' + gtfsRoute.shapePk +
							' - valid from ' + gtfsTreeRoute.validFrom +
							' - valid to ' + gtfsTreeRoute.validTo;
						gtfsTreeRouteMaster.routes.push ( gtfsTreeRoute );
					}
				);
				this.#gtfsTree.routesMaster.push ( gtfsTreeRouteMaster );
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

	getRouteInfo ( shapePk ) {
		let iShapePk = Number.parseInt ( shapePk );
		let routeInfo = [];
		this.#gtfsTree4Gpx.routesMaster.forEach (
			routeMaster => {
				routeMaster.routes.forEach (
					route => {
						if ( route.shapePk === iShapePk ) {
							routeInfo.push (
								[ 'Tram', 'Subway', 'Train', 'Bus', 'Ferry,' ] [ routeMaster.routeMasterType ] +
								' ' + routeMaster.routeMasterRef
							);
							routeInfo.push ( route );
						}
					}
				);
			}
		);
		return routeInfo;
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