class ExcludeList {

	#excludedRelationsOsm = new Map;

	#translatedOsmRefPlatforms = new Map;

	#translatedGtfsRefPlatforms = new Map;

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
			translatedPlatform => {
				this.#translatedGtfsRefPlatforms.set ( translatedPlatform.from, translatedPlatform.to );
			}
		);
	}

	async loadData ( network ) {
		let fileName = '../json/exclude-' + network + '.json';
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

	translateOsmRefPlatform ( osmRef ) {
		return this.#translatedOsmRefPlatforms.get ( osmRef ) || osmRef;
	}

	translateGtfsRefPlatform ( gtfsRef ) {
		return this.#translatedGtfsRefPlatforms.get ( gtfsRef ) || gtfsRef;
	}

	getOsmData ( osmId ) {
		return this.#excludedRelationsOsm.get ( osmId );
	}

	getGtfsData ( gtfsRef ) {
		return this.#excludeListGtfs.get ( gtfsRef );
	};

	constructor ( ) {
		Object.freeze ( this );
	}
}

const theExcludeList = new ExcludeList;

export default theExcludeList;