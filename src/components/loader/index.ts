import 'boxicons';

class Loader extends HTMLElement {
	shadow: ShadowRoot;
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: 'open' });
	}
	connectedCallback() {
		this.render();
	}
	render() {
		this.shadow.innerHTML = `
        <div class="loader-container">
            <box-icon name='loader-circle' animation='spin' size="cssSize"></box-icon>
        </div>`;

		const style = document.createElement('style');
		style.innerHTML = `
            .loader-container {
                height: 80vh;
                display: none;
                justify-content: center;
            }
            .loader-container box-icon {
                width: 150px;
            }
        `;

		this.shadow.appendChild(style);
	}
}
customElements.define('custom-loader', Loader);
