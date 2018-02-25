// import {Path, Point} from '../../metamorpher/metamorpher';
import {Path, Point} from 'metamorpher';
import SvgIds from 'svg-ids';
import Velocity from 'velocity-animate';
import highlight from './highlight';

new SvgIds().makeUnique();

let $ = document.querySelector.bind(document);

let getPaths = (figure, emotion) => Array.from($(figure).querySelector(emotion).querySelectorAll('path')).map(path => new Path(path));

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

		return Velocity($('body'), { tween: 1 }, {
			duration: 600,
			easing: 'easeInOutCubic',
			progress
		}).then(() => {
			if (this.animating) {
				this.animationTimeout = setTimeout(this.animate.bind(this), 400);
			}
		});
	}

	toggleAnimation() {
		this.animating = !this.animating;
		if (this.animating) {
			this.animate();
		}
		else {
			clearTimeout(this.animationTimeout);
		}
	}
};

let animation1 = new Animation('#animation1');
$('#animation1 .face').addEventListener('click', animation1.toggleAnimation.bind(animation1));

// let interpolation = new Animation('#interpolation');
// $('#interpolation .face').addEventListener('click', interpolation.toggleInterpolation.bind(interpolation));
