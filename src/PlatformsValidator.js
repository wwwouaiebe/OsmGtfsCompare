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
import theExcludeList from './ExcludeList.js';
import theReport from './Report.js';
import theDocConfig from './DocConfig.js';
import theOperator from './Operator.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * A validator for the platforms
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class PlatformsValidator {

   	/**
	 * An array with platforms with more than one ref:NETWORK
	 * @type {Array.<Object>}
	 */

	#platformsWithMoreThanOneRef = [];

	/**
	 * An array with platforms without network
	 * @type {Array.<Object>}
	 */

	#platformsWithoutNetwork = [];

	/**
	 * An array with platforms without operator
	 * @type {Array.<Object>}
	 */

	#platformsWithoutOperator = [];

	/**
	 * this method control the platforms and add the platforms to the arrays, depending of the errors found
	 * @param {Object} osmObject The object to control
	 */

	#controlPlatform ( osmObject ) {

		// filtering on bus_stop and tram_stop
		if (
			'bus_stop' !== osmObject?.tags?.highway
			&&
			'tram_stop' !== osmObject?.tags?.railway
		) {
			return;
		}

		// More than 1 ref:NETWORK Adding to the array and to the exclude list
		let osmRef = osmObject.tags [ 'ref:' + theDocConfig.network ];
		if ( osmRef && 1 < osmRef.split ( ';' ).length ) {
			theExcludeList.translateOsmPlatform ( osmRef );
			this.#platformsWithMoreThanOneRef.push ( osmObject );
		}

		// No network
		if (
			! osmObject.tags.network
			||
			! osmObject.tags.network.includes ( theDocConfig.network )
		) {
			this.#platformsWithoutNetwork.push ( osmObject );
		}

		// No operator
		if (
			! osmObject.tags.operator
			||
			! osmObject.tags.operator.includes ( theOperator.osmOperator )
		) {
			this.#platformsWithoutOperator.push ( osmObject );
		}
	}

	/**
	 * Report platforms with more than 1 ref:NETWORK
	 */

	#reportPlatformsMore1Ref ( ) {
		theReport.add ( 'h1', 'Platforms with more than 1 ref:' + theDocConfig.network );
		if ( 0 === this.#platformsWithMoreThanOneRef.length ) {
			theReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithMoreThanOneRef.forEach (
				osmObject => {
					theReport.add (
						'p',
						osmObject.tags.name + ' ' + osmObject.tags[ 'ref:' + theDocConfig.network ],
						osmObject );
				}
			);
		}
	}

	/**
	 * Report platforms without network
	 */

	#reportPlatformsWithoutNetwork ( ) {

		theReport.add ( 'h1', 'Platforms where the network tag dont include ' + theDocConfig.network );
		if ( 0 === this.#platformsWithoutNetwork.length ) {
			theReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithoutNetwork.forEach (
				osmObject => {
					theReport.add ( 'p', osmObject.tags.name + '- network : ' + ( osmObject.tags.network ?? '' ), osmObject );
				}
			);

		}
	}

	/**
	 * Report platforms without operator
	 */

	#reportPlatformsWithoutOperator ( ) {

		theReport.add ( 'h1', 'Platforms where the operator tag dont include ' + theOperator.osmOperator );
		if ( 0 === this.#platformsWithoutOperator.length ) {
			theReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithoutOperator.forEach (
				osmObject => {
					theReport.add ( 'p', osmObject.tags.name + '- operator : ' + ( osmObject.tags.operator ?? '' ), osmObject );
				}
			);
		}
	}

	/**
	 * Validate the platforms
	 */

	validate ( ) {
		theOsmDataLoader.nodes.forEach (
			node => {
				this.#controlPlatform ( node );
			}
		);
		this.#reportPlatformsMore1Ref ( );
		this.#reportPlatformsWithoutNetwork ( );
		this.#reportPlatformsWithoutOperator ( );

	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default PlatformsValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */