import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
    counter: number;
    gallery: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _gallery: HTMLElement;
    protected _bascet: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', this.container);
        this._gallery = ensureElement<HTMLElement>('.gallery', this.container);
        this._bascet = ensureElement<HTMLElement>('.header__basket', this.container);
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);

        this._bascet.addEventListener('click', () => {
            this.events.emit('basket:open');
        })
    }

    set counter(value: number) {
        this.setText(this._counter, value);
    }

    set gallery(cards: HTMLElement[]) {
        this._gallery.replaceChildren(...cards);
    }

    set locked(value: boolean) {
        if (value) {
            this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
        } else {
            this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
        }
    }
}
