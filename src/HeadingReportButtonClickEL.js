class HeadingReportButtonClickEL {

	#buttonId;

	static #buttonsId = [];

	#paneId;

	static #panesId = [];

	constructor ( buttonId, paneId ) {
		this.#buttonId = buttonId;
		this.#paneId = paneId;
		HeadingReportButtonClickEL.#buttonsId.push ( buttonId );
		HeadingReportButtonClickEL.#panesId.push ( paneId );
		Object.freeze ( this );
	}

	handleEvent ( ) {

		HeadingReportButtonClickEL.#buttonsId.forEach (
			buttonId => document.getElementById ( buttonId ).classList.remove ( 'selectedPaneButton' )
		);
		document.getElementById ( this.#buttonId ).classList.add ( 'selectedPaneButton' );

		HeadingReportButtonClickEL.#panesId.forEach (
			paneId => document.getElementById ( paneId ).classList.add ( 'hiddenPane' )
		);
		document.getElementById ( this.#paneId ).classList.remove ( 'hiddenPane' );

		if ( 'relationsButton' === this.#buttonId ) { 
			document.getElementById ( 'routesLinks' ).classList.remove ( 'hiddenPane' );
		}
		else {
			document.getElementById ( 'routesLinks' ).classList.add ( 'hiddenPane' );
		}

	}
}

export default HeadingReportButtonClickEL;