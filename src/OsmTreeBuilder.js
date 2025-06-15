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
Doc reviewed 20250110
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import { theOsmTree } from './DataTree.js';
import OsmTreeRouteMaster from './OsmTreeRouteMaster.js';
import theOsmDataLoader from './OsmDataLoader.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * This class build a tree with osm route_master and routes from the osm data.
 * See also OsmTreeRoute and OsmTreeRouteMaster classes
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmTreeBuilder {

	/**
	 * Build the tree
	 */

	buildTree ( ) {

		theOsmTree.clear ( );
		theOsmDataLoader.routeMasters.forEach (
			osmRouteMaster => {
				let osmTreeRouteMaster = new OsmTreeRouteMaster ( osmRouteMaster );
				osmTreeRouteMaster.routes.sort (
					( first, second ) => first.name.localeCompare ( second.name )
				);
				theOsmTree.routesMaster.push ( osmTreeRouteMaster );
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

export default OsmTreeBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */