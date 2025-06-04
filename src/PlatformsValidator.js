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
import thePlatformsReport from './PlatformsReport.js';
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
	 * An array with platforms without operator
	 * @type {Array.<Object>}
	 */

	#platformsWithoutPublicTransport = [];

	/**
	 * this method control the platforms and add the platforms to the arrays, depending of the errors found
	 * @param {Object} osmObject The object to control
	 */

	// eslint-disable-next-line complexity
	#controlPlatform ( osmObject ) {

		// filtering on bus_stop and tram_stop
		if (
			'bus_stop' !== osmObject?.tags?.highway
			&&
			'tram_stop' !== osmObject?.tags?.railway
			&&
			'platform' !== osmObject?.tags?.railway
			&&
			'platform' !== osmObject?.tags?.way
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
			'platform' === osmObject?.tags?.public_transport
			&&
			(
				! osmObject.tags.network
				||
				! osmObject.tags.network.includes ( theDocConfig.network )
			)
		) {
			this.#platformsWithoutNetwork.push ( osmObject );
		}

		// No operator
		if (
			'platform' === osmObject?.tags?.public_transport
			&&
			(
				! osmObject.tags.operator
				||
				! osmObject.tags.operator.includes ( theOperator.osmOperator )
			)
		) {
			this.#platformsWithoutOperator.push ( osmObject );
		}

		// No public_transport
		if (
			'platform' !== osmObject?.tags?.public_transport
			&&
			'stop_position' !== osmObject?.tags?.public_transport
		) {
			this.#platformsWithoutPublicTransport.push ( osmObject );
		}
	}

	/**
	 * Report platforms with more than 1 ref:NETWORK
	 */

	#reportPlatformsMore1Ref ( ) {
		thePlatformsReport.add ( 'h1', 'Platforms with more than 1 ref:' + theDocConfig.network );
		if ( 0 === this.#platformsWithMoreThanOneRef.length ) {
			thePlatformsReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithMoreThanOneRef.forEach (
				osmObject => {
					thePlatformsReport.add (
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

		thePlatformsReport.add ( 'h1', 'Platforms where the network tag dont include ' + theDocConfig.network );
		if ( 0 === this.#platformsWithoutNetwork.length ) {
			thePlatformsReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithoutNetwork.forEach (
				osmObject => {
					thePlatformsReport.add (
						'p',
						osmObject.tags.name + '- network : ' + ( osmObject.tags.network ?? '' ),
						osmObject
					);
				}
			);

		}
	}

	/**
	 * Report platforms without operator
	 */

	#reportPlatformsWithoutOperator ( ) {

		thePlatformsReport.add ( 'h1', 'Platforms where the operator tag dont include ' + theOperator.osmOperator );
		if ( 0 === this.#platformsWithoutOperator.length ) {
			thePlatformsReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithoutOperator.forEach (
				osmObject => {
					thePlatformsReport.add (
						'p',
						osmObject.tags.name + '- operator : ' + ( osmObject.tags.operator ?? '' ),
						osmObject
					);
				}
			);
		}
	}

	/**
	 * Report platforms without public_transport=platform tag
	 */

	#reportPlatformsWithoutPublicTransport ( ) {
		thePlatformsReport.add ( 'h1', 'Platforms whithout "public_transport=platform" tag' );
		if ( 0 === this.#platformsWithoutPublicTransport.length ) {
			thePlatformsReport.add ( 'p', 'Nothing found' );
		}
		else {
			this.#platformsWithoutPublicTransport.forEach (
				osmObject => {
					thePlatformsReport.add ( 'p', osmObject.tags.name, osmObject );
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
		theOsmDataLoader.ways.forEach (
			node => {
				this.#controlPlatform ( node );
			}
		);
		this.#reportPlatformsMore1Ref ( );
		this.#reportPlatformsWithoutNetwork ( );
		this.#reportPlatformsWithoutOperator ( );
		this.#reportPlatformsWithoutPublicTransport ( );

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