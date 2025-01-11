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

import OsmTreeRoute from './OsmTreeRoute.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmTreeRouteMaster {

	/**
	 * Coming soon
	 * @type {String}
	 */

	#ref = '';

	/**
	 * Coming soon
	 * @type {String}
	 */

	#name = '';

	/**
	 * Coming soon
	 * @type {String}
	 */

	#id = '';

	/**
	 * Coming soon
	 * @type {String}
	 */

	#description = '';

	/**
	 * Coming soon
	 * @type {Array}
	 */

	#routes = [];

	/**
	 * Coming soon
	 * @type {String}
	 */

	get ref ( ) { return this.#ref; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get name ( ) { return this.#name; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get id ( ) { return this.#id; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get type ( ) { return 'relation'; }

	/**
	 * Coming soon
	 * @type {String}
	 */

	get description ( ) { return this.#description; }

	/**
	 * Coming soon
	 * @type {Array}
	 */

	get routes ( ) { return this.#routes; }

	/**
	 * The constructor
	 * @param {Object} osmRouteMaster
	 * @param {Object} osmDataLoader
	 */

	constructor ( osmRouteMaster, osmDataLoader ) {

		this.#ref = osmRouteMaster.tags.ref;

		this.#name = osmRouteMaster.tags.name;

		this.#id = osmRouteMaster.id;

		this.#description = osmRouteMaster.tags.description;

		osmRouteMaster.members.forEach (
			osmRouteMasterMember => {
				let osmRoute = osmDataLoader.routes.get ( osmRouteMasterMember.ref );
				let osmTreeRoute = new OsmTreeRoute ( osmRoute, osmDataLoader );
				this.#routes.push ( osmTreeRoute );
			}
		);

		Object.seal ( this );
	}
}

export default OsmTreeRouteMaster;

/* --- End of file --------------------------------------------------------------------------------------------------------- */