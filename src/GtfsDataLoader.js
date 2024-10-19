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
	 * @param {Object} jsonResponse Coming soon
	 */

	#buildGtfsTree ( jsonResponse ) {
		jsonResponse.routesMaster.forEach (
			gtfsRouteMaster => {
				let gtfsTreeRouteMaster = {
					ref : gtfsRouteMaster.routeMasterRef,
					routes : []
				};
				gtfsRouteMaster.routes.forEach (
					gtfsRoute => {
						let gtfsTreeRoute = {
							name : '',
							platforms : '',
							from : '',
							to : '',
							platformNames : new Map ( )
						};
						let gtfsFromName = '';
						let gtfsToName = '';
						gtfsRoute.platforms.forEach (
							( gtfsPlatform, index ) => {
								gtfsTreeRoute.platforms += gtfsPlatform.id + ';';
								if ( 0 === index ) {
									gtfsTreeRoute.from = gtfsPlatform.id;
									gtfsFromName = gtfsPlatform.name;
								}
								gtfsTreeRoute.to = gtfsPlatform.id;
								gtfsToName = gtfsPlatform.name;
								gtfsTreeRoute.platformNames.set ( gtfsPlatform.id, gtfsPlatform.name );
							}
						);
						gtfsTreeRoute.name =
						[ 'Tram', 'Subway', 'Train', 'Bus', 'Ferry,' ] [ gtfsRouteMaster.routeMasterType ] +
							' ' + gtfsRouteMaster.routeMasterRef +
							' - from ' + gtfsFromName +
							' ( ' + gtfsTreeRoute.from +
							' ) to ' + gtfsToName +
							' ( ' + gtfsTreeRoute.to +
							' ) - ' + gtfsRoute.shapePk;
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
	 * @param {string} fileName Coming soon
	 */

	async #fetchData ( fileName ) {
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
	 * @param {String} network Coming soon
	 */

	async loadData ( network ) {
		let fileName = '';
		switch ( network ) {
		case 'TECB' :
			fileName = '../json/gtfs-B.json';
			break;
		case 'TECC' :
			fileName = '../json/gtfs-C.json';
			break;
		case 'TECH' :
			fileName = '../json/gtfs-H.json';
			break;
		case 'TECL' :
			fileName = '../json/gtfs-L.json';
			break;
		case 'TECN' :
			fileName = '../json/gtfs-N.json';
			break;
		case 'TECX' :
			fileName = '../json/gtfs-N.json';
			break;
		case 'STIB' :
			fileName = '../json/gtfs-STIB-MIVB.json';
		default :
			break;
		}

		await this.#fetchData ( fileName );
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