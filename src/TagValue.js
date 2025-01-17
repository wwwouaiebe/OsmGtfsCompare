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
 * Simple container for possible tag values
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class TagValue {

	/**
	 * The tag name
	 * @type {String}
	 */

	#name;

	/**
	 * A boolean indicating if the tag is mandatory
	 * @type {boolean}
	 */

	#isMandatory;

	/**
	 * the possible values for the Tag
	 * @type {?string|array}
	 */

	#values;

	/**
	 * The tag name
	 * @type {String}
	 */

	get name ( ) { return this.#name; }

	/**
	 * A boolean indicating if the tag is mandatory
	 * @type {boolean}
	 */

	get isMandatory ( ) { return this.#isMandatory; }

	/**
	 * the possible values for the Tag
	 * @type {?string|array}
	 */

	get values ( ) { return this.#values; }

	/**
	 * The constructor
	 * @param {string} name The tag name
	 * @param {boolean} isMandatory A boolean indicating if the tag is mandatory
	 * @param {?string|array} values the possible values for the Tag
	 */

	constructor ( name, isMandatory, values ) {
		this.#name = name;
		this.#isMandatory = isMandatory;
		this.#values = values;
		Object.freeze ( this );
		Object.freeze ( this.#values );
	}
}

export default TagValue;