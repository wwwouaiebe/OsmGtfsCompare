class ExcludeList {

	#excludedRelationsOsm = new Map;

	#translatedOsmRefPlatforms = new Map;

	#translatedGtfsRefPlatforms = new Map;

	#gtfsDisusedRefPlatforms = new Map;

	#excludeListGtfs = new Map;

	#buildLists ( jsonResponse ) {
		this.#excludedRelationsOsm.clear ( );
		if ( ! jsonResponse ) {
			return;
		}
		jsonResponse.osm.excludedRelations.forEach (
			excludedRelation => {
				this.#excludedRelationsOsm.set ( excludedRelation.id, excludedRelation );
			}
		);
		jsonResponse.osm.translatedRefPlatforms.forEach (
			translatedPlatform => {
				this.#translatedOsmRefPlatforms.set ( translatedPlatform.from, translatedPlatform.to );
			}
		);
		jsonResponse.gtfs.excludedRelations.forEach (
			excludeItem => {
				this.#excludeListGtfs.set ( excludeItem.ref, excludeItem );
			}
		);
		jsonResponse.gtfs.translatedRefPlatforms.forEach (
			translatedRefPlatform => {
				this.#translatedGtfsRefPlatforms.set ( translatedRefPlatform.from, translatedRefPlatform.to );
			}
		);
		jsonResponse.gtfs.disusedRefPlatforms.forEach (
			disusedRefPlatform => {
				this.#gtfsDisusedRefPlatforms.set ( disusedRefPlatform.ref, disusedRefPlatform );
			}
		);
	}

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

	isGtfsDisusedPlatform ( platformRef ) {
		return this.#gtfsDisusedRefPlatforms.get ( platformRef );
	}

	translateOsmRefPlatform ( osmRef ) {
		return this.#translatedOsmRefPlatforms.get ( osmRef ) || osmRef;
	}

	translateGtfsRefPlatform ( gtfsRef ) {
		return this.#translatedGtfsRefPlatforms.get ( gtfsRef ) || gtfsRef;
	}

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

	constructor ( ) {
		Object.freeze ( this );
	}
}

const theExcludeList = new ExcludeList ( );

export default theExcludeList;