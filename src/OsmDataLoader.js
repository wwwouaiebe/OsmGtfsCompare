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

import theDocConfig from './DocConfig.js';
import theExcludeList from './ExcludeList.js';
import theOperator from './Operator.js';
import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * This class call the overpass-api to obtains the data and load the data in the OsmData object
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmDataLoader {

	/**
	 * A js map for the osm route_masters relations
	 * @type {Map}
	 */

	routeMasters = [];

	/**
	 * A js map for the osm route relations
	 * @type {Map}
	 */

	routes = new Map ( );

	/**
	 * A js map for the osm ways
	 * @type {Map}
	 */

	ways = new Map ( );

	/**
	 * A js map for the osm nodes
	 * @type {Map}
	 */

	nodes = new Map ( );

	/**
	 * Coming soon
	 * @type {Array}
	 */

	#platformsWithMoreThanOneRef = [];

	/**
	 * Coming soon
	 * @type {Array}
	 */

	#platformsWithoutNetwork = [];

	/**
	 * Coming soon
	 * @type {Array}
	 */

	#platformsWithoutOperator = [];

	/**
	 * Coming soon
	 */

	#clear ( ) {
		this.routeMasters.splice ( 0 );
		this.nodes.clear ( );
		this.ways.clear ( );
		this.routes.clear ( );
		this.#platformsWithMoreThanOneRef.splice ( 0 );
		this.#platformsWithoutNetwork.splice ( 0 );
		this.#platformsWithoutOperator.splice ( 0 );
	}

	/**
	 * Coming soon
	 */

	#sortRoutesMaster ( ) {
		this.routeMasters.sort (
			( first, second ) => {

				// split the name into the numeric part and the alphanumeric part:
				// numeric part
				let firstPrefix = String ( Number.parseInt ( first.tags.ref ) );
				let secondPrefix = String ( Number.parseInt ( second.tags.ref ) );

				// alpha numeric part
				let firstPostfix = ( first.tags.ref ?? '' ).replace ( firstPrefix, '' );
				let secondPostfix = ( second.tags.ref ?? '' ).replace ( secondPrefix, '' );

				// complete the numeric part with spaces on the left and compare
				let result =
						( firstPrefix.padStart ( 5, ' ' ) + firstPostfix )
							.localeCompare ( secondPrefix.padStart ( 5, ' ' ) + secondPostfix );

				return result;
			}
		);
	}

	/**
	* load the data in the OsmData object
	* @param {Array} elements An array with the elements part of the overpass-api response
	 */

	#loadOsmData ( elements ) {
		elements.forEach (
			element => {
				switch ( element.type ) {
				case 'relation' :
					switch ( element.tags.type ) {
					case 'route_master' :
					case 'proposed:route_master' :
					case 'disused:route_master' :
						this.routeMasters.push ( element );
						break;
					case 'route' :
					case 'proposed:route' :
					case 'disused:route' :
						element.routeMasters = [];
						this.routes.set ( element.id, element );
						break;
					default :
						break;
					}
					break;
				case 'way' :
					this.ways.set ( element.id, element );
					break;
				case 'node' :
					this.nodes.set ( element.id, element );
					break;
				default :
					break;
				}
			}
		);
		this.#sortRoutesMaster ( );
	}

	/**
	 * Coming soon
	 * @param {Object} osmObject Coming soon
	 */

	#controlPlatform ( osmObject ) {
		if (
			'bus_stop' === osmObject?.tags?.highway
			||
			'tram_stop' === osmObject?.tags?.railway
		) {
			let osmRef = osmObject.tags [ 'ref:' + theDocConfig.network ];
			if ( osmRef && 1 < osmRef.split ( ';' ).length ) {
				theExcludeList.excludePlatform ( osmRef );
				this.#platformsWithMoreThanOneRef.push ( osmObject );
			}
			if (
				! osmObject.tags.network
				||
				! osmObject.tags.network.includes ( theDocConfig.network )
			) {
				this.#platformsWithoutNetwork.push ( osmObject );
			}
			if (
				! osmObject.tags.operator
				||
				! osmObject.tags.operator.includes ( theOperator.osmOperator )
			) {
				this.#platformsWithoutOperator.push ( osmObject );
			}
		}
	}

	/**
	 * Coming soon
	 */

	#excludePlatforms ( ) {
		this.#platformsWithMoreThanOneRef = [];
		this.nodes.forEach (
			node => {
				this.#controlPlatform ( node );
			}
		);

		theReport.add ( 'h1', 'Platforms with more than 1 ref:' + theDocConfig.network );
		if ( 0 === this.#platformsWithMoreThanOneRef.length ) {
			theReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithMoreThanOneRef.forEach (
				osmObject => {
					theReport.add ( 'p', osmObject.tags.name + osmObject.tags[ 'ref:' + theDocConfig.network ], osmObject );
				}
			);
		}

		theReport.add ( 'h1', 'Platforms where the network tag dont include ' + theDocConfig.network );
		if ( 0 === this.#platformsWithoutNetwork.length ) {
			theReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithoutNetwork.forEach (
				osmObject => {
					theReport.add ( 'p', osmObject.tags.name + '- network : ' + ( osmObject.tags.network ?? '' ), osmObject );
				}
			);

		}

		theReport.add ( 'h1', 'Platforms where the operator tag dont include ' + theOperator.osmOperator );
		if ( 0 === this.#platformsWithoutOperator.length ) {
			theReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithoutOperator.forEach (
				osmObject => {
					theReport.add ( 'p', osmObject.tags.name + '- operator : ' + ( osmObject.tags.operator ?? '' ), osmObject );
				}
			);
		}
	}

	/**
	 * Add the route_masters id to the routeMasters array of the routes
	 */

	#addRouteMastersToRoutes ( ) {
		this.routeMasters.forEach (
			routeMaster => {
				routeMaster.members.forEach (
					member => {
						let route = this.routes.get ( member.ref );
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
	 */

	async fetchData ( ) {

		this.#clear ( );

		// uri creation
		let uri = '';
		uri =
			'https://lz4.overpass-api.de/api/interpreter?data=[out:json][timeout:40];' +
			'rel["network"~"' + theDocConfig.network + '"]' +
			'["' + ( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route"="' + theDocConfig.vehicle + '"]' +
			'["type"="' + ( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route"]' +
			( '' === theDocConfig.ref ? '' : '["ref"="' + theDocConfig.ref + '"]' ) +
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
					this.#excludePlatforms ( );
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

/**
 * The one and only one object OsmDataLoader
 */

const theOsmDataLoader = new OsmDataLoader ( );

export default theOsmDataLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */