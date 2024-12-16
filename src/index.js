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

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 *The entry point of the app for a browser
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

import theVersion from './version.js';
import GoButtonClickEL from './GoButtonClickEL.js';

// all the necessary code is inside the constructor of theThemeChanger so only an import
// is needed to enable theThemeChanger
// eslint-disable-next-line no-unused-vars
import theThemeChanger from './ThemeChanger.js';
import ErrorsOnlyButtonClickEL from './ErrorsOnlyButtonClickEL.js';

// reading url
const docURL = new URL ( window.location );
let network = docURL.searchParams.get ( 'network' );
let vehicle = docURL.searchParams.get ( 'vehicle' );

// verification of parameters
if ( -1 === [ 'bus', 'tram', 'subway' ].indexOf ( vehicle ) ) {
	alert ( 'bad value for vehicle parameter. Must be bus, tram or subway' );
}
else {
	document.getElementById ( 'osmVehicleSelect' ).value = vehicle;
}
if ( -1 === [ 'TECB', 'TECC', 'TECH', 'TECL', 'TECN', 'TECX' ].indexOf ( network ) ) {
	alert ( 'bad value for network parameter. Must be TECB, TECC, TECH, TECL, TECN, TECX or IBXL' );
}
else {
	document.getElementById ( 'osmNetworkSelect' ).value = network;
}

document.getElementById ( 'goInput' ).addEventListener ( 'click', new GoButtonClickEL ( ), false );
document.getElementById ( 'errorsOnlyInput' ).addEventListener ( 'click', new ErrorsOnlyButtonClickEL ( ), false );
document.getElementById ( 'version' ).innerText = 'Version: ' + theVersion;

/* --- End of file --------------------------------------------------------------------------------------------------------- */