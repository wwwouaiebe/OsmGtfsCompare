class OsmGtfsComparator {

	#gtfsRouteMaster;

	#osmRouteMaster;

	#testsPassed = [];

	#compareFromToLow ( osmRoute ) {
		let possibleGtfsRoutes = [ ];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if (
					gtfsRoute.from.slice ( 0, -1 ) === osmRoute.from.slice ( 0, -1 )
                    &&
                    gtfsRoute.to.slice ( 0, -1 ) === osmRoute.to.slice ( 0, -1 )
				) {
					possibleGtfsRoutes.push ( gtfsRoute );
 				}
			}
		);
		this.#testsPassed.push (
			'compareFromToLow ' +
             ( 0 === possibleGtfsRoutes.length ? 'failed' : 'passed' )
		);
		return possibleGtfsRoutes;
	}

	#compareFromToHight ( osmRoute ) {
		let possibleGtfsRoutes = [ ];
		this.#gtfsRouteMaster.routes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.from === osmRoute.from && gtfsRoute.to === osmRoute.to ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		this.#testsPassed.push (
			'compareFromToHight ' +
             ( 0 === possibleGtfsRoutes.length ? 'failed' : 'passed' )
		);
		return possibleGtfsRoutes;
	}

	#compareFromTo ( osmRoute ) {
		let possibleGtfsRoutes = this.#compareFromToHight ( osmRoute );
		if ( 0 === possibleGtfsRoutes.length ) {
			possibleGtfsRoutes = this.#compareFromToLow ( osmRoute );
		}
		else {
			this.#comparePlatforms ( osmRoute, possibleGtfsRoutes );
		}
	}

	#comparePlatformsHight ( osmRoute, gtfsRoutes ) {
		let possibleGtfsRoutes = [];
		gtfsRoutes.forEach (
			gtfsRoute => {
				if ( gtfsRoute.platforms === osmRoute.platforms ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		this.#testsPassed.push (
			'comparePlatformsHight ' +
             ( 0 === possibleGtfsRoutes.length ? 'failed' : 'passed' )
		);

		return possibleGtfsRoutes;
	}

	#comparePlatformsLength ( osmRoute, gtfsRoutes ) {
		let possibleGtfsRoutes = [ ];
		let osmRouteSize = osmRoute.platforms.split ( ';' ).length;
		gtfsRoutes.forEach (
			gtfsRoute => {
				if ( osmRouteSize === gtfsRoute.platforms.split ( ';' ).length ) {
					possibleGtfsRoutes.push ( gtfsRoute );
				}
			}
		);
		this.#testsPassed.push (
			'comparePlatformsLength ' +
             ( 0 === possibleGtfsRoutes.length ? 'failed' : 'passed' )
		);
		if ( 0 === possibleGtfsRoutes.length ) {
			console.log ( osmRoute.platforms );
			gtfsRoutes.forEach (
				gtfsRoute => { console.log ( gtfsRoute.platforms ); }
			);
		}
		return possibleGtfsRoutes;
	}

	#comparePlatforms ( osmRoute, gtfsRoutes ) {
		let possibleGtfsRoutes = this.#comparePlatformsLength ( osmRoute, gtfsRoutes );
		if ( 0 !== possibleGtfsRoutes.length ) {
		    possibleGtfsRoutes = this.#comparePlatformsHight ( osmRoute, possibleGtfsRoutes );
		}
		this.#endCompare ( possibleGtfsRoutes );
	}

	#endCompare ( gtfsRoutes ) {
		gtfsRoutes.forEach (
			gtfsRoute => { console.log ( gtfsRoute.name ); }
		);
		this.#testsPassed.forEach (
			testPassed => { console.log ( testPassed ); }
		);

	}

	compareRoutesMaster ( osmRouteMaster, gtfsRouteMaster ) {
		this.#gtfsRouteMaster = gtfsRouteMaster;
		this.#osmRouteMaster = osmRouteMaster;

		this.#osmRouteMaster.routes.forEach (
			osmRoute => {
				console.log ( osmRoute.name );
				this.#testsPassed = [];
				this.#compareFromTo ( osmRoute );
			}
		);
	}

	constructor ( ) {
		Object.freeze ( this );
	}
}

export default OsmGtfsComparator;