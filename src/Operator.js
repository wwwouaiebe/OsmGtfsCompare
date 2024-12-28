class Operator {

	#jsonOperator = {};

	get mySqlDbName ( ) { return this.#jsonOperator.mySqlDbName; }

	get gtfsDirectory ( ) { return this.#jsonOperator.gtfsDirectory; }

	get operator ( ) { return this.#jsonOperator.operator; }

	get osmOperator ( ) { return this.#jsonOperator.osmOperator; }

	get networks ( ) { return this.#jsonOperator.networks; }

	async loadData ( operator ) {

		let fileName = '../operators/' + operator.toLowerCase ( ) + '.json';

		let success = false;
		await fetch ( fileName )
			.then (
				response => {
					if ( response.ok ) {
						return response.json ( );
					}
					console.error ( String ( response.status ) + ' ' + response.statusText );
					return false;
				}
			)
			.then (
				jsonResponse => {
					if ( jsonResponse ) {
						this.#jsonOperator = jsonResponse;
						success = true;
					}
				}
			)
			.catch (
				err => {
					console.error ( err );
				}
			);
		return success;
	}

	constructor ( ) {
		Object.freeze ( this );
	}

}

const theOperator = new Operator ( );

export default theOperator;