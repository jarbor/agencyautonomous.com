
let Path = metamorpher.Path;

let getFramePaths = (selector) => {
	let group = document.querySelector(selector);
	let domPaths = group.querySelectorAll('path');
	return Array.from(domPaths).map(path => {
		return new Path(path);
	});
};

let initialPaths = getFramePaths('.bored');
let keyFramePaths = [
	getFramePaths('.bored'),
	getFramePaths('.happy'),
	getFramePaths('.silly')
];
let currentFrame = 0;
let animating = false;
let animationTimeout;
	
let animate = () => {
	let startPaths = keyFramePaths[currentFrame % keyFramePaths.length];
	let endPaths = keyFramePaths[(currentFrame + 1) % keyFramePaths.length];
	currentFrame++;

	let progress = (e, c, r, s, tween) => {
		initialPaths.forEach((path, index) => {
			path.interpolate(startPaths[index], endPaths[index], tween).paint();
		});
	};

	let element = document.querySelector('body');
	let properties = { tween: 1 };
	let options = {
		duration: 600,
		easing: 'easeInOut',
		progress: progress
	}
	
	return Velocity(element, properties, options).then(() => {
		if (animating) {
			animationTimeout = setTimeout(animate, 400);
		}
	});
};

let toggleAnimation = (method) => {
	animating = !animating;
	if (animating) {
		animate();
	}
	else {
		clearTimeout(animationTimeout);
	}
};

document.querySelector('.face')
	.addEventListener('click', toggleAnimation);