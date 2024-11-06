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

import theOsmData from './OsmData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * This class call the overpass-api to obtains the data and load the data in the OsmData object
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmDataLoader {

	/**
	* load the data in the OsmData object
	* @param {Array} elements An array with the elements part of the overpass-api response
	 */

	#loadOsmData ( elements ) {

		theOsmData.clear ( );

		elements.forEach (
			element => {
				switch ( element.type ) {
				case 'relation' :
					switch ( element.tags.type ) {
					case 'route_master' :
					case 'proposed:route_master' :
					case 'disused:route_master' :
						theOsmData.routeMasters.set ( element.id, element );
						break;
					case 'route' :
					case 'proposed:route' :
					case 'disused:route' :
						element.routeMasters = [];
						theOsmData.routes.set ( element.id, element );
						break;
					default :
						break;
					}
					break;
				case 'way' :
					theOsmData.ways.set ( element.id, element );
					break;
				case 'node' :
					theOsmData.nodes.set ( element.id, element );
					break;
				default :
					break;
				}
			}
		);
	}

	/**
	 * Add the route_masters id to the routeMasters array of the routes
	 */

	#addRouteMastersToRoutes ( ) {
		theOsmData.routeMasters.forEach (
			routeMaster => {
				routeMaster.members.forEach (
					member => {
						let route = theOsmData.routes.get ( member.ref );
						if ( route ) {
							route.routeMasters.push ( routeMaster.id );
						}
					}
				);
			}
		);
	}

	/**
	 * fetch data from the overpass-api
	 * @param {Object} config
	 */

	async fetchData ( config ) {

		// uri creation
		let uri = '';
		uri =
			'https://lz4.overpass-api.de/api/interpreter?data=[out:json][timeout:40];' +
			'rel["network"~"' + config.osmNetwork + '"]' +
			'[route=' + config.osmVehicle + ']' +
			'[type=route]' +
			( '' === config.osmRef ? '' : '[ref=' + config.osmRef + ']' ) +
			'->.rou;(.rou <<; - .rou;); >> ->.rm;.rm out;';

		// fetch overpass-api
		let success = false;
		await fetch ( uri )
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

					this.#loadOsmData ( jsonResponse.elements );
					this.#addRouteMastersToRoutes ( );

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
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default OsmDataLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */