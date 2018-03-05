import SideNav from '../side-nav';
import highlight from '../highlight';
import analytics from '../analytics';
import disqus from '../disqus';

// Track the page view
analytics('send', 'pageview');

// Put focus in the inner div so ensure keyboard scrolling works
document.querySelector('.focus').focus();

// Initialize the side navigation
let sideNav = new SideNav();