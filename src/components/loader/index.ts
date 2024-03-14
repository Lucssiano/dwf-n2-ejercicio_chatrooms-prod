class Loader extends HTMLElement {
	shadow: ShadowRoot;
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }
    connectedCallback(){
        this.render();

    }
    render() {

        this.shadow.innerHTML = 
        `<div class="loader-container">
            <i class='bx bx-loader-circle bx-spin'></i>
         </div>`

        const style = document.createElement('style');
        style.innerHTML = `
            .loader-container {
                max-width: 510px;
                margin: 50px auto;
                text-align: center;
                display: none;
            }
            .loader-container i {
                font-size: 100px;
            }
        `;

        this.shadow.appendChild(style);
    }
}
customElements.define('custom-loader', Loader);
