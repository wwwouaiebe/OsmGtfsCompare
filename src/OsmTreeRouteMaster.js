import OsmTreeRoute from './OsmTreeRoute.js';

class OsmTreeRouteMaster {

	#ref = '';

	#name = '';

	#id = '';

	#description = '';

	#routes = [];

	get ref ( ) { return this.#ref; }

	get name ( ) { return this.#name; }

	get id ( ) { return this.#id; }

	get description ( ) { return this.#description; }

	get routes ( ) { return this.#routes; }

	constructor ( osmRouteMaster, osmDataLoader ) {

		this.#ref = osmRouteMaster.tags.ref;

		this.#name = osmRouteMaster.tags.name;

		this.#id = osmRouteMaster.id;

		this.#description = osmRouteMaster.tags.description;

		osmRouteMaster.members.forEach (
			osmRouteMasterMember => {
				let osmRoute = osmDataLoader.routes.get ( osmRouteMasterMember.ref );
				let osmTreeRoute = new OsmTreeRoute ( osmRoute, osmDataLoader );
				this.#routes.push ( osmTreeRoute );
			}
		);

		Object.seal ( this );
	}
}

export default OsmTreeRouteMaster;