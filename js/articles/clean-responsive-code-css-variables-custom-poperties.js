import SideNav from '../side-nav';
import highlight from '../highlight';
import analytics from '../analytics';
import disqus from '../disqus';
import unorphan from 'unorphan';

// Track the page view
analytics('send', 'pageview');

// Put focus in the inner div so ensure keyboard scrolling works
document.querySelector('.focus').focus();

// Initialize the side navigation
let sideNav = new SideNav();

// Ensure no orphan words in the copy
unorphan(document.querySelectorAll('h1, h2, h3, p, figcaption, blockquote'));