/*
Copyright - 2024 2025 - wwwouaiebe - Contact: https://www.ouaie.be/

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

class TagKeyValue {

	/**
	 * The tag key
	 * @type {String}
	 */

	#key;

	/**
	 * the tag value
	 * @type {?String|array.<String>}
	 */

	#value;

	/**
	 * The type of the value
	 * @type {Number}
	 */

	#valueType;

	/**
	 * An enum with the different valueTypes
	 * mustBeOneOf: theTagKeyValue.value is an Array an the tag value must be a member of this array
	 * mustContains: the TagKeyValue.value is an Array with only one member and the tag value is a csv list with
	 * one value = to the TagKeyValue.value
	 * mustBe: the TagKeyValue.value is a string and the tag value must be equal to that string
	 * mustExist: the TagKeyValue.value is null and the tag must be present and can have any value
	 * badValue the TagKeyValue is invalid
	 * @type {Object}
	 */

	static get valueTypes ( ) {
		return Object.freeze (
			{
				mustBeOneOf : 1,
				mustContains : 2,
				mustBe : 3,
				mustExist : 4,
				badValue : 5
			}
		);
	}

	/**
	 * The tag key
	 * @type {String}
	 */

	get key ( ) { return this.#key; }

	/**
	 * the tag value
	 * @type {?String|array.<String>}
	 */

	get value ( ) { return this.#value; }

	/**
	 * The tag valueType
	 * @type {Number}
	 */

	get valueType ( ) { return this.#valueType; }

	/**
	 * The constructor
	 * @param {string} key The tag key
	 * @param {?string|array} value the possible values for the Tag. See TagKeyValue.valueTypes for more
	 */

	constructor ( key, value ) {
		this.#key = key;
		this.#value = value;

		if ( null === this.#value ) {
			this.#valueType = TagKeyValue.valueTypes.mustExist;
		}
		else if ( 'string' === typeof this.#value ) {
			this.#valueType = TagKeyValue.valueTypes.mustBe;
		}
		else if ( Array.isArray ( this.#value ) ) {
			switch ( this.#value.length ) {
			case 0 :
				this.#valueType = TagKeyValue.valueTypes.badValue;
			case 1 :
				this.#valueType = TagKeyValue.valueTypes.mustContains;
				break;
			default :
				this.#valueType = TagKeyValue.valueTypes.mustBeOneOf;
				break;
			}
		}
		else {
			this.#valueType = TagKeyValue.valueTypes.badValue;
		}

		Object.freeze ( this );
		Object.freeze ( this.#value );
	}
}

export default TagKeyValue;

/* --- End of file --------------------------------------------------------------------------------------------------------- */