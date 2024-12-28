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

import theOperator from './Operator.js';
import AppLoader from './AppLoader.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * automatic startup
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class AutoStartup {

	/**
     * Read and verify the url parameters, complete the form with the parameters and start the control
     */

	async start ( ) {

		// reading url
		const docURL = new URL ( window.location );
		let operator = docURL.searchParams.get ( 'operator' );
		let network = docURL.searchParams.get ( 'network' );
		let vehicle = docURL.searchParams.get ( 'vehicle' );
		let type = docURL.searchParams.get ( 'type' );
		let autoStartup = docURL.searchParams.get ( 'autostartup' );

		// stop if no values
		if ( ! operator ) {
			alert ( 'no operator parameter.' );
			return;
		}

		if ( ! type ) {
			alert ( 'no type parameter.' );
			return;
		}

		if ( ! vehicle ) {
			alert ( 'no vehicle parameter.' );
			return;
		}

		if ( ! await theOperator.loadData ( operator ) ) {
			alert ( 'Unknown operator' );
			return;
		}

		let osmNetworkSelectElement = document.getElementById ( 'osmNetworkSelect' );
		theOperator.networks.forEach (
			networkObj => {
				let optionElement = document.createElement ( 'option' );
				optionElement.text = networkObj.osmNetwork;
				osmNetworkSelectElement.appendChild ( optionElement );
			}
		);

		if ( network ) {
			osmNetworkSelectElement.value = network;
		}

		// verification of parameters
		if ( -1 === [ 'bus', 'tram', 'subway' ].indexOf ( vehicle ) ) {
			alert ( 'bad value for vehicle parameter. Must be bus, tram or subway' );
			return;
		}

		if ( -1 === [ 'used', 'proposed', 'disused' ].indexOf ( type ) ) {
			alert ( 'bad value for type parameter. Must be bus used, proposed or disused' );
			return;
		}

		// complete the form
		document.getElementById ( 'osmNetworkSelect' ).value = network;
		document.getElementById ( 'osmVehicleSelect' ).value = vehicle;
		document.getElementById ( 'osmTypeSelect' ).value = type;

		// auto startup
		if ( 'true' === autoStartup || 'yes' === autoStartup ) {
			new AppLoader ( ).start ( );
		}
	}

	/**
     * The constructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default AutoStartup;

/* --- End of file --------------------------------------------------------------------------------------------------------- */