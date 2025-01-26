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

import { theGtfsTree } from './DataTree.js';
import theDocConfig from './DocConfig.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Loader for the GTFS data. The GTFS date are prepared from the GTFS files by the gtfs2mysql2json app
 * and saved in a light format in the json files that are in the json folder.
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class GtfsDataLoader {

	/**
	 * Add the validity date of the GTFS data in the header
	 * @param {String} startDate the validity date of the GTFS data
	 */

	#addStartDate ( startDate ) {
		document.getElementById ( 'GTFSValidity' ).textContent =
            'GTFS files valid from ' +
            new Date ( startDate )
            	.toLocaleDateString (
            		'en-BE',
            		{
            			weekday : 'long',
            			year : 'numeric',
            			month : 'long',
            			day : 'numeric'
            		}
            	);
	}

	/**
	 * Reading the data from the json file (Using fetch... import is always experimental...)
	 */

	async fetchData ( ) {
		let fileName = '../json/gtfs-' + theDocConfig.network + '.json';

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
					this.#addStartDate ( jsonResponse.startDate );
					theGtfsTree.routesMaster = jsonResponse.routesMaster;
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

export default GtfsDataLoader;