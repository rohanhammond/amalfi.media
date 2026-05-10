(function ($) {
    'use strict';

    const cart = $('.mpa-cart');

    cart.on('click', '.item-toggle', function (e) {
        $(this).closest('.mpa-cart-item').toggleClass('opened');
    });

    let rightSidebar = $('#right-sidebar');
    let rightSidebarOpen = $('.right-sidebar-toggle, .rsidebar-open');
    let rightSidebarClose = $('#rsidebar-close');

    rightSidebarOpen.add(rightSidebarClose).on('click', function (e) {
        e.preventDefault();

        rightSidebar.toggleClass('opened');
        $('body').toggleClass('rsidebar-opened');
    })

    function dropdownMenuHeight() {
        let headerHeight = $('.site-header').innerHeight();
        let windowHeight = $(window).height();
        let sidebarHeight = $('#wpadminbar').height();
        let contentHeight = windowHeight - headerHeight - sidebarHeight;

        if (screen.width > 991) {
            $('.header-sidebar-inner').css('height', contentHeight);
        } else {
            $('.header-menus').css('height', contentHeight);
        }
    }

    let menuToggle = $('#header-toggle-button');
    let menuHolder = $('#masthead .header-menus');
    let siteHeader = $('#masthead');

    menuToggle.on('click', function (event) {
        event.preventDefault();
        menuToggle.toggleClass('is-active');
        menuHolder.toggleClass('is-opened');
        siteHeader.toggleClass('dropdown-opened');
        $('body').toggleClass('dropdown-opened');
        dropdownMenuHeight();
    });

    $(window).on('resize', function () {
        dropdownMenuHeight();

        if (screen.width > 991) {
            $('.header-menus').css('height', '');
        }
    });

    if (screen.width > 991) {
        let servicesList = $('.mpa-services-list-shortcode .mpa-grid-columns-1');
        let serviceInfoWrapper = servicesList.find('.service-list-item-info-wrap');
        servicesList.find('.service-list-item-info-wrap').first().parent().addClass('thumbnail-active');

        serviceInfoWrapper.on('mouseenter', function () {
            servicesList.find('.mpa-loop-post-wrapper').removeClass('active thumbnail-active');
            $(this).parent().addClass('active');
        });

        servicesList.on('mouseleave', function (e) {
            servicesList.find('.mpa-loop-post-wrapper').removeClass('active');
            servicesList.find('.service-list-item-info-wrap').first().parent().addClass('thumbnail-active');
        });
    }

    $('.scroll-to-top').on("click", function () {
        $("html, body").animate({scrollTop: 0}, 500);
    });

    $('a[href*=#]:not([href=#]').on("click", function (e) {
        let anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 800);
        e.preventDefault();
    });

    function setupNavMenuWidget() {
        var widget = $('.widget_nav_menu, .widget_pages'),
            widgetLinksWithChildren = widget.find('.menu-item-has-children > a, .page_item_has_children > a'),
            toggleButton = $('<button/>', {
                'class': 'submenu-toggle',
                'html': '<svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg">' +
                    '<path d="M1.41 0L6 4.59L10.59 0L12 1.42L6 7.42L0 1.42L1.41 0Z" />' +
                    '</svg>'
            });

        widgetLinksWithChildren.after(toggleButton);

        widget.on('click', '.submenu-toggle', function (e) {
            $(this).next('.sub-menu, .children').toggleClass('opened')
            $(this).toggleClass('toggled')
        });
    }

    setupNavMenuWidget();
})(jQuery);
