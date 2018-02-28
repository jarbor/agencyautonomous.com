// import {Path} from '../../metamorpher/metamorpher';
import {Path, Point} from 'metamorpher';
import SvgIds from 'svg-ids';
import Velocity from 'velocity-animate';
import highlight from './highlight';
import analytics from './analytics';
import disqus from './disqus';

analytics('send', 'pageview');

new SvgIds().makeUnique();

let $ = document.querySelector.bind(document);

let getPaths = (figure, emotion) => Array.from($(figure).querySelector(emotion).querySelectorAll('path')).map(path => new Path(path));

class Emoji {
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

		return Velocity($(this.figure), { tween: 1 }, {
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

		return Velocity($('body'), { tween: 1 }, {
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

		return Velocity($('body'), { tween: 1 }, {
			duration: 600,
			easing: 'easeInOut',
			progress
		});
	}
};

let animation1 = new Emoji('#animation1');
$('#animation1 .face').addEventListener('click', animation1.toggleAnimation.bind(animation1));

let interpolation1 = new Emoji('#interpolation1');
interpolation1.interpolate(0.5);
let interpolation2 = new Emoji('#interpolation2');
interpolation2.interpolate(2);

let singleAnimation = new Emoji('#single-animation');
$('#single-animation .face').addEventListener('click', () => {
	singleAnimation.animate();
	singleAnimation.emotionIndex = 0;
});

let animationLooped = new Emoji('#animation-looped');
$('#animation-looped .face').addEventListener('click', animationLooped.toggleAnimation.bind(animationLooped));

let naiveRotation = new Emoji('#naive-rotation');
$('#naive-rotation .face').addEventListener('click', naiveRotation.naiveRotate.bind(naiveRotation));

let smartRotation = new Emoji('#smart-rotation');
$('#smart-rotation .face').addEventListener('click', smartRotation.smartRotate.bind(smartRotation));