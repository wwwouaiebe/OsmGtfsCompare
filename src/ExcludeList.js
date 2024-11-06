class ExcludeList {

	#excludeListOsm = new Map;

	#excludeListGtfs = new Map;

	#buildExcludeList ( jsonResponse ) {
		this.#excludeListOsm.clear ( );
		if ( ! jsonResponse ) {
			return;
		}
		jsonResponse.osm.forEach (
			excludeItem => {
				this.#excludeListOsm.set ( excludeItem.id, excludeItem );
			}
		);
		jsonResponse.gtfs.forEach (
			excludeItem => {
				this.#excludeListGtfs.set ( excludeItem.ref, excludeItem );
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
					this.#buildExcludeList ( jsonResponse );
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

	getOsmData ( osmId ) {
		return this.#excludeListOsm.get ( osmId );
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