import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasket {
    price: number;
    list: HTMLElement[];
}
export class Basket extends Component<IBasket> {
    protected basketList: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketPrice: HTMLElement;
    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this.basketList = ensureElement('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketPrice = ensureElement('.basket__price', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('order:open');
        });
    }

    set price(value: number) {
        this.setText(this.basketPrice, `${value} синапсов`);
    }

    set list(items: HTMLElement[]) {
        this.basketList.replaceChildren(...items);
        items.length === 0 ?
        this.setDisabled(this.basketButton, true) :
        this.setDisabled(this.basketButton, false);
    }
}