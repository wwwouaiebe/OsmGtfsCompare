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
 * A simple container to store the app configuration
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class Config {

	/**
	 * The directory where the app is installed on the computer. Needed for the report with nodejs.
	 * Coming from the app parameter
	 * @type {String}
	 */

	appDir;

	/**
	 * The type of routes to be analysed ('route' or 'proposed:route' or 'disused:route')
	 * @type {string}
	 */

	osmType;

	/**
	 * The osm area when the control is limited to an area
	 * @type {number}
	 */

	osmArea;

	/**
	 * The osm relation when the control is limited to a relation
	 * @type {number}
	 */

	osmRelation;

	/**
	 * The osm network ('TECL', 'TECX', 'IBXL' or any other network)
	 * @type {string}
	 */

	osmNetwork;

	/**
	 * the osm vehicle ('bus','tram' or 'subway')
	 * @type {string}
	 */

	osmVehicle;

	/**
	 * The constructor
	 */

	constructor ( ) {
		this.osmType = 'route';
		this.osmArea = 0;
		this.osmRelation = 0;
		this.osmNetwork = 'TECL';
		this.osmVehicle = 'bus';
		this.appDir = '';
	}

}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * The one and only one instance of Config class. Notice that the object will be sealed directly after reading the parameters
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

const theConfig = new Config;

export default theConfig;

/* --- End of file --------------------------------------------------------------------------------------------------------- */