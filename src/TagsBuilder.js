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

import TagValue from './TagValue.js';
import theDocConfig from './DocConfig.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
 * Coming soon
 */
/* ------------------------------------------------------------------------------------------------------------------------- */

class TagsBuilder {

	/**
	 * Customized tags for TECL and proposed:route
	 * value = '*' : tag is mandatory and value is not controlled
	 * value = '?' tag is not mandatory and value is not controlled
	 * value = 'string' tag is mandatory and value must be 'string'
	 * @type {Array}
	 */

	/*
	#customTags = [
		{
			network : 'TECL',
			type : 'proposed:route',
			routeTags : [
				new TagValue (
					'colour',
					true,
					[
						'#006B2D', // Sud Connect
						'#00B9F2', // Nord Urbain
						'#164194', // Nord Connect
						'#63B9E9', // Nord Interurbain
						'#69A82F', // Sud Urbain
						'#812B29', // Est Connect
						'#9ECB84', // Sud Interurbain
						'#A64224', // Est Urbain
						'#E74011', // Ouest Connect
						'#E8308A', // Liège Connect
						'#EF7D00', // Ouest Urbain
						'#F088B6', // Liège Urbain
						'#D50911', // Tram
						'#FFED00', // Busway
						'#C9956D', // Est interurbain
						'#F7AB59', // " Ouest interurbain
						'#000000' // Express
					]
				),
				new TagValue ( 'colour:text', true, [ '#000000', '#FFFFFF' ] ),
				new TagValue ( 'from', true ),
				new TagValue ( 'name', true ),
				new TagValue ( 'network', true, 'TECL' ),
				new TagValue ( 'network:wikidata', true, 'Q3512078' ),
				new TagValue ( 'network:wikipedia', false, 'fr:TEC Liège-Verviers' ),
				new TagValue ( 'operator', true, 'TEC' ),
				new TagValue ( 'operator:wikidata', true, 'Q366922' ),
				new TagValue ( 'operator:wikipedia', false, 'fr:Opérateur de transport de Wallonie' ),
				new TagValue ( 'public_transport:version', true, '2' ),
				new TagValue ( 'ref', true ),
				new TagValue ( 'proposed:route', true, [ 'bus', 'tram' ] ),
				new TagValue ( 'to', true ),
				new TagValue ( 'type', true, 'proposed:route' ),
				new TagValue (
					'note',
					true,
					[
						'This relation is a part of the new bus network starting january 2025',
						'This relation is a part of the new tram network starting january 2025'
					]
				),
				new TagValue ( 'opening_date', true, '2025-01' ),
				new TagValue ( 'via', false )
			],
			routeMasterTags : [
				new TagValue (
					'colour',
					true,
					[
						'#006B2D', // Sud Connect
						'#00B9F2', // Nord Urbain
						'#164194', // Nord Connect
						'#63B9E9', // Nord Interurbain
						'#69A82F', // Sud Urbain
						'#812B29', // Est Connect
						'#9ECB84', // Sud Interurbain
						'#A64224', // Est Urbain
						'#E74011', // Ouest Connect
						'#E8308A', // Liège Connect
						'#EF7D00', // Ouest Urbain
						'#F088B6', // Liège Urbain
						'#D50911', // Tram
						'#FFED00', // Busway
						'#C9956D', // Est interurbain
						'#F7AB59', // " Ouest interurbain
						'#000000' // Express
					]
				),
				new TagValue ( 'colour:text', true, [ '#000000', '#FFFFFF' ] ),
				new TagValue ( 'description', true ),
				new TagValue ( 'name', true ),
				new TagValue ( 'network', true, 'TECL' ),
				new TagValue ( 'network:wikidata', true, 'Q3512078' ),
				new TagValue ( 'network:wikipedia', false, 'fr:TEC Liège-Verviers' ),
				new TagValue ( 'operator', true, 'TEC' ),
				new TagValue ( 'operator:wikidata', true, 'Q366922' ),
				new TagValue ( 'operator:wikipedia', false, 'fr:Opérateur de transport de Wallonie' ),
				new TagValue ( 'ref', true ),
				new TagValue ( 'ref:TEC', true ),
				new TagValue ( 'proposed:route_master', true, [ 'bus', 'tram' ] ),
				new TagValue ( 'type', true, 'proposed:route_master' ),
				new TagValue (
					'note',
					true,
					[
						'This relation is a part of the new bus network starting january 2025',
						'This relation is a part of the new tram network starting january 2025'
					]
				),
				new TagValue ( 'opening_date', true, '2025-01' )
			]
		}
	];
	*/

	/**
	 * Get the route tags to verify
	 * @type {Array}
	 */

	static get RouteTags ( ) {
		return [
			new TagValue ( 'public_transport:version', true, '2' ),
			new TagValue (
				( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route',
				 true,
				 theDocConfig.vehicle
			),
			new TagValue (
				'type',
				true,
				( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route'
			)
		];
	}

	/**
	 * Get the route_master tags to verify
	 * @type {Array}
	 */

	static get RouteMasterTags ( ) {
		return [
			new TagValue ( 'description', true ),
			new TagValue (
				( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route_master',
				 true,
				 theDocConfig.vehicle
			),
			new TagValue (
				'type',
				true,
				( 'used' === theDocConfig.type ? '' : theDocConfig.type + ':' ) + 'route_master'
			)
		];
	}

	/**
	 * The constructor
	 */

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default TagsBuilder;

/* --- End of file --------------------------------------------------------------------------------------------------------- */