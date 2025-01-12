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
Doc reviewed 20250110
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class DocConfig {

	/**
     * Coming soon
     * @type {String}
     */

	#network = '';

	/**
     * Coming soon
     * @type {String}
     */

	#vehicle = '';

	/**
     * Coming soon
     * @type {String}
     */

	#type = '';

	/**
     * Coming soon
     * @type {String}
     */

	#ref = '';

	/**
     * Coming soon
     * @type {String}
     */

	get network ( ) { return this.#network; }

	/**
     * Coming soon
     * @type {String}
     */

	get vehicle ( ) { return this.#vehicle; }

	/**
     * Coming soon
     * @type {String}
     */

	get type ( ) { return this.#type; }

	/**
     * Coming soon
     * @type {String}
     */

	get ref ( ) { return this.#ref; }

	/**
     * Coming soon
     */

	loadData ( ) {
		this.#network = document.getElementById ( 'osmNetworkSelect' ).value;
		this.#vehicle = document.getElementById ( 'osmVehicleSelect' ).value;
		this.#type = document.getElementById ( 'osmTypeSelect' ).value;
		this.#ref = document.getElementById ( 'osmRef' ).value;
	}

	/**
     * The constructor
     */

	constructor ( ) {
		Object.freeze ( this );
	}
}

/**
 * The one and only one object DocConfig
 */

const theDocConfig = new DocConfig ( );

export default theDocConfig;

/* --- End of file --------------------------------------------------------------------------------------------------------- */