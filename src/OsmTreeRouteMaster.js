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
Doc reviewed 20250126
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import OsmTreeRoute from './OsmTreeRoute.js';
import theOsmDataLoader from './OsmDataLoader.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * An object with route_master data needed for the comparison
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmTreeRouteMaster {

	/**
	 * The ref of the route_master
	 * @type {String}
	 */

	#ref = '';

	/**
	 * The name of the route_master
	 * @type {String}
	 */

	#name = '';

	/**
	 * The osm id of the route_master
	 * @type {String}
	 */

	#id = '';

	/**
	 * The description of the route_master
	 * @type {String}
	 */

	#description = '';

	/**
	 * The OsmTreeRoutes linked to the route_master
	 * @type {Array}
	 */

	#routes = [];

	/**
	 * The ref of the route_master
	 * @type {String}
	 */

	get ref ( ) { return this.#ref; }

	/**
	 * The name of the route_master
	 * @type {String}
	 */

	get name ( ) { return this.#name; }

	/**
	 * The osm id of the route_master
	 * @type {String}
	 */

	get id ( ) { return this.#id; }

	/**
	 * The osm type of the route_master
	 * @type {String}
	 */

	get type ( ) { return 'relation'; }

	/**
	 * The description of the route_master
	 * @type {String}
	 */

	get description ( ) { return this.#description; }

	/**
	 * The OsmTreeRoutes linked to the route_master
	 * @type {Array}
	 */

	get routes ( ) { return this.#routes; }

	/**
	 * The constructor
	 * @param {Object} osmRouteMaster
	 */

	constructor ( osmRouteMaster ) {

		this.#ref = osmRouteMaster.tags.ref;

		this.#name = osmRouteMaster.tags.name;

		this.#id = osmRouteMaster.id;

		this.#description = osmRouteMaster.tags.description;

		osmRouteMaster.members.forEach (
			osmRouteMasterMember => {
				let osmRoute = theOsmDataLoader.routes.get ( osmRouteMasterMember.ref );
				if ( osmRoute ) {
					let osmTreeRoute = new OsmTreeRoute ( osmRoute );
					this.#routes.push ( osmTreeRoute );
				}
			}
		);

		Object.seal ( this );
	}
}

export default OsmTreeRouteMaster;

/* --- End of file --------------------------------------------------------------------------------------------------------- */