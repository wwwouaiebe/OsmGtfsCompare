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
import GtfsTreeBuilder from './GtfsTreeBuilder.js';
import OsmTreeBuilder from './OsmTreeBuilder.js';
import theReport from './Report.js';
import theExcludeList from './ExcludeList.js';
import GtfsDataLoader from './GtfsDataLoader.js';
import OsmGtfsComparator from './OsmGtfsComparator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AppLoader {

	/**
     * The costructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * Coming soon
	 */

	async start ( ) {

		// reset of the Errors only button
		document.getElementById ( 'errorsOnlyInput' ).value = 'Errors only';

		// reading the form
		let osmRef = document.getElementById ( 'osmRef' ).value;
		let osmNetwork = document.getElementById ( 'osmNetworkSelect' ).value;
		let osmVehicle = document.getElementById ( 'osmVehicleSelect' ).value;

		// opening report
		theReport.open ( );

		// loading exclude list
		await theExcludeList.loadData ( osmNetwork );

		// loading osm data
		let osmDataLoader = new OsmDataLoader ( );
		await osmDataLoader.fetchData (
			{
				osmNetwork : osmNetwork,
				osmVehicle : osmVehicle,
				osmRef : osmRef
			}
		);

		// building the osmtree
		new OsmTreeBuilder ( ).buildTree ( osmDataLoader );

		// loading gtfs data
		await new GtfsDataLoader ( ).fetchData ( osmNetwork );

		// building the gtfs tree
		new GtfsTreeBuilder ( ).buildTree ( );

		// compare existing osm route master with gtfs route
		let osmGtfsComparator = new OsmGtfsComparator ( );
		osmGtfsComparator.compare ( );

		// Search Missing osm route master only if no osm ref given by user
		if ( ! osmRef ) {
			osmGtfsComparator.searchMissingOsmRouteMaster ( );
		}

		// close...
		theReport.close ( );
	}
}

export default AppLoader;

/* --- End of file --------------------------------------------------------------------------------------------------------- */