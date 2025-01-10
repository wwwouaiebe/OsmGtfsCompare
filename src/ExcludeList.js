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

import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class ExcludeList {

	/**
	 * Coming soom
	 * @type {String}
	 */

	#network;

	/**
	 * Coming soom
	 * @type {Map}
	 */

	#excludedRelationsOsm = new Map;

	/**
	 * Coming soom
	 * @type {Map}
	 */

	#translatedOsmRefPlatforms = new Map;

	/**
	 * Coming soom
	 * @type {Map}
	 */

	#translatedGtfsRefPlatforms = new Map;

	/**
	 * Coming soom
	 * @type {Map}
	 */

	#gtfsDisusedRefPlatforms = new Map;

	/**
	 * Coming soom
	 * @type {Map}
	 */

	#excludeListGtfs = new Map;

	/**
	 * Coming soom
	 * @param {Object} jsonResponse Coming soon
	 */

	#buildLists ( jsonResponse ) {

		this.#network = document.getElementById ( 'osmNetworkSelect' ).value;

		if ( ! jsonResponse ) {
			return;
		}

		this.#excludedRelationsOsm.clear ( );
		jsonResponse.osm.excludedRelations.forEach (
			excludedRelation => {
				this.#excludedRelationsOsm.set ( excludedRelation.id, excludedRelation );
			}
		);

		this.#translatedOsmRefPlatforms.clear ( );
		jsonResponse.osm.translatedRefPlatforms.forEach (
			translatedPlatform => {
				this.#translatedOsmRefPlatforms.set ( translatedPlatform.from, translatedPlatform.to );
			}
		);

		this.#excludeListGtfs.clear ( );
		jsonResponse.gtfs.excludedRelations.forEach (
			excludeItem => {
				this.#excludeListGtfs.set ( excludeItem.ref, excludeItem );
			}
		);

		this.#translatedGtfsRefPlatforms.clear ( );
		jsonResponse.gtfs.translatedRefPlatforms.forEach (
			translatedRefPlatform => {
				this.#translatedGtfsRefPlatforms.set ( translatedRefPlatform.from, translatedRefPlatform.to );
			}
		);

		this.#gtfsDisusedRefPlatforms.clear ( );
		jsonResponse.gtfs.disusedRefPlatforms.forEach (
			disusedRefPlatform => {
				this.#gtfsDisusedRefPlatforms.set ( disusedRefPlatform.ref, disusedRefPlatform );
			}
		);
	}

	/**
	 * Coming soom
	 * @param {String} network Coming soon
	 */

	async loadData ( network ) {
		let fileName = '../excludeLists/exclude-' + network + '.json';
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
					this.#buildLists ( jsonResponse );
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
	 * Coming soom
	 * @param {String} platformRef Coming soon
	 */

	isGtfsDisusedPlatform ( platformRef ) {
		return this.#gtfsDisusedRefPlatforms.get ( platformRef );
	}

	/**
	 * Coming soom
	 * @param {string} osmRef Coming soon
	 */

	translateOsmRefPlatform ( osmRef ) {
		return this.#translatedOsmRefPlatforms.get ( osmRef ) || osmRef;
	}

	/**
	 * Coming soom
	 * @param {string} gtfsRef Coming soon
	 */

	translateGtfsRefPlatform ( gtfsRef ) {
		return this.#translatedGtfsRefPlatforms.get ( gtfsRef ) || gtfsRef;
	}

	/**
	 * Coming soom
	 * @param {String} osmId
	 */

	getOsmData ( osmId ) {
		return this.#excludedRelationsOsm.get ( osmId );
	}

	/**
     * Coming soon
     * @param {String} gtfsRef Coming soon
     * @returns {boolean} Coming soon
     */

	getExcludeReason ( gtfsRef ) {
		const excludeData = this.#excludeListGtfs.get ( gtfsRef );
		if ( excludeData?.reason ) {
			return 'This relation is excluded ( reason : ' + excludeData.reason + ' )';
		}
		return null;
	}

	/**
	 * Coming soom
	 * @param {Object} osmPlatform Coming soon
	 */

	excludePlatform ( osmPlatform ) {
		if (
			'bus_stop' === osmPlatform?.tags?.highway
			||
			'tram_stop' === osmPlatform?.tags?.railway
		) {
			let osmRef = osmPlatform.tags [ 'ref:' + this.#network ];

			if ( osmRef && 1 < osmRef.split ( ';' ).length ) {
				theReport.add (
					'p',
					'A platform with more than 1 ref:' + this.#network + 'is found: ' +
					osmRef + ' ' + osmPlatform.tags.name
				);

				this.#translatedOsmRefPlatforms.set ( osmRef, osmRef.split ( ';' ) [ 0 ] );
				this.#translatedGtfsRefPlatforms.set ( osmRef.split ( ';' ) [ 1 ], osmRef.split ( ';' ) [ 0 ] );

			}
		}
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

/**
	 * The one and only one object ExcludeList
	 * @type {ExcludeList}
	 */

const theExcludeList = new ExcludeList ( );

export default theExcludeList;

/* --- End of file --------------------------------------------------------------------------------------------------------- */