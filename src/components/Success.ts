import {Component} from "./base/Component";
import {ensureElement} from "../utils/utils";
import { IEvents } from "./base/events";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);

        this._close.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }
    
    set total (value: number) {
        this.setText(this._total, `Списано ${value} синапсов`); 
    }
}