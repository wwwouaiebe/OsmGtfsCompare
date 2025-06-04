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
Doc reviewed 20250124
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theRelationsReport from './RelationsReport.js';
import theDocConfig from './DocConfig.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * This class search all bus/tram/metro relations without route_master and add the errors to the report
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class RoutesWithoutRouteMasterValidator {

	/**
	 * Add the errors to the report
	 * @param {Array} elements An erray with routes without route_master
	 */

	#reportMissingRouteMaster ( elements ) {

		theRelationsReport.add ( 'h1', 'Routes without route_master' );

		if ( 0 === elements.length ) {
			theRelationsReport.add ( 'p', 'Nothing found' );
		}
		else {
			elements.forEach (
				element => {
					theRelationsReport.add (
						'p',
						'Error M001: route wihout route_master ' + theRelationsReport.getOsmLink ( element ),
						element
					);
				}
			);
		}
	}

	/**
	* fetch the data from overpass-api
	 */

	 async fetchData ( ) {
		const uriNetwork = '["network"="' + theDocConfig.network + '"]';
		const uriType = '["type"="' + ( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route"]';
		const uriRoute =
			'["' + ( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route"="' + theDocConfig.vehicle + '"]';
		const uriRouteMaster =
			'["' + ( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) +
			'route_master"="' + theDocConfig.vehicle + '"]';

		// Creation of the uri

		/*
		https://lz4.overpass-api.de/api/interpreter?data=[out:json][timeout:40];rel
		["network"="TECX"]
		["type"="route"]
		["route"="bus"]
		->.all;rel
		["route_master"="bus"]
		(br.all);rel
		["route"="bus"]
		(r)->.b;(.all; - .b; );out;
		*/

		const uri =
			'https://lz4.overpass-api.de/api/interpreter?data=[out:json][timeout:40];rel' +
			uriNetwork +
			uriType +
			uriRoute +
			'->.all;rel' +
			uriRouteMaster +
			'(br.all);rel' +
			uriRoute +
			'(r)->.b;(.all; - .b; );out;';

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
					this.#reportMissingRouteMaster ( jsonResponse.elements );
				}
			)
			.catch (
				err => {
					console.error ( err );
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

export default RoutesWithoutRouteMasterValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */