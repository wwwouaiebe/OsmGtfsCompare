import { theGtfsTree } from './DataTree.js';

class GtfsDataLoader {

	#addStartDate ( startDate ) {
		document.getElementById ( 'GTFSValidity' ).textContent =
            'GTFS files valid from ' +
            new Date ( startDate )
            	.toLocaleDateString (
            		'en-BE',
            		{
            			weekday : 'long',
            			year : 'numeric',
            			month : 'long',
            			day : 'numeric'
            		}
            	);
	}

	/**
	 * Coming soon
	 * @param {String} network Coming soon
	 */

	async fetchData ( network ) {
		let fileName = '../json/gtfs-' + network + '.json';

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
					this.#addStartDate ( jsonResponse.startDate );
					theGtfsTree.routesMaster = jsonResponse.routesMaster;
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

	constructor () {
		Object.freeze ( this );
	}
}

export default GtfsDataLoader;