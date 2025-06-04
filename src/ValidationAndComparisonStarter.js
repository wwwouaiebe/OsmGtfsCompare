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

import theOsmDataLoader from './OsmDataLoader.js';
import GtfsTreeBuilder from './GtfsTreeBuilder.js';
import OsmTreeBuilder from './OsmTreeBuilder.js';
import thePlatformsReport from './PlatformsReport.js';
import theRelationsReport from './RelationsReport.js';
import theStatsReport from './StatsReport.js';
import theExcludeList from './ExcludeList.js';
import GtfsDataLoader from './GtfsDataLoader.js';
import OsmGtfsComparator from './OsmGtfsComparator.js';
import theDocConfig from './DocConfig.js';
import OsmRouteMasterValidator from './OsmRouteMasterValidator.js';
import RoutesWithoutRouteMasterValidator from './RoutesWithoutRouteMasterValidator.js';
import PlatformsValidator from './PlatformsValidator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Entry point for the validation and the comparison
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class ValidationAndComparisonStarter {

	/**
     * The constructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	 * start the validation and comparison
	 */

	async start ( ) {

		// reset of the Errors only button
		document.getElementById ( 'errorsOnlyInput' ).value = 'Errors only';

		// reading the form
		theDocConfig.loadData ( );

		// loading exclude list
		await theExcludeList.loadData ( );

		// opening report
		thePlatformsReport.open ( );
		theRelationsReport.open ( );
		theStatsReport.open ( );

		// loading osm data
		await theOsmDataLoader.fetchData (	);

		// Validating the platforms
		new PlatformsValidator ( ).validate ( );

		// Report excluded gtfs platforms
		theExcludeList.reportGtfsExcludedPlatforms ( );

		// Search routes without route_master
		await new RoutesWithoutRouteMasterValidator ( ).fetchData ( );

		// validating the osm routes and route_ master
		new OsmRouteMasterValidator ( ).validate ( );

		// building the osmtree for the comparison osm gtfs
		new OsmTreeBuilder ( ).buildTree ( );

		// loading gtfs data for the comparison osm gtfs
		await new GtfsDataLoader ( ).fetchData ( );

		// building the gtfs tree for the comparison osm gtfs
		new GtfsTreeBuilder ( ).buildTree ( );

		// compare existing osm route_master with gtfs route_master
		if ( 'used' === theDocConfig.type ) {
			new OsmGtfsComparator ( ).compare ( );
		}

		// close...
		thePlatformsReport.close ( );
		theRelationsReport.close ( );
		theStatsReport.close ( );
	}
}

export default ValidationAndComparisonStarter;

/* --- End of file --------------------------------------------------------------------------------------------------------- */