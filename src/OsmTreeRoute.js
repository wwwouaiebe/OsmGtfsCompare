import theReport from './Report.js';
import theExcludeList from './ExcludeList.js';

class osmTreeRoute {

	#network = '';

	#name = '';

	#id = '';

	#platforms = '';

	#from = '';

	#to = '';

	#platformNames = new Map ( );

	get name ( ) { return this.#name; }

	get id ( ) { return this.#id; }

	get platforms ( ) { return this.#platforms; }

	get from ( ) { return this.#from; }

	get to ( ) { return this.#to; }

	get platformNames ( ) { return this.#platformNames; }

	#getOsmPlatformRef ( osmPlatform ) {

		let osmRef = osmPlatform.tags [ 'ref:' + this.#network ];

		if (
			osmRef && 1 < osmRef.split ( ';' ).length ) {
			theReport.add (
				'p',
				'A platform with more than 1 ref:' + this.#network + 'is found: ' +
                osmRef + ' ' + osmPlatform.tags.name
			);
		}

		osmPlatform.tags [ 'ref:' + this.#network ] =
            theExcludeList.translateOsmRefPlatform ( osmRef );

		let platformRef = osmPlatform.tags [ 'ref:' + this.#network ];
		if ( ! platformRef ) {
			let refCounter = 0;
			let networks = [ 'TECL', 'TECB', 'TECN', 'TECX', 'TECC', 'TECH' ];
			let tmpPlatformRef = null;
			networks.forEach (

				network => {
					if ( osmPlatform.tags [ 'ref:' + network ] ) {
						refCounter ++;
						tmpPlatformRef = osmPlatform.tags [ 'ref:' + network ];
					}
				}
			);
			if ( 1 === refCounter ) {
				platformRef = tmpPlatformRef;
			}
			else {
				platformRef = '????????';
			}
		}
		return platformRef;
	}

	constructor ( osmRoute, osmDataLoader ) {

		this.#network = document.getElementById ( 'osmNetworkSelect' ).value;

		let haveFrom = false;
		osmRoute.members.forEach (
			osmRouteMember => {
				if (
					-1
                    !==
                    [ 'platform', 'platform_entry_only', 'platform_exit_only' ].indexOf (
                    	osmRouteMember.role
                    )
				) {
					let osmPlatform =
                        osmDataLoader.nodes.get ( osmRouteMember.ref )
                        ||
                        osmDataLoader.ways.get ( osmRouteMember.ref );

					let platformRef = this.#getOsmPlatformRef ( osmPlatform );
					this.#platforms += platformRef + ';';
					if ( ! haveFrom ) {
						this.#from = platformRef;
						haveFrom = true;
					}
					this.#to = platformRef;
					this.#platformNames.set (
						platformRef,
						osmPlatform.tags.name || ''
					);
				}
			}
		);
		Object.seal ( this );
	}
}

export default osmTreeRoute;