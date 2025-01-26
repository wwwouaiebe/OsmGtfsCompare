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
Doc reviewed 20250124
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theOperator from './Operator.js';
import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A container with osm and gtfs objects that have to be excluded from the OSM GTFS comparison due to errors in the
 * osm or gtfs data
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class ExcludeList {

	/**
	 * A map with osm relations that have to be excluded or with notes that have to be displayed in the report
	 * Each value in the map is an object like this:
	 *	{
	 * 		id : the osm id of the route or route_master relation
	 * 		note : a note to be displayed in the report (mandatory when a note must be displayed)
	 * 		ref : the osm ref of the relation (not mandatory be usefull to identify the relation)
	 * 		reason : the reason of the exclusion (mandatory when a relation must be excluded)
	 *	}
	 * The keys of the map are the osm id
	 * @type {Map}
	 */

	#excludedRelationsOsm = new Map;

	/**
	 * A map with osm platforms for witch the ref:NETWORK need to be modified
	 * Each value in the map is an object like this:
	 *	{
	 *		"from" : the ref:NETWORK used in osm (mandatory)
	 *		"to" : the ref:NETWORK used for the OSM GTFS comparison (mandatory),
	 *		"reason" : the reason for witch the ref:NETWORK must be changed (not mandatory)
	 *	}
	 * The keys of the map are the from value of the object
	 * @type {Map}
	 */

	#translatedOsmRefPlatforms = new Map;

	/**
	 * A map with gtfs platforms for witch the ref:NETWORK need to be modified
	 * Each value in the map is an object like this:
	 *	{
	 *		"from" : the ref:NETWORK used in gtfs (mandatory)
	 *		"to" : the ref:NETWORK used for the OSM GTFS comparison (mandatory),
	 *		"reason" : the reason for witch the ref:NETWORK must be changed (not mandatory)
	 *	}
	 * The keys of the map are the from value of the object
	 * @type {Map}
	 */

	#translatedGtfsRefPlatforms = new Map;

	/**
	 * A map with GTFS platforms that are considered as disused on the OSM side
	 * Each value in the map is an object like this:
	 *	{
	 *		"ref" : the ref:NETWORK used in gtfs (mandatory)
	 *		"name" : the name of the platform (not mandatory),
	 *		"reason" : the reason for witch the platform is considered as disused (not mandatory)
	 *	}
	 * @type {Map}
	 */

	#gtfsDisusedRefPlatforms = new Map;

	/**
	 * A map with GTFS relations that have to be excluded
	 * Each value in the map is an object like this:
	 *	{
	 * 		ref : the ref of the relation (not mandatory)
	 * 		reason : the reason of the exclusion (mandatory)
	 *	}
	 * The keys of the map are the ref of the relations
	 * @type {Map}
	 */

	#excludedRelationsGtfs = new Map;

	/**
	 * Clean the existing data
	 */

	#clear ( ) {
		this.#excludedRelationsOsm.clear ( );
		this.#translatedOsmRefPlatforms.clear ( );
		this.#excludedRelationsGtfs.clear ( );
		this.#translatedGtfsRefPlatforms.clear ( );
		this.#gtfsDisusedRefPlatforms.clear ( );
	}

	/**
	 * Load the data in the dfferent maps.
	 * Reminder : data are coming from a json file where maps are unknown
	 */

	async loadData ( ) {

		this.#clear ( );

		// loading data from theOperator
		const excludeList = theOperator.excludeList;

		// no data... return
		if ( ! excludeList ) {
			return;
		}

		// loading OSM excluded relations
		excludeList.osm.excludedRelations.forEach (
			excludedRelation => {
				this.#excludedRelationsOsm.set ( excludedRelation.id, excludedRelation );
			}
		);

		// loading OSM translated platforms
		excludeList.osm.translatedRefPlatforms.forEach (
			translatedPlatform => {
				this.#translatedOsmRefPlatforms.set ( translatedPlatform.from, translatedPlatform.to );
			}
		);

		// loading GTFS excluded relations
		excludeList.gtfs.excludedRelations.forEach (
			excludeItem => {
				this.#excludedRelationsGtfs.set ( excludeItem.ref, excludeItem );
			}
		);

		// loading GTFS translated platforms
		excludeList.gtfs.translatedRefPlatforms.forEach (
			translatedRefPlatform => {
				this.#translatedGtfsRefPlatforms.set ( translatedRefPlatform.from, translatedRefPlatform.to );
			}
		);

		// loading GTFS disused platforms
		excludeList.gtfs.disusedRefPlatforms.forEach (
			disusedRefPlatform => {
				this.#gtfsDisusedRefPlatforms.set ( disusedRefPlatform.ref, disusedRefPlatform );
			}
		);
	}

	/**
	 * Test if a GTFS patform is disused
	 * @param {String} platformRef the ref of the platform to test
	 * @returns {?Object} an object with the ref and reason when disused or null otherwise
	 */

	isGtfsDisusedPlatform ( platformRef ) {
		return this.#gtfsDisusedRefPlatforms.get ( platformRef );
	}

	/**
	 * Get the new ref:NETWORK of an OSM platform when translated
	 * @param {String} osmRef the ref:NETWORK to translate
	 * @returns {String} the translated ref:NETWORK or the original ref:NETWORK when no translation found
	 */

	translateOsmRefPlatform ( osmRef ) {
		return this.#translatedOsmRefPlatforms.get ( osmRef ) || osmRef;
	}

	/**
	 * Get the new ref of a GTFS platform when translated
	 * @param {String} gtfsRef the ref to translate
	 * @returns {String} the translated ref or the original ref when no translation found
	 */

	translateGtfsRefPlatform ( gtfsRef ) {
		return this.#translatedGtfsRefPlatforms.get ( gtfsRef ) || gtfsRef;
	}

	/**
	 * Verify if a route or a route_master is excluded from the validation and comparison
	 * @param {Number} osmId The osm id of the route or route_master
	 * @param {boolean} addToReport A flag indicating the the exclusion must be added to the report
	 * @returns {boolean} true when the route or route_master is excluded
	 */

	isOsmExcluded ( osmId, addToReport ) {
		const excludeData = this.#excludedRelationsOsm.get ( osmId );
		if ( excludeData?.reason ) {
			 if ( addToReport ) {
				theReport.add ( 'p', 'This relation is excluded from the comparison  ( reason : ' + excludeData.reason + ' )' );
			 }
			return true;
		}

		if ( excludeData?.note && addToReport ) {
			theReport.add ( 'p', excludeData.note );
		}
		return false;

	}

	/**
     * Get the exclusion data of a GTFS route or route_master
     * @param {String} gtfsRef the ref of the GTFS route
     * @returns {?String} the exclusion reason or null if the route is not excluded
     */

	getExcludedGTFSRelationReason ( gtfsRef ) {
		const excludeData = this.#excludedRelationsGtfs.get ( gtfsRef );
		if ( excludeData?.reason ) {
			return 'This relation is excluded from the comparison ( reason : ' + excludeData.reason + ' )';
		}
		return null;
	}

	/**
	 * Translate an OSM platform with multiple ref:NETWORK
	 * @param {String} osmRef the OSM ref:NETWORK with multiple ref:NETWORK
	 */

	translateOsmPlatform ( osmRef ) {
		this.#translatedOsmRefPlatforms.set ( osmRef, osmRef.split ( ';' ) [ 0 ] );
		this.#translatedGtfsRefPlatforms.set ( osmRef.split ( ';' ) [ 1 ], osmRef.split ( ';' ) [ 0 ] );
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