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

import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Validator for a continuous route
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class ContinuousRouteValidator {

	/**
     * A counter for the errors
     * @type {Number}
     */

	#errorCounter = 0;

	/**
	 * The route currently controlled
	 * @type {Object}
	 */

	#route;

	/**
	 * the ways associated to the route (= members without role but having an highway tag
	 * for bus or a railway tag for tram and subway)
	 * @type {Array}
	 */

	#ways;

	/**
	* Verify that a way is circular (= same node for the first and last node)
	 @param {Object} way to verify
	 @returns {boolean} True when the way is circular
	 */

	#wayIsRoundabout ( way ) {
		return way.nodes [ 0 ] === way.nodes.toReversed ( ) [ 0 ];
	}

	/**
	 * Verify that two ways are sharing a node at the beginning or at the end
	 * @param {Object} firstWay The first way to verify
	 * @param {Object} secondWay The second way to verify
	 */

	 #waysHaveCommonNode ( firstWay, secondWay ) {
		return secondWay.nodes [ 0 ] === firstWay.nodes [ 0 ] ||
		secondWay.nodes [ 0 ] === firstWay.nodes.toReversed ( ) [ 0 ] ||
		secondWay.nodes.toReversed ( ) [ 0 ] === firstWay.nodes [ 0 ] ||
		secondWay.nodes.toReversed ( ) [ 0 ] === firstWay.nodes.toReversed ( ) [ 0 ];
	}

	/**
	 * Verify that for two ways:
	 * - one way is circular (= same node for the first and last node)
	 * - the other way have the start node or end node shared with the circular way
	 * @returns {boolean} True when a node is shared between the two ways
	 * @param {Object} firstWay the first way to test
	 * @param {Object} secondWay the second way to test
	 */

	 #waysViaRoundabout ( firstWay, secondWay ) {
		if ( this.#wayIsRoundabout ( firstWay ) ) {
			return -1 !== firstWay.nodes.indexOf ( secondWay.nodes [ 0 ] ) ||
				-1 !== firstWay.nodes.indexOf ( secondWay.nodes.toReversed ( ) [ 0 ] );
		}
		else if ( this.#wayIsRoundabout ( secondWay ) ) {
			return -1 !== secondWay.nodes.indexOf ( firstWay.nodes [ 0 ] ) ||
				-1 !== secondWay.nodes.indexOf ( firstWay.nodes.toReversed ( ) [ 0 ] );
		}
		return false;
	}

	/**
	* Verify that the ways of the route are continuous
	 */

	validate ( ) {
		this.#errorCounter = 0;
		let previousWay = null;
		this.#ways.forEach (
			way => {
				if ( previousWay ) {
					if (
						! this.#waysHaveCommonNode ( way, previousWay )
						&&
						! this.#waysViaRoundabout ( way, previousWay )
					) {
						theReport.add (
							'p',
							'Error R001: hole found for route ' + theReport.getOsmLink ( this.#route ) +
                            ' between way id ' + theReport.getOsmLink ( previousWay ) +
                            ' and way id ' + theReport.getOsmLink ( way )
						);
						this.#errorCounter ++;
						previousWay = null;
					}
				}
				previousWay = way;
			}
		);
		return this.#errorCounter;
	}

	/**
	 * The constructor
	 * @param {Object} route The controlled route
	 * @param {Array} ways The ways member of the route
	 */

	constructor ( route, ways ) {

		this.#route = route;
		this.#ways = ways;

		Object.freeze ( this );
	}
}

export default ContinuousRouteValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */