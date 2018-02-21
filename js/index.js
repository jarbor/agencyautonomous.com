import {Path, Point} from '../../svg-path-transform/src/svg-path-transform';
// import SvgViewboxMaximize from '../../svg-viewbox-maximize/svg-viewbox-maximize';
import SvgViewboxMaximize from 'svg-viewbox-maximize';
// import ElementCoordinates from '../../element-coordinates/element-coordinates';
import ElementCoordinates from 'element-coordinates';
// import promiseFont from '../../promise-font/promise-font';
import promiseFont from 'promise-font';
import Velocity from './modules/velocity';
// import Velocity from 'velocity';
import Navigo from 'navigo';

let $ = document.querySelector.bind(document);
let $$ = el => Array.from(document.querySelectorAll(el));
let alternator = -1;
let DELTA = 300;
let originalBarPaths;
let originalBackgroundPath;
let easing = 'easeInOutCubic';
let backgroundPath = Path.make($('.background'));
let activeIndicatorPath = Path.make($('.active-indicator')); 

let getActiveLink = (page) => {
	if (!page) {
		page = window.location.pathname.substring(1);
	}
	return $(`.header a[href='/${page}']`);
};

let makeActiveIndicatorPath = (svgElement, link) => {
	let linkCoordinates = new ElementCoordinates(link).contentBox;
	let active = {
		left: svgElement.svgX(linkCoordinates.left),
		right: svgElement.svgX(linkCoordinates.right)
	};

	return Path.make(` M ${active.left} 0 L ${active.right} 0 L ${active.right} 2 L ${active.left} 2 L ${active.left} 0 Z `);
};

let moveActiveIndicator = (page) => {
	let link = getActiveLink(page);
	let startPath = Path.make(activeIndicatorPath);
	let endPath = makeActiveIndicatorPath(activeTrackerSvg, link);

	let progress = (elements, complete, remaining, start, tween) => {
		activeIndicatorPath.interpolate(startPath, endPath, tween).paint();
	};

	return Velocity($('.header'), { tween: 1 }, {
		duration: 600,
		easing,
		progress
	});
};

let toggleOpen = () => Promise.resolve().then(() => {
	$('body').classList.toggle('open');
});

let isOpen = () => $('body').classList.contains('open');

let makeBackgroundPath = (svgElement, isOpen) => {
	let s = svgElement.current;
	let background = ` M ${s.left} ${s.top} L ${s.left} ${s.bottom} L ${s.right} ${s.bottom} L ${s.right} ${s.top} L ${s.left} ${s.top} `;
	let left;
	let right;

	if (isOpen) {
		let midX = s.width / 2 + s.left;
		let r = svgElement.rectangle($('.body'));
		left = ` M ${r.left} ${r.bottom} L ${r.left} ${r.top} L ${midX} ${r.top} L ${midX} ${r.bottom} L ${r.left} ${r.bottom} `;
		right = ` M ${r.right} ${r.bottom} L ${r.right} ${r.top} L ${midX} ${r.top} L ${midX} ${r.bottom} L ${r.right} ${r.bottom} `;
	}
	else {
		left = ` M 84.5 412.554 L 84.5 55.541 L 88.5 55.541 L 88.5 412.554 L 84.5 412.554 `;
		right = ` M 195.351 412.545 L 195.351 55.548 L 191.351 55.548 L 191.351 412.545 L 195.351 412.545 `;
	}

	return Path.make(background+left+right+' Z ');
}

let toggleCover = () => {

	alternator *= -1;

	let animateSwords = () => {
		let paths = [
			Path.make($('.top-left')),
			Path.make($('.top-right')),
			Path.make($('.bottom-left')),
			Path.make($('.bottom-right'))
		];
		let startPaths = paths.map(Path.make);
		let endPaths = paths.map((path, index) => {
			let direction = (index%2 ? 1 : -1) * alternator;
			return Path.make(path).detach().translate(direction * DELTA, direction * DELTA * path.longestEdge.angle)
		});

		let progress = (elements, complete, remaining, start, tween) => {
			paths.forEach((path, index) => {
				path.interpolate(startPaths[index], endPaths[index], tween).paint();
			});
		};

		return Velocity($('.cover'), { tween: 1 }, {
			duration: 600,
			easing,
			progress
		});
	};

	let fadeContent = () => Velocity($('.content'), { opacity: alternator > 0 ? 1 : 0 }, {
		duration: 100,
		delay: alternator > 0 ? 0 : 500,
		easing
	});

	let fadeHeader = () => Velocity($('.header'), { opacity: alternator > 0 ? 1 : 0 }, {
		duration: 600,
		easing
	});

	let fadeFooter = () => Velocity($('.footer'), { opacity: alternator > 0 ? 1 : 0 }, {
		duration: 600,
		easing
	});

	let fadeAgency = () => Velocity($('path.agency'), { opacity: alternator < 0 ? 1 : 0 }, {
		duration: 600,
		easing
	});

	let fadeAutonomous = () => Velocity($('path.autonomous'), { opacity: alternator < 0 ? 1 : 0 }, {
		duration: 600,
		easing
	});

	let animateMiddle = () => {

		if (originalBackgroundPath === undefined) {
			originalBackgroundPath = Path.make(backgroundPath);
		}

		let startPath = Path.make(backgroundPath);
		let endPath;

		if (alternator > 0) {
			endPath = Object.values(makeBackgroundPath(coverSvg, true));
		}
		else {
			endPath = originalBackgroundPath;
		}

		let progress = (elements, complete, remaining, start, tween) => {
			backgroundPath.interpolate(startPath, endPath, tween).paint();
		};

		return Velocity($('.background'), { tween: 1 }, {
			duration: 600,
			easing,
			progress
		});
	};

	let toggleContent = () => Promise.all([
		fadeHeader(),
		fadeFooter(),
		fadeAgency(),
		fadeAutonomous(),
		fadeContent(),
		animateMiddle()
	]);

	return alternator > 0
		? animateSwords()
			.then(toggleContent)
			.then(toggleOpen)
		: toggleOpen()
			.then(toggleContent)
			.then(animateSwords)
	;
};

// Ensure the SVGs are always maximized to their containers
let coverSvg = new SvgViewboxMaximize({
	element: $('.cover svg.logo'),
	// container: $('.cover'),
	resized: function() {
		let path = makeBackgroundPath(this, isOpen());
		backgroundPath.transform(path).paint();
	}
});

let activeTrackerSvg = new SvgViewboxMaximize({
	element: $('.header svg'),
	// container: $('.header svg'),
	resized: function() {
		let link = getActiveLink();
		if (link) {
			let path = makeActiveIndicatorPath(this, link);
			activeIndicatorPath.transform(path).paint();
		}
	}
});

// Resize the active indicator after the font completes loading
promiseFont('Archivo Narrow').then(() => {
	let link = getActiveLink();
	if (link) {
		let path = makeActiveIndicatorPath(activeTrackerSvg, link);
		activeIndicatorPath.transform(path).paint();
	}
});

// Attach the router
let router = new Navigo(window.location.origin);
router.on({
	'/': () => {
		console.log('Navigating to: /');
		if (isOpen()) {
			toggleCover();
		}
	},
	'/:page': ({page}) => {

		console.log('Navigating to: /'+ page);

		moveActiveIndicator(page);

		if (!isOpen()) {
			toggleCover();
		}

		// Show the correct page
		$('body').setAttribute('data-active-page', page);

		// Scroll to top
		$('.body').scrollTop = 0;

		// Put focus in the inner div so ensure keyboard scrolling works
		$('.focus').focus();
	}
}).resolve();