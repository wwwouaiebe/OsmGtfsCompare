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
Doc reviewed 20250126
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

import theRelationsReport from './RelationsReport.js';
import TagKeyValue from './TagKeyValue.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Validator for the tags
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class TagsValidator {

	/**
     * A counter for the errors
     * @type {Number}
     */

	#errorCounter = 0;

	/**
     * An array of TagKeyValue mandatory for the controled object
     * @type {Array.<TagKeyValue>}
     */

	#tagKeyValues = [];

 	/**
	 * The tags of the object currently controlled
	 * @type {Object}
	 */

	#tags;

	/**
	 * A validator for tags where the value must be one of a list values
	 * @param {String} tagValue The value of the controled tag
	 * @param {TagKeyValue} tagKeyValue A TagKeyValue corresponding to the controled tag
	 */

	#validateMustBeOneOf ( tagValue, tagKeyValue ) {
		const expectedValue = tagKeyValue.value;
		let isValid = false;
		expectedValue.forEach (
			value => { isValid ||= value === tagValue; }
		);
		if ( ! isValid ) {
			this.#errorCounter ++;
			theRelationsReport.add (
				'p',
				'Error T001: The value of the tag ' + tagKeyValue.key + ' must be one of "' +
					expectedValue.toString ( ) +
					'" (found "' + tagValue + '")'
			);
		}
	}

	/**
	 * A validator for tags where the value is a list separed by semi-columns and must contains a precise value
	 * @param {String} tagValue The value of the controled tag
	 * @param {TagKeyValue} tagKeyValue A TagKeyValue corresponding to the controled tag
	 */

	#validateMustContains ( tagValue, tagKeyValue ) {
		const expectedValue = tagKeyValue.value [ 0 ];
		let isValid = false;
		tagValue.split ( ';' ).forEach (
			value => { isValid ||= value === expectedValue; }
		);
		if ( ! isValid ) {
			this.#errorCounter ++;
			theRelationsReport.add (
				'p',
				'Error T002: The value of the tag ' + tagKeyValue.key + ' must include "' +
					expectedValue +
					'" (found "' + tagValue + '")'
			);
		}
	}

	/**
	 * A validator for tags where the value must be a precise value
	 * @param {String} tagValue The value of the controled tag
	 * @param {TagKeyValue} tagKeyValue A TagKeyValue corresponding to the controled object
	 */

	#validateMustBe ( tagValue, tagKeyValue ) {
		const expectedValue = tagKeyValue.value;
		let isValid = tagValue === expectedValue;
		if ( ! isValid ) {
			this.#errorCounter ++;
			theRelationsReport.add (
				'p',
				'Error T003: The value of the tag ' + tagKeyValue.key + ' must be "' +
					expectedValue +
					'" (found "' + tagValue + '")'
			);
		}
	}

	/**
     * Start the validation
	 * @returns {Number} the number of errors found
     */

	validate ( ) {

		this.#errorCounter = 0;
		this.#tagKeyValues.forEach (
			tagKeyValue => {
				const tagValue = this.#tags [ tagKeyValue.key ];
				if ( tagValue ) {
					switch ( tagKeyValue.valueType ) {
					case TagKeyValue.valueTypes.mustBeOneOf :
						this.#validateMustBeOneOf ( tagValue, tagKeyValue );
						break;
					case TagKeyValue.valueTypes.mustContains :
						this.#validateMustContains ( tagValue, tagKeyValue );
						break;
					case TagKeyValue.valueTypes.mustBe :
						this.#validateMustBe ( tagValue, tagKeyValue );
						break;
					default :
						break;
					}
				}
				else {
					theRelationsReport.add (
						'p',
						'Error T004: No tag ' + tagKeyValue.key
					);
					this.#errorCounter ++;
				}
			}
		);

		return this.#errorCounter;
	}

	/**
	 * The constructor
	 * @param {Object} tags The tags of the controlled object
     * @param {Array.<TagKeyValue>} tagKeyValues An array of TagKeyValue objects corresponding to the controled object
	 */

	constructor ( tags, tagKeyValues ) {
		this.#tags = tags;
		this.#tagKeyValues = tagKeyValues;
		Object.freeze ( this );
	}
}

export default TagsValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */