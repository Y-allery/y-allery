import { debounce } from './modules/helpers.js';

(() => {
	window.addEventListener( 'DOMContentLoaded', ( event ) => {

		// boxs animation
		new cbpScroller( document.getElementById( 'wrapper' ) );

		//image swap selectors
		const galleryImageSix = document.querySelector( '.gallery-item-6 img' );
		const galleryImageOne = document.querySelector( '.gallery-item-1 img' );

		const galleryImageSixSrc = (galleryImageSix) && galleryImageSix.dataset.src;
		const galleryImageOneSrc = (galleryImageOne) && galleryImageOne.dataset.src;

		const mobileDevice = ( firstImage, secondImage,
		                       firstImageSrc, secondImageSrc ) => {
			firstImage.setAttribute( 'src', secondImageSrc );
			secondImage.setAttribute( 'src', firstImageSrc );
		}
		const desktopDevice = ( firstImage, secondImage,
		                        firstImageSrc, secondImageSrc ) => {
			firstImage.setAttribute( 'src', firstImageSrc );
			secondImage.setAttribute( 'src', secondImageSrc );
		}
		const mobileOrDesktop = () => {
			if ( window.innerWidth > 768 ) {
				desktopDevice( galleryImageSix, galleryImageOne,
					galleryImageSixSrc, galleryImageOneSrc );
			} else {
				mobileDevice( galleryImageSix, galleryImageOne,
					galleryImageSixSrc, galleryImageOneSrc );
			}
		}

		//mobileOrDesktop();

		document.addEventListener( 'resize', debounce( () => {
			mobileOrDesktop();
		}, 100 ) );

	} );
})();


