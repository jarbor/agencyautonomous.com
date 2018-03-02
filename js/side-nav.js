import Contents from 'contents';

class SideNav {
	constructor() {

		if (this.isMobile()) {
			this.close();
		}

		// Load the table of contents
		let contents = new Contents();
		let contentsDiv = document.querySelector('#side-nav');

		let contentsHeading = document.createElement('h2');
		contentsHeading.innerHTML = 'Contents';
		contentsDiv.appendChild(contentsHeading);

		let closeLink = document.createElement('a');
		closeLink.setAttribute('href', '');
		closeLink.classList.add('close-link');
		closeLink.innerHTML = 'Close [&ndash;]';
		closeLink.addEventListener('click', this.close);
		contentsDiv.appendChild(closeLink);

		let openLink = document.createElement('a');
		openLink.setAttribute('href', '');
		openLink.classList.add('open-link');
		openLink.innerHTML = '[+] Open TOC';
		openLink.addEventListener('click', this.open);
		document.querySelector('body').appendChild(openLink);

		let contentsList = contents.list();
		this.attachMobileClose(contentsList);
		contentsDiv.appendChild(contentsList);
	}

	open(e) {
		e && e.preventDefault();
		document.querySelector('body').classList.remove('side-nav-hidden');
	};

	close(e) {
		e && e.preventDefault();
		document.querySelector('body').classList.add('side-nav-hidden');
	};

	isMobile() {
		// Below 800px the content is pushed by CSS so the nav should be closed by default
		return window.innerWidth <= 800;
	}

	mobileClose() {
		if (this.isMobile()) {
			this.close();
		}
	}

	attachMobileClose(container) {
		let links = Array.from(container.querySelectorAll('a'));
		links.forEach(link => link.addEventListener('click', this.mobileClose.bind(this)));
	}
}

export default SideNav;