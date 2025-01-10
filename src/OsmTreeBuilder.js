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

import { theOsmTree } from './DataTree.js';
import OsmTreeRouteMaster from './OsmTreeRouteMaster.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmTreeBuilder {

	/**
	 * Coming soon
	 */

	#sortRoutesMaster ( ) {
		theOsmTree.routesMaster.sort (
			( first, second ) => {

				// split the name into the numeric part and the alphanumeric part:
				// numeric part
				let firstPrefix = String ( Number.parseInt ( first.ref ) );
				let secondPrefix = String ( Number.parseInt ( second.ref ) );

				// alpha numeric part
				let firstPostfix = ( first.ref ?? '' ).replace ( firstPrefix, '' );
				let secondPostfix = ( second.ref ?? '' ).replace ( secondPrefix, '' );

				// complete the numeric part with spaces on the left and compare
				let result =
					( firstPrefix.padStart ( 5, ' ' ) + firstPostfix )
						.localeCompare ( secondPrefix.padStart ( 5, ' ' ) + secondPostfix );

				return result;
			}
		);
	}

	/**
	 * Coming soon
	 * @param {OsmDataLoader} osmDataLoader Coming soon
	 */

	buildTree ( osmDataLoader ) {

		theOsmTree.clear ( );

		osmDataLoader.routeMasters.forEach (
			osmRouteMaster => {
				let osmTreeRouteMaster = new OsmTreeRouteMaster ( osmRouteMaster, osmDataLoader );
				osmTreeRouteMaster.routes.sort (
					( first, second ) => first.name.localeCompare ( second.name )
				);
				theOsmTree.routesMaster.push ( osmTreeRouteMaster );
			}
		);

		this.#sortRoutesMaster ( );
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default OsmTreeBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */