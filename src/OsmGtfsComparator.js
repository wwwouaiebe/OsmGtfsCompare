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

class OsmGtfsComparator {

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#gtfsRouteMaster;

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#osmRouteMaster;

	/**
	 * Coming soon
	 * @type {Array}
	 */

	#testsPassed = [];

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#compareFromToLow ( osmRoute ) {
		let possibleGtfsRoutes = [ ];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if (
					gtfsRoute.from.slice ( 0, -1 ) === osmRoute.from.slice ( 0, -1 )
                    &&
                    gtfsRoute.to.slice ( 0, -1 ) === osmRoute.to.slice ( 0, -1 )
				) {
					possibleGtfsRoutes.push ( gtfsRoute );
 				}
			}
		);
		this.#testsPassed.push (
			'compareFromToLow ' +
             ( 0 === possibleGtfsRoutes.length ? 'failed' : 'passed' )
		);
		return possibleGtfsRoutes;
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#compareFromToHight ( osmRoute ) {
		let possibleGtfsRoutes = [ ];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.from === osmRoute.from && gtfsRoute.to === osmRoute.to ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		this.#testsPassed.push (
			'compareFromToHight ' +
             ( 0 === possibleGtfsRoutes.length ? 'failed' : 'passed' )
		);
		return possibleGtfsRoutes;
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#compareFromTo ( osmRoute ) {
		let possibleGtfsRoutes = this.#compareFromToHight ( osmRoute );
		if ( 0 === possibleGtfsRoutes.length ) {
			possibleGtfsRoutes = this.#compareFromToLow ( osmRoute );
		}
		else {
			this.#comparePlatforms ( osmRoute, possibleGtfsRoutes );
		}
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 * @param {Array} gtfsRoutes Coming soon
	 */

	#comparePlatformsHight ( osmRoute, gtfsRoutes ) {
		let possibleGtfsRoutes = [];
		gtfsRoutes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.platforms === osmRoute.platforms ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		this.#testsPassed.push (
			'comparePlatformsHight ' +
             ( 0 === possibleGtfsRoutes.length ? 'failed' : 'passed' )
		);

		return possibleGtfsRoutes;
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 * @param {Array} gtfsRoutes Coming soon
	 */

	#comparePlatformsLength ( osmRoute, gtfsRoutes ) {
		let possibleGtfsRoutes = [ ];
		let osmRouteSize = osmRoute.platforms.split ( ';' ).length;
		gtfsRoutes.forEach (
			gtfsRoute => {
				if ( osmRouteSize === gtfsRoute.platforms.split ( ';' ).length ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		this.#testsPassed.push (
			'comparePlatformsLength ' +
             ( 0 === possibleGtfsRoutes.length ? 'failed' : 'passed' )
		);
		if ( 0 === possibleGtfsRoutes.length ) {
			console.log ( osmRoute.platforms );
			gtfsRoutes.forEach (
				gtfsRoute => { console.log ( gtfsRoute.platforms ); }
			);
		}
		return possibleGtfsRoutes;
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 * @param {Array} gtfsRoutes Coming soon
	 */

	#comparePlatforms ( osmRoute, gtfsRoutes ) {
		let possibleGtfsRoutes = this.#comparePlatformsLength ( osmRoute, gtfsRoutes );
		if ( 0 !== possibleGtfsRoutes.length ) {
		    possibleGtfsRoutes = this.#comparePlatformsHight ( osmRoute, possibleGtfsRoutes );
		}
		this.#endCompare ( possibleGtfsRoutes );
	}

	/**
	 * Coming soon
	 * @param {Array} gtfsRoutes Coming soon
	 */

	#endCompare ( gtfsRoutes ) {
		gtfsRoutes.forEach (
			gtfsRoute => { console.log ( gtfsRoute.name ); }
		);
		this.#testsPassed.forEach (
			testPassed => { console.log ( testPassed ); }
		);

	}

	/**
	 * Coming soon
	 * @param {Object} osmRouteMaster Coming soon
	 * @param {Object} gtfsRouteMaster Coming soon
	 */

	compareRoutesMaster ( osmRouteMaster, gtfsRouteMaster ) {
		this.#gtfsRouteMaster = gtfsRouteMaster;
		this.#osmRouteMaster = osmRouteMaster;

		this.#osmRouteMaster.routes.forEach (
			osmRoute => {
				console.log ( osmRoute.name );
				this.#testsPassed = [];
				this.#compareFromTo ( osmRoute );
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

export default OsmGtfsComparator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */