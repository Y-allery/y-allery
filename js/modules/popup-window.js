import {fadeIn, fadeOut} from './helpers';

export default class Popup {
	constructor() {
		this.body = document.querySelector('body');
		this.html = document.querySelector('html');
		this.callbackOpenPopup = '';
	}



	/**
	 * Force Close All opened popup window
	 * and clear the traces of an opened popup window
	 */
	forceCloseAllPopup() {
		[...document.querySelectorAll('.popup-page')].forEach( (item) => {
			fadeOut( item );

			const MAIL_SENT_OK_BOX = item.querySelector('.wpcf7-mail-sent-ok');
			if ( MAIL_SENT_OK_BOX ) {
				MAIL_SENT_OK_BOX.style.display = 'none';
			}

		});

		this.body.classList.remove('popup-opened');
		this.html.classList.remove('popup-opened');
	}



	/**
	 * Open selected popup window
	 * @param popupSelector - css selector of popup that should be opened
	 * @param timeOut - ms
	 */
	openOnePopup(popupSelector = null, timeOut = 1000) {
		this.forceCloseAllPopup();

		setTimeout( () => {
			this.body.classList.add('popup-opened');
			this.html.classList.add('popup-opened');

			fadeIn(document.querySelector(popupSelector));
		}, timeOut);
	}



	/**
	 * Opening popup window
	 */
	openPopup() {

		this.body.addEventListener('click', (event) => {

			if ( ![...event.target.classList].includes('js-open-popup-activator') ) {
				return false;
			}

			event.preventDefault();

			(this.callbackOpenPopup) && this.callbackOpenPopup(event);

			let el_href = ( event.target.nodeName === 'A' )
								? event.target.getAttribute('href')
								: event.target.dataset.href;

				//console.log(el_href);				

			const POPUP_ELEMENT      = document.querySelector(el_href);
			//const POPUP_FORM_SUBJECT = POPUP_ELEMENT.querySelector('form input.subject');


			// if ( POPUP_FORM_SUBJECT ) {
			// 	POPUP_FORM_SUBJECT.value = event.target.dataset.subject;
			// }

			this.body.classList.add('popup-opened');
			this.html.classList.add('popup-opened');

			//console.log('POPUP_ELEMENT', POPUP_ELEMENT);

			fadeIn( POPUP_ELEMENT );

			//POPUP_FORM_INPUT && POPUP_FORM_INPUT.focus();
		});

	}



	/**
	 * Closing popup window
	 */
	closePopup() {
		this.body.addEventListener('click', (event) => {

			// Check if user click on close element
			if ( ![...event.target.classList].includes('js-popup-close') ) {
				return false;
			}
			//console.log(event);

			event.preventDefault();
			this.forceCloseAllPopup();

		});


		// Checking ESC button for closing opened popup window
		document.addEventListener('keydown', (event) => {
			if( event.keyCode === 27 ) {
				this.forceCloseAllPopup();
			}
		});

	}


	init(callbackOpenPopup = '') {
		this.callbackOpenPopup = callbackOpenPopup;
		this.openPopup();
		this.closePopup();
	}
}
