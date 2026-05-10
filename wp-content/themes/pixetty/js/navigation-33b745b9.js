/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
(function () {

    document.addEventListener('DOMContentLoaded', function () {

        const siteNavigation = document.querySelectorAll('.main-navigation, .main-navigation-dropdown');

        // Return early if the navigation don't exist.
        if (!siteNavigation) {
            return;
        }

        for (const item of siteNavigation) {
            const menu = item.getElementsByTagName('ul')[0];

            if (!menu) {
                return;
            }

            if (!menu.classList.contains('nav-menu')) {
                menu.classList.add('nav-menu');
            }

            // Remove the .toggled class and set aria-expanded to false when the user clicks outside the navigation.
            document.addEventListener('click', function (event) {
                const isClickInside = item.contains(event.target);

                if (!isClickInside) {
                    item.classList.remove('toggled');
                }
            });

            // Get all the link elements within the menu.
            const links = menu.getElementsByTagName('a');

            // Toggle focus each time a menu link is focused or blurred.
            for (const link of links) {
                link.addEventListener('focus', toggleFocus, true);
                link.addEventListener('blur', toggleFocus, true);
            }

            /**
             * Sets or removes .focus class on an element.
             */
            function toggleFocus() {
                if (event.type === 'focus' || event.type === 'blur') {
                    let self = this;
                    // Move up through the ancestors of the current link until we hit .nav-menu.
                    while (!self.classList.contains('nav-menu')) {
                        // On li elements toggle the class .focus.
                        if ('li' === self.tagName.toLowerCase()) {
                            self.classList.toggle('focus');
                        }
                        self = self.parentNode;
                    }
                }
            }

            // Get all the link elements with children within the menu.

            linksWithChildren = menu.querySelectorAll('.menu-item-has-children > a, .page_item_has_children > a');

            function updateNavigationWithChildren(item) {
                const toggleButton = document.createElement('button');
                toggleButton.classList.add('submenu-toggle');
                toggleButton.innerHTML = '<i class="icon-arrow-down"></i>';

                item.forEach(function (link) {
                    const btn = toggleButton.cloneNode(true);
                    const submenu = link.parentNode.querySelector('.sub-menu');
                    link.parentNode.insertBefore(btn, submenu);

                    btn.addEventListener('click', function (event) {
                        submenu.classList.toggle('opened');
                        btn.classList.toggle('toggled');
                    });
                });
            }

            updateNavigationWithChildren(linksWithChildren);
        }
    });

}());
