// import {Path, Point} from '../../metamorpher/metamorpher';
import {Path, Point} from 'metamorpher';
import Velocity from 'velocity-animate';

let getPaths = (figure, emotion) => Array.from(document.querySelector(figure).querySelector(emotion).querySelectorAll('path')).map(path => new Path(path));

class Animation {
	constructor(figure) {
		this.figure = figure;
		this.initialPaths = getPaths(this.figure, '.bored')
		this.emotionPaths = [
			getPaths(this.figure, '.bored'),
			getPaths(this.figure, '.happy'),
			getPaths(this.figure, '.silly')
		];

		this.emotionIndex = 0;
		this.animating = false;
		this.animationTimeout;

	}

	animate() {
		let startPaths = this.emotionPaths[this.emotionIndex % this.emotionPaths.length];
		let endPaths = this.emotionPaths[(this.emotionIndex + 1) % this.emotionPaths.length];
		this.emotionIndex++;

		let progress = (elements, complete, remaining, start, tween) => {
			this.initialPaths.forEach((path, index) => {
				path.interpolate(startPaths[index], endPaths[index], tween).paint();
			});
		};

		return Velocity(document.querySelector(this.figure), { tween: 1 }, {
			duration: 600,
			easing: 'easeInOut',
			progress
		}).then(() => {
			if (this.animating) {
				this.animationTimeout = setTimeout(this.animate.bind(this), 400);
			}
		});
	}

	toggleAnimation(method) {
		this.animating = !this.animating;
		if (this.animating) {
			typeof method === 'string' ? this[method]() : this.animate();
		}
		else {
			clearTimeout(this.animationTimeout);
		}
	}

	interpolate(amount) {
		let startPaths = this.emotionPaths[0];
		let endPaths = this.emotionPaths[1];

		this.initialPaths.forEach((path, index) => {
			path.interpolate(startPaths[index], endPaths[index], amount).paint();
		});
	}

	naiveRotate() {
		let startPaths = this.emotionPaths[0];
		let midPoint = new Point(72.5, 65);
		let endPaths = this.emotionPaths[1].map(path => new Path(path).rotate(270, midPoint));

		let progress = (elements, complete, remaining, start, tween) => {
			this.initialPaths.forEach((path, index) => {
				path.interpolate(startPaths[index], endPaths[index], tween).paint();
			});
		};

		return Velocity(document.querySelector('body'), { tween: 1 }, {
			duration: 600,
			easing: 'easeInOut',
			progress
		});
	}

	smartRotate() {
		let midPoint = new Point(72.5, 65);
		let startPaths = this.emotionPaths[0];
		let endPaths = this.emotionPaths[1];

		let progress = (elements, complete, remaining, start, tween) => {
			this.initialPaths.forEach((path, index) => {
				path.interpolate(startPaths[index], endPaths[index], tween).rotate(270 * tween, midPoint).paint();
			});
		};

		return Velocity(document.querySelector('body'), { tween: 1 }, {
			duration: 600,
			easing: 'easeInOut',
			progress
		});
	}
};

export default Animation;