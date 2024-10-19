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

import OsmDataLoader from './OsmDataLoader.js';
import theGtfsDataLoader from './GtfsDataLoader.js';
import theOsmDataTreeBuilder from './OsmDataTreeBuilder.js';
import OsmGtfsComparator from './OsmGtfsComparator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Simple event handler for click on the go button of the web page
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class GoButtonClickEL {

	/**
	 * The contructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Event handler
	 */

	async handleEvent ( ) {
		document.getElementById ( 'waitAnimation' ).style.visibility = 'visible';
		let osmRef = document.getElementById ( 'osmRef' ).value;
		let osmNetwork = document.getElementById ( 'osmNetworkSelect' ).value;
		let osmVehicle = document.getElementById ( 'osmVehicleSelect' ).value;

		await new OsmDataLoader ( ).fetchData (
			{
				osmNetwork : osmNetwork,
				osmVehicle : osmVehicle,
				osmRef : osmRef
			}
		);
		theOsmDataTreeBuilder.buildTree ( );

		await theGtfsDataLoader.loadData ( osmNetwork );

		theOsmDataTreeBuilder.osmTree.routesMaster.forEach (
			osmRouteMaster => {
				let gtfsRouteMaster =
					theGtfsDataLoader.gtfsTree.routesMaster.find ( element => osmRouteMaster.ref === element.ref );
				if ( gtfsRouteMaster ) {
					new OsmGtfsComparator ( ).compareRoutesMaster ( osmRouteMaster, gtfsRouteMaster );
				}
				else {
					console.log ( 'This route is not in the gtfs data' );
				}
			}
		);
		document.getElementById ( 'waitAnimation' ).style.visibility = 'hidden';
	}
}

export default GoButtonClickEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */