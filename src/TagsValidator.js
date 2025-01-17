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

import theConfig from './Config.js';
import theReport from './Report.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Validator for the tags
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class TagsValidator {

	/**
     * the used tags
     * @type {Object}
     */

	#tags;

 	/**
	 * The relation currently controlled
	 * @type {Object}
	 */

	#relation;

	/**
     * Search the missing tags
     */

	#searchMissingTags ( ) {

		this.#tags.forEach (
			tag => {
				if ( tag.isMandatory && ! this.#relation.tags [ tag.name ] ) {
					theReport.add (
						'p',
						'No ' + tag.name + ' key for this route'
					);
				}
				if ( this.#relation.tags [ tag.name ] && tag.values ) {
					if ( Array.isArray ( tag.values ) ) {
						if ( -1 === tag.values.indexOf ( this.#relation.tags [ tag.name ] ) ) {
							theReport.add (
								'p',
								'Invalid value ' + this.#relation.tags [ tag.name ] +
									' for tag ' + tag.name
							);
						}
					}
					else if ( this.#relation.tags [ tag.name ] !== tag.values ) {
						theReport.add (
							'p',
							'Invalid value ' + this.#relation.tags [ tag.name ] +
								' for tag ' + tag.name
						);
					}
				}
			}
		);
	}

	/**
     * Search the unuseful tags
     */

	#searchUnusefulTags ( ) {
		if ( 'TECL' !== theConfig.osmNetwork || 'proposed:route' !== theConfig.osmType ) {
			return;
		}
		for ( const key of Object.keys ( this.#relation.tags ) ) {
			if ( ! this.#tags.get ( key ) ) {
				theReport.add (
					'p',
					'Unuseful ' + key + ' tag for this route'
				);
			}
		}
	}

	/**
     * Start the validation
     */

	validate ( ) {
		this.#searchMissingTags ( );
		this.#searchUnusefulTags ( );
	}

	/**
	 * The constructor
	 * @param {Object} relation The controlled route or route_master
     * @param {Object} tags The valid tags
	 */

	constructor ( relation, tags ) {
		this.#relation = relation;
		this.#tags = new Map ( );
		tags.forEach (
			tag => { this.#tags.set ( tag.name, tag ); }
		);

		Object.freeze ( this );
	}
}

export default TagsValidator;

/* --- End of file --------------------------------------------------------------------------------------------------------- */