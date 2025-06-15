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
Doc reviewed 20250126
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theDocConfig from './DocConfig.js';
import theExcludeList from './ExcludeList.js';
import theOperator from './Operator.js';
import theOsmDataLoader from './OsmDataLoader.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * An object with route data needed for the comparison
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class osmTreeRoute {

	/**
	 * The name of the route
	 * @type {String}
	 */

	#name = '';

	/**
	 * the osm id of the route
	 * @type {Number}
	 */

	#id = 0;

	/**
	 * A csv string with the platforms ref
	 * @type {String}
	 */

	#platforms = '';

	/**
	 * The strarting platform name
	 * @type {String}
	 */

	#from = '';

	/**
	 * The ending platform name
	 * @type {String}
	 */

	#to = '';

	/**
	 * A map with the platforms name. The key is the platform ref and the value is the platform name
	 * @type {Map}
	 */

	#platformNames = new Map ( );

	/**
	 * The via of the route
	 * @type {String}
	 */

	#via = '';

	/**
	 * The name of the route
	 * @type {String}
	 */

	get name ( ) { return this.#name; }

	/**
	 * the osm id of the route
	 * @type {Number}
	 */

	get id ( ) { return this.#id; }

	/**
	 * The osm type of the route
	 * @type {String}
	 */

	get type ( ) { return 'relation'; }

	/**
	 * A csv string with the platforms ref
	 * @type {String}
	 */

	get platforms ( ) { return this.#platforms; }

	/**
	 * The strarting platform name
	 * @type {String}
	 */

	get from ( ) { return this.#from; }

	/**
	 * The ending platform name
	 * @type {String}
	 */

	get to ( ) { return this.#to; }

	/**
	 * A map with the platforms name. The key is the platform ref and the value is the platform name
	 * @type {String}
	 */

	get platformNames ( ) { return this.#platformNames; }

	/**
	 * The via of the route
	 * @type {String}
	 */

	get via ( ) { return this.#via; }

	/**
	 * get the ref of a platform to use for the comparison. Can be different of the ref encoded in osm!
	 * @param {Object} osmPlatform A osm platform for witch the ref is searched
	 */

	#getOsmPlatformRef ( osmPlatform ) {

		let platformRef =
			theExcludeList.translateOsmRefPlatform ( osmPlatform.tags [ 'ref:' + theDocConfig.network ] );

		if ( ! platformRef ) {

			// no platform found. Searching with other networks of the operator
			let refInOtherNetworkCounter = 0;
			let platformRefInOtherNetwork = null;
			theOperator.networksAsStringArray.forEach (
				network => {

					// a ref:inOtherNetwork is found. saving it
					if ( osmPlatform.tags [ 'ref:' + network ] ) {
						refInOtherNetworkCounter ++;
						platformRefInOtherNetwork = osmPlatform.tags [ 'ref:' + network ];
					}
				}
			);
			if ( 1 === refInOtherNetworkCounter ) {
				platformRef = platformRefInOtherNetwork;
			}
			else {
				platformRef = '????????';
			}
		}
		return platformRef;
	}

	/**
	 * The constructor
	 * @param {Object} osmRoute the osm route received from the Overpass API
	 */

	constructor ( osmRoute ) {

		this.#name = osmRoute.tags.name;

		this.#id = osmRoute.id;

		this.#via = osmRoute.tags?.via ?? '';

		let haveFrom = false;
		osmRoute.members.forEach (
			osmRouteMember => {
				if (
					-1
                    !==
                    [ 'platform', 'platform_entry_only', 'platform_exit_only' ].indexOf (
                    	osmRouteMember.role
                    )
				) {
					let osmPlatform =
						theOsmDataLoader.nodes.get ( osmRouteMember.ref )
                        ||
                        theOsmDataLoader.ways.get ( osmRouteMember.ref );

					let platformRef = this.#getOsmPlatformRef ( osmPlatform );
					this.#platforms += platformRef + ';';
					if ( ! haveFrom ) {
						this.#from = platformRef;
						haveFrom = true;
					}
					this.#to = platformRef;
					this.#platformNames.set (
						platformRef,
						osmPlatform.tags.name || ''
					);
				}
			}
		);
		Object.seal ( this );
	}
}

export default osmTreeRoute;

/* --- End of file --------------------------------------------------------------------------------------------------------- */