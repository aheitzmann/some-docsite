( function( $ ) {
	'use strict';

	/**
	 * Hamburger icon toggle
	 */
	$( '.js-hamburger-icon' ).on( 'click', function() {
		$( '.js-hamburger-icon' ).toggleClass( 'is-active' );
	} );

	/**
	 * Offcanvas toggle
	 */
	$( '.js-offcanvas-toggle' ).on( 'click', function() {
		$( '.c-offcanvas' ).toggleClass( 'is-active' );
		$( '.js-logo' ).toggleClass( 'u-text-gray-300' );
	} );

	/**
	 * Post content manipulations
	 */
	$( document ).ready( function() {
		$( '.js-post' ).find( 'table' ).wrap( '<div class="o-responsive-table"></div>' );
	} );

	/**
	 * Knewton Slider
	 */
	$( function() {
		var current = 0;

		var panes = [
			'learner',
			'partner-applications',
			'knewton-api',
			'knewton-platform',
			'knowledge-graph',
			'accounts',
			'registrations',
			'goals',
			'events',
			'recommendations',
			'analytics'
		];

		$( '.pane', $( '#how-knewton-works-slider-content' ) ).on( 'click', function() {
			$( '.pane', $( '#how-knewton-works-slider-content' ) ).removeClass( 'active' );
			$( '.toggle-subcaption' ).removeClass( 'active' );
			$( this ).addClass( 'active' );
			current = panes.indexOf( $( this ).attr( 'id' ).replace( 'pane-', '' ) );

			if ( current === 3 ) {
				current++;
				$( '.caption-' + panes[ current ] ).addClass( 'active' );
				$( '#toggle-subcaption-' + panes[ current ] ).addClass( 'active' );
			}

			showCaption( current );
		} );

		$( '.toggle-subcaption' ).on( 'click', function( e ) {
			$( '.toggle-subcaption' ).removeClass( 'active' );
			$( this ).addClass( 'active' );
			$( '.pane' ).removeClass( 'active' );
			$( '#pane-knewton-platform' ).addClass( 'active' );
			current = panes.indexOf( $( this ).attr( 'id' ).replace( 'toggle-subcaption-', '' ).trim() );
			
			showCaption( current );
			e.stopPropagation();
		} );

		$( '#next-pane' ).on( 'click', function() {
			current++;
			if ( current > panes.length - 1 ) {
				current = 0;
			}

			$( '.pane', $( '#how-knewton-works-slider-content' ) ).removeClass( 'active' );
			$( '.toggle-subcaption' ).removeClass( 'active' );

			var showPane = current > 3 ? 3 : current;
			$( '#pane-' + panes[ showPane ] ).addClass( 'active' );

			if ( current === 3 ) {
				current = 4;
			}

			if ( current >= 4 ) {
				$( '#toggle-subcaption-' + panes[ current ] ).addClass( 'active' );
			}

			showCaption( current );
		} );

		$( '#prev-pane' ).on( 'click', function() {
			current--;
			if ( current < 0 ) {
				current = panes.length - 1;
			}

			$( '.pane', $( '#how-knewton-works-slider-content' ) ).removeClass( 'active' );
			$( '.toggle-subcaption' ).removeClass( 'active' );

			if ( current === 3 ) {
				current = 2;
			}

			var showPane = current > 3 ? 3 : current;
			$( '#pane-' + panes[ showPane ] ).addClass( 'active' );

			if ( current >= 4 ) {
				$( '#toggle-subcaption-' + panes[ current ] ).addClass( 'active' );
			}

			showCaption( current );
		} );

		function showCaption( index ) {
			$( '.caption' ).removeClass( 'active' );
			$( '#caption-' + panes[ index ] ).addClass( 'active' );
		}

		current = 0;
		showCaption( current );
	} );
}( jQuery ) );
