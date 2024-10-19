import JosmButtonClickEL from './JosmButtonClickEL.js';

class Report {

	#report;

	close ( ) {
		document.getElementById ( 'waitAnimation' ).style.visibility = 'hidden';
        let josmButtons = document.getElementsByClassName ( 'josmButton' );
        for ( let counter = 0; counter < josmButtons.length; counter ++ ) {
            josmButtons[ counter ].addEventListener ( 'click', new JosmButtonClickEL ( ) );
        }
}

	open ( ) {
		document.getElementById ( 'waitAnimation' ).style.visibility = 'visible';
		this.#report = document.getElementById ( 'report' );
		while ( this.#report.firstChild ) {
			this.#report.removeChild ( this.#report.firstChild );
		}
	}

	add ( htmlTag, text, osmId ) {
		let htmlElement = document.createElement ( htmlTag );
		htmlElement.innerHTML = text + this.getOsmLink ( osmId ) + this.getJosmEdit ( osmId );
		this.#report.appendChild ( htmlElement );
	}

	getJosmEdit ( osmId ) {
		let josmEdit =
            osmId
            	?
            	'<button title="Edit the relation with JOSM\nJOSM must be already opened!" ' +
                'class="josmButton" data-osm-obj-id="' +
                osmId + '" >JOSM </button>'
            	:
            	'';

		return josmEdit;
	}

	getOsmLink ( osmId ) {
		let osmLink =
            osmId
            	?
            	'<a target="_blank" href="https://www.openstreetmap.org/' +
                'relation/' + osmId + '"> relation : ' + osmId + '</a>'
            	:
            	'';

		return osmLink;
	}

	constructor ( ) {

	}
}

const theReport = new Report ( );

export default theReport;