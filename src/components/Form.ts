import { ensureAllElements, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IForm {
    valid: boolean;
    error: Record<string, string>;
}

class Form extends Component<IForm> {
    protected formButton: HTMLButtonElement;
    protected formErrors: HTMLElement;
    protected formInputs: HTMLInputElement[];
        
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        
        this.formButton = ensureElement<HTMLButtonElement>('.modal__actions > .button', this.container);
        this.formErrors = ensureElement('.form__errors', this.container);
        this.formInputs = ensureAllElements<HTMLInputElement>('.form__input', this.container);
        
        this.formInputs.forEach(input => {
            input.setAttribute('required', 'required');
        })  
        this.container.addEventListener('input', (event: Event) => {
                const target = event.target as HTMLInputElement;
                const field = target.name;
                const value = target.value;
                this.events.emit(`${this.container.name}:input`, {
                        field,
                        value
                });
        })    
    
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });

    }

    getInputValues(){
        const valuesObject: Record<string, string> = {};
        this.formInputs.forEach(input => {
            valuesObject[input.name] = input.value;
        });
        return valuesObject
    }

    set valid(value: boolean) {
        this.setDisabled(this.formButton, value);
        
    }

    set error(data: {field: string, errorMessage: string}) {
        if(data.errorMessage) {
            this.showError(data.field, data.errorMessage);
        } else {
            this.hideError(data.field);
        }
    }

    protected hideError(field: string) {
        this.toggleClass(this.container[field], 'form__input:invalid');
        this.setHidden(this.formErrors);
        this.setText(this.formErrors, '');
    }

    protected showError(field: string, message: string) {
        this.toggleClass(this.container[field], 'form__input:invalid');
        this.setVisible(this.formErrors);
        this.setText(this.formErrors, message);
    }
    
    clear() {
        this.container.reset();
        this.formInputs.forEach(input => {
            this.hideError(input.name);
        })
    }
}

export class Order extends Form {
protected _buttons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttons = ensureAllElements<HTMLButtonElement>('.button_alt', container);
        
        this._buttons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('pay:select', {name: button.name});
            });
        })
    }

    set payment(name: string) {
        this._buttons.forEach(button => {
            this.toggleClass(button, '.button_alt-active', button.name === name);
            this.setDisabled(button, button.name === name)
        });
    }
    validButton (): boolean{
        return !this._buttons.some(button => {
            return button.classList.contains('button_alt-active')
        })
    }
}

export class Contacts extends Form {
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
    }
}