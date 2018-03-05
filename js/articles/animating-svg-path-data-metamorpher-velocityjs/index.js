import SvgIds from 'svg-ids';
import Animation from './animation';
import SideNav from '../../side-nav';
import highlight from '../../highlight';
import analytics from '../../analytics';
import disqus from '../../disqus';
import unorphan from 'unorphan';

// Track the page view
analytics('send', 'pageview');

// Deduplicate internal SVG IDs 
new SvgIds().makeUnique();

// Load the animations and attach event listeners
let animation1 = new Animation('#animation1');
document.querySelector('#animation1 .face').addEventListener('click', animation1.toggleAnimation.bind(animation1));

let interpolation1 = new Animation('#interpolation1');
interpolation1.interpolate(0.5);
let interpolation2 = new Animation('#interpolation2');
interpolation2.interpolate(2);

let singleAnimation = new Animation('#single-animation');
document.querySelector('#single-animation .face').addEventListener('click', () => {
	singleAnimation.animate();
	singleAnimation.emotionIndex = 0;
});

let animationLooped = new Animation('#animation-looped');
document.querySelector('#animation-looped .face').addEventListener('click', animationLooped.toggleAnimation.bind(animationLooped));

let naiveRotation = new Animation('#naive-rotation');
document.querySelector('#naive-rotation .face').addEventListener('click', naiveRotation.naiveRotate.bind(naiveRotation));

let smartRotation = new Animation('#smart-rotation');
document.querySelector('#smart-rotation .face').addEventListener('click', smartRotation.smartRotate.bind(smartRotation));

// Put focus in the inner div so ensure keyboard scrolling works
document.querySelector('.focus').focus();

// Initialize the side navigation
let sideNav = new SideNav();

// Ensure no orphan words in the copy
unorphan(document.querySelectorAll('h1, h2, h3, p, figcaption, blockquote'));