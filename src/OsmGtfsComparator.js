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
		switch ( possibleGtfsRoutes.length ) {
		case 0 :
			console.log ( 'No gtfs route found' );
			break;
		case 1 :
			console.log ( 'A gtfs route with similar from and to stop found' );
			console.log ( possibleGtfsRoutes [ 0 ].name );
			break;
		default :
			console.log ( 'Multiple gtfs routes with similar from and to stop found' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					console.log ( possibleGtfsRoute.name );
				}
			);
			break;
		}
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
		switch ( possibleGtfsRoutes.length ) {
		case 0 :
			this.#compareFromToLow ( osmRoute );
			break;
		case 1 :
			console.log ( 'A gtfs route with from and to stop found' );
			console.log ( possibleGtfsRoutes [ 0 ].name );
			break;
		default :
			console.log ( 'Multiple gtfs routes with from and to stop found' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					console.log ( possibleGtfsRoute.name );
				}
			);
			break;
		}
	}

	/**
	 * Coming soon
	 * @param {Object} osmRoute Coming soon
	 */

	#comparePlatformsHight ( osmRoute ) {

		let possibleGtfsRoutes = [];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.platforms === osmRoute.platforms ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		switch ( possibleGtfsRoutes.length ) {
		case 0 :
			console.log ( 'No Gtfs route with all stop found' );
			this.#compareFromToHight ( osmRoute );
			break;
		case 1 :
			console.log ( 'A gtfs route with all stop found' );
			console.log ( possibleGtfsRoutes [ 0 ].name );
			break;
		default :
			console.log ( 'Multiple gtfs routes with all stop found' );
			possibleGtfsRoutes.forEach (
				possibleGtfsRoute => {
					console.log ( possibleGtfsRoute.name );
				}
			);
			break;
		}
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
				this.#comparePlatformsHight ( osmRoute );
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