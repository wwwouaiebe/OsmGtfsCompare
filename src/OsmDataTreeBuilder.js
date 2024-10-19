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

import theOsmData from './OsmData.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmDataTreeBuilder {

	/**
	 * Coming soon
	 * @type {Object}
	 */

	#osmTree = {
		routesMaster : []
	};

	/**
	 * Coming soon
	 * @type {Object}
	 */

	get osmTree ( ) { return this.#osmTree; };

	/**
	 * Coming soon
	 */

	buildTree ( ) {
		this.#osmTree = {
			routesMaster : []
		};

		theOsmData.routeMasters.forEach (
			osmRouteMaster => {
				let osmTreeRouteMaster = {
					ref : osmRouteMaster.tags.ref,
					name : osmRouteMaster.tags.name,
					routes : []
				};
 				osmRouteMaster.members.forEach (
					osmRouteMasterMember => {
						let osmRoute = theOsmData.routes.get ( osmRouteMasterMember.ref );
						let osmTreeRoute = {
							name : osmRoute.tags.name,
							id : osmRoute.id,
							platforms : '',
							from : '',
							to : '',
							platformNames : new Map ( )
						};
						osmRoute.members.forEach (
							( osmRouteMember, index ) => {
								if ( 'platform' === osmRouteMember.role ) {
									let osmPlatform =
                                        theOsmData.nodes.get ( osmRouteMember.ref )
                                        ||
                                        theOsmData.ways.get ( osmRouteMember.ref );
									osmTreeRoute.platforms +=
                                        ( osmPlatform.tags[ 'ref:TECL' ] || '????????' ) + ';';
									if ( 0 === index ) {
										osmTreeRoute.from =
											osmPlatform.tags[ 'ref:TECL' ]
											|| '????????';
									}
									osmTreeRoute.to =
										osmPlatform.tags[ 'ref:TECL' ]
										|| '????????';
									osmTreeRoute.platformNames.set (
										osmPlatform.tags[ 'ref:TECL' ] || '????????',
										osmPlatform.tags.name || ''
									);
								}
							}
						);
						osmTreeRouteMaster.routes.push ( osmTreeRoute );
					}
				);
				this.#osmTree.routesMaster.push ( osmTreeRouteMaster );
			}
		);
		this.#osmTree.routesMaster.sort (
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
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

/**
 * Coming soon
 * @type {Object}
 */

const theOsmDataTreeBuilder = new OsmDataTreeBuilder ( );

export default theOsmDataTreeBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */