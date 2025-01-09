
class DataTree {

	routesMaster = [];

	clear ( ) {
		this.routesMaster = [];
	}

	constructor ( ) {
		Object.seal ( this );
	}
}

export const
	theOsmTree = new DataTree ( ),
	theGtfsTree = new DataTree ( );