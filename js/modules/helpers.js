import smoothscroll from 'smoothscroll-polyfill';

// kick off the polyfill!
smoothscroll.polyfill();

/**
 * Fade Out method
 * @param el
 */
export function fadeOut(el){

	if ( !el ) {
		throw Error('"fadeOut function - "You didn\'t add required parameters');
	}

	el.style.opacity = 1;

	(function fade() {
		if ((el.style.opacity -= .1) < 0) {
			el.style.display = "none";
		} else {
			requestAnimationFrame(fade);
		}
	})();
}



/**
 * Fade In method
 * @param el      - element that need to fade in
 * @param display - display variant
 */
export function fadeIn(el, display) {

	if ( !el ) {
		throw Error('"fadeIn function - "You didn\'t add required parameters');
	}

	el.style.opacity = 0;
	el.style.display = display || "block";

	(function fade() {
		let val = parseFloat(el.style.opacity);
		if (!((val += .1) > 1)) {
			el.style.opacity = val;
			requestAnimationFrame(fade);
		}
	})();
}



/**
 *  Set equal height to selected elements calculated as bigger height
 * @param elementsSelector    - selector for searching elements
 * @returns elementsSelector
 */
export function equalHeights(elementsSelector) {

	if ( !elementsSelector ) {
		throw Error('"equalHeights function - "You didn\'t add required parameters');
	}

	let heights = [];
	let elementsSelectorArr = ( Array.isArray(elementsSelector) )
									? elementsSelector
									: [...document.querySelectorAll(elementsSelector)];

	elementsSelectorArr.forEach( (item) => {
		heights.push( item.offsetHeight );
	});

	let maxHeight = Math.max.apply(0, heights);

	elementsSelectorArr.forEach( (item) => {
		item.style.height = maxHeight+'px';
	});

	return elementsSelector;

}


/**
 * Set equal height to selected elements in row calculated as bigger height
 * @param elementsSelector - selector for searching elements
 * @param numItem_inrow    - Items amount that will be used for each equal height iteration
 * @returns elementsSelector
 */
export function equalHeights_inrow(elementsSelector, numItem_inrow) {

	if ( !elementsSelector || !numItem_inrow ) {
		throw Error('"equalHeights_inrow function - "You didn\'t add required parameters');
	}

	const ELEMENTS_ARR = [...document.querySelectorAll(elementsSelector)];
	const EL_LENGTH    = ELEMENTS_ARR.length;

	for (let i = 0; i <= EL_LENGTH / numItem_inrow; i++) {
		let temp = ELEMENTS_ARR.slice(i * numItem_inrow, i * numItem_inrow + numItem_inrow);
		equalHeights(temp);
	}

	return elementsSelector;
}


/**
 * Get cookie value by it's name
 * @param cookieName
 * @returns {*}
 */
export function getCookieByName(cookieName) {

	if ( !cookieName ) {
		throw Error('"getCookieByName function - "You didn\'t add cookieName');
	}

	let name          = cookieName + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca            = decodedCookie.split(';');

	for ( let i = 0; i <ca.length; i++ ) {
		let c = ca[i];

		while ( c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if ( c.indexOf(name) === 0 ) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}



/**
 * Trim all paragraph from unneeded space symbol
 */
export function trimParagraph(){
	[...document.querySelectorAll('p')].forEach( item => {
		item.innerHTML = item.innerHTML.trim();
	});
}


/**
 * Check if element in viewport
 * @param el
 * @param offset - Adjustable offset value when element becomes visible
 * @returns {boolean}
 */
export function isInViewport(el, offset = 100) {

	if ( !el ) {
		throw Error('"isInViewport function - "You didn\'t add required parameters');
	}

	const scroll    = window.scrollY || window.pageYOffset;
	const boundsTop = el.getBoundingClientRect().top + offset + scroll;

	const viewport = {
		top   : scroll,
		bottom: scroll + window.innerHeight,
	};

	const bounds = {
		top   : boundsTop,
		bottom: boundsTop + el.clientHeight,
	};

	return ( bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom )
		|| ( bounds.top <= viewport.bottom && bounds.top >= viewport.top );

}



/**
 * Check if element has reached top of page and make element fixed
 * @param el           - parent which contain future fixed element
 * @param innerElement - child which should be fixed
 * @param offset       - Adjustable offset value when element becomes visible
 * @returns {boolean}
 */
export function isBoxReachedTopOfPage(el, innerElement, offset = 0) {

	if ( !el ) return false;

	const scroll                = window.scrollY || window.pageYOffset;
	const INITIAL_BOTTOM_OFFSET = innerElement.clientHeight + el.getBoundingClientRect().top + 2*offset + scroll;
	innerElement.dataset.bottom_offset = INITIAL_BOTTOM_OFFSET;

	const bounds = {
		top   : el.getBoundingClientRect().top + offset + scroll,
		bottom: ( innerElement.dataset.bottom_offset )
					? innerElement.dataset.bottom_offset
					: INITIAL_BOTTOM_OFFSET,
		left  : el.getBoundingClientRect().left,
	};

	if ( scroll >= bounds.top ) {
		innerElement.style.left = `${innerElement.dataset.left}px`;
		el.classList.add('fixed');

		if ( scroll >= bounds.bottom ) {
			el.classList.add('fixed-to-bottom');
		} else {
			el.classList.remove('fixed-to-bottom');
		}

		return true;
	} else {
		innerElement.dataset.left = bounds.left;
		el.classList.remove('fixed');
		return false;
	}
}



/**
 * Lazy load init
 */
export function lazyLoadInit(selector){
	return new LazyLoad({
		elements_selector: selector
		// ... more custom settings?
	});
}




/**
 * Debounce function
 * @param fn     - function that should be executed
 * @param time   - time delay
 * @returns {Function}
 */
export const debounce = (fn, time = 1000) => {

	if ( !fn ) {
		throw Error('"debounce function - "You didn\'t add required parameters');
	}

	let timeout;

	return function() {
		const functionCall = () => fn.apply(this, arguments);

		clearTimeout(timeout);
		timeout = setTimeout(functionCall, time);
	}
};


/**
 * Copy to clipboard
 * @param element -  element that  contain value to copy
 */
export const copyToClipboard = (parent,  element) => {

	if ( !parent || !element ) {
		throw Error('"copyToClipboard function - "You didn\'t add required parameters');
	}

	const el = document.createElement('textarea');
	el.value = element.value;
	document.body.appendChild(el);
	el.select();

	try {
		const successful = document.execCommand('copy');

		if ( successful ) {
			parent.classList.add('copied');

			setTimeout( () => {
				parent.classList.remove('copied');
			}, 3000 );
		}
	} catch(err) {
		console.log('Oops, unable to copy');
	}

	document.body.removeChild(el);
};


/**
 * Test value with regex
 * @param {(name|email|phone|postal)} fieldType  - The allowed type of the fields
 * @param value
 * @return {boolean}
 */
export const validateField = (fieldType = null, value = null) => {
	const phoneREGEX  = /^[0-9\+]{6,13}$/;
	const nameREGEX   = /^[a-zA-Zа-яА-Я\s]{2,30}$/;
	const postalREGEX = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
	const emailREGEX  = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	const dummyREGEX  = /^.+$/;

	let checkResult   = false;

	switch (fieldType) {
		case 'name':
			checkResult = nameREGEX.test(value);
			break;
		case 'phone':
			checkResult = phoneREGEX.test(value);
			break;
		case 'postal':
			checkResult = postalREGEX.test(value);
			break;
		case 'email':
			checkResult = emailREGEX.test(value);
			break;
		case 'price':
			checkResult = dummyREGEX.test(value);
			break;
		case 'aim':
			checkResult = dummyREGEX.test(value);
			break;
		case 'date':
			checkResult = dummyREGEX.test(value);
			break;
		case 'subject':
			checkResult = dummyREGEX.test(value);
			break;
	}

	return checkResult;

};


/**
 * Polyfill for closest method
 */
export function closest_polyfill() {
	if (window.Element && !Element.prototype.closest) {
		Element.prototype.closest =
			function(s) {
				let matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i,
					el = this;
				do {
					i = matches.length;
					while (--i >= 0 && matches.item(i) !== el) {};
				} while ((i < 0) && (el = el.parentElement));
				return el;
			};
	}
}

/**
 * Smooth scroll to element on page
 * @param elementsSelector string -- css selector (anchor links)
 * @param callback function       -- callback for some additional actions
 */
export function anchorLinkScroll(elementsSelector, callback = '') {

	if ( !elementsSelector ) {
		throw Error('"anchorLinkScroll function - "You didn\'t add correct selector for anchor links');
	}

	const elements = document.querySelectorAll(elementsSelector);

	(elements) && [...elements].forEach( link => {

		link.addEventListener('click', (event) => {
			event.preventDefault();

			let el_href = ( event.target.nodeName === 'A' )
								? event.target.getAttribute('href')
								: event.target.dataset.href;

			const ANCHOR_ELEMENT = document.querySelector(el_href);

			(ANCHOR_ELEMENT) && window.scroll({
				'behavior': 'smooth',
				'left'    : 0,
				'top'     : ANCHOR_ELEMENT.offsetTop
			});


			if (callback) callback();

		});

	});

}

/**
 * When the mobile device, download all content 
 * @param - storage -- all content from file content.js
 */
export const callbackMobilePage 	= (event, storage) =>{

	const MOBILE_CONTENT_PAGE 		= document.querySelector('.js-mobile-page-content');

	// clear the variables
	MOBILE_CONTENT_PAGE.innerHTML 	= '';

	// track the event of clicking on the menu link and take your data-object-id
	const ARTICLE_KEY   			= event.target.dataset.objectId;
	
	// read information from a variables storage (all content (import in file - customization.js from contengt.js) by key)
	const ARTICLE_PAGES = storage[ARTICLE_KEY]?.page;

	// check for emptiness
	if(isEmpty(ARTICLE_PAGES)) return;

	// read all information, if key has a few pages, they are added
	for (let key in ARTICLE_PAGES) {
		//MOBILE_CONTENT_PAGE.innerHTML 	+= storage[ARTICLE_KEY].page?.[`${key}`];
		MOBILE_CONTENT_PAGE.innerHTML += ARTICLE_PAGES.[`${key}`];
	}
}

/**
 * function added pages, when in key - 'page' (content.js), the number of pages is more than 2  
 *  
 * @param - storage -- all content from file content.js
 */
export const callbackFartherPage 	= (event, storage) =>{

	const CONTENT_PAGE_LEFT 		= document.querySelector('.js-page-content-left');
	const CONTENT_PAGE_RIGHT 		= document.querySelector('.js-page-content-right');

	const ARTICLE_KEY   			= event.target.dataset.articleId;
	let lastOpened 					= event.target.dataset.lastOpened;
	

	CONTENT_PAGE_LEFT.innerHTML 	= storage[ARTICLE_KEY].page?.[`page${++lastOpened}`];
	CONTENT_PAGE_RIGHT.innerHTML 	= storage[ARTICLE_KEY].page?.[`page${++lastOpened}`];

	CONTENT_PAGE_RIGHT.innerHTML   += print_btn_book();
}

/**
 * When the desktop, download all content 
 * 
 */
export const callbackPopupPage 		= (event, storage) => {


	// Variables where all main content is loaded
	// CONTENT_PAGE_LEFT - content on the left side
	// CONTENT_PAGE_RIGHT - content on the right side
	const CONTENT_PAGE_LEFT 			= document.querySelector('.js-page-content-left');
	const CONTENT_PAGE_RIGHT 			= document.querySelector('.js-page-content-right');

	// clear the variables
	CONTENT_PAGE_LEFT.innerHTML 		= '';
    CONTENT_PAGE_RIGHT.innerHTML 		= '';

    // variables page count
    let lastOpened = 0;
    
	const ARTICLE_KEY   				= event.target.dataset.objectId;
	const ARTICLE_PAGES 				= storage[ARTICLE_KEY]?.page;

	//check for content on the page
	if(isEmpty(ARTICLE_PAGES)) return;

	// if there is content
	if(ARTICLE_PAGES){

		//if there is only one page
		//on the left side we post content
		CONTENT_PAGE_LEFT.innerHTML 	= storage[ARTICLE_KEY].page?.['page1'];

		// and on the right side the button (book)
		if(isEmpty(storage[ARTICLE_KEY].page?.['page2'])) {

			CONTENT_PAGE_RIGHT.innerHTML += print_btn_book();
			return;
		}
		// placing content on the right side 
    	CONTENT_PAGE_RIGHT.innerHTML 	  = storage[ARTICLE_KEY].page?.['page2'];

    	// we assign the counter 2, two pages are full
    	lastOpened = 2;

	}

	// if pages more 2, on the right side add button (farther)
	if(Object.keys(ARTICLE_PAGES).length>2){

    		CONTENT_PAGE_RIGHT.innerHTML  += print_btn_farther(ARTICLE_KEY, lastOpened);

    }
    else{
    	// if two pages, on the right side add button (book)
    		CONTENT_PAGE_RIGHT.innerHTML  += print_btn_book();
    }
    //console.log('lastOpened',lastOpened);
}

/**
 * function add button book, on desktop`s, on the right side
 * 
 */
export const print_btn_book = ()=>{
	return `<div class="wrapper-btn-book">
				<button data-href="#popup-form" class="btn-book js-open-popup-activator">
					 Замовити
				</button>
			</div>`;
}

/**
 * function checks for emptiness
 * @param    - val -- element selector
 * return    - bool
 */
export const isEmpty = (val) => {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}



/**
 * function add item in popup menu
 * @param 	- name 		-- key 'name' in content.js
 * @param 	- index 	-- main key in content_data (content.js), example 'article1, article2 ...'
 * @param 	- dataHref  -- specify in which popup menu to print the menu (#mobile-popup-page or #popup-page)
 * return   - html tag  -- item menu
 */
export const  print_link = (name,index, dataHref) => {
	return `<li class="popup-menu-new__item">
			<button data-href="${dataHref}" 
					data-role="link-menu" 
					data-object-id="${index}" 
					class="js-link-menu js-open-popup-activator">
				${name}
			</button>
		</li>`
}

/**
 * function add button 'farther' on the right side, added only if there are more then 2 pages
 * @param 		- articleId	 -- main key in content_data (content.js), example 'article1, article2 ...'
 * @param  		- lastOpened -- counter pages
 * return   	- html tag   -- button
 */
export const print_btn_farther = (articleId, lastOpened) => {
	return `<div class="wrapper-btn-farther">
				<button data-href="#popup-page" 
						data-role="btn-farther" 
						data-last-opened="${lastOpened}" 
						data-article-id="${articleId}" 
						class="btn-farther js-btn-farther">
					Далі
				</button>
			</div>`;
}	

/**
 * function print menu
 * @param 			- dataHref -- specify in which popup menu to print the menu (#mobile-popup-page or #popup-page)
 * @param 			- content_data -- all content from file content.js
 * return   		- array
 */
export const print_menu = (dataHref, content_data) => {
	let index = 1;
	let templates = '';
	for (let key in content_data) {
		let template = print_link(content_data[key]["name"], key, dataHref);
		index++;
		templates += template;
	}
	
	return templates;
}






