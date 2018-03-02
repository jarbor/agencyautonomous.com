
let Path = metamorpher.Path;
let Point = metamorpher.Point;

let getFramePaths = (selector) => {
	let group = document.querySelector(selector);
	let domPaths = group.querySelectorAll('path');
	return Array.from(domPaths).map(path => {
		return new Path(path);
	});
};

let initialPaths = getFramePaths('.bored');
let midPoint = new Point(72.5, 65);
let startPaths = getFramePaths('.bored');
let endPaths = getFramePaths('.happy');
	
let animate = () => {
	let progress = (e, c, r, s, tween) => {
		initialPaths.forEach((path, index) => {
			path
				.interpolate(
					startPaths[index],
					endPaths[index],
					tween
				)
				.rotate(270 * tween, midPoint)
				.paint();
		});
	};

	let element = document.querySelector('body');
	let properties = { tween: 1 };
	let options = {
		duration: 600,
		easing: 'easeInOut',
		progress: progress
	}
	
	return Velocity(element, properties, options);
};

document.querySelector('.face')
	.addEventListener('click', animate);