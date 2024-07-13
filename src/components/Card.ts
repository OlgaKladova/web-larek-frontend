import { IEvents } from './base/events';
import { Component } from './base/Component';
import { ensureElement} from '../utils/utils';
import { IGalleryItem, IProduct } from '../types';

class Card extends Component <IProduct> {
    protected cardId: string;
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;
    protected cardDescription?: HTMLElement;
    protected cardCategory?: HTMLElement;
    protected cardImage?: HTMLImageElement;
    protected cardButton?: HTMLButtonElement;
    protected cardIndex?: HTMLElement;

    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container);

        this.cardTitle = ensureElement('.card__title', this.container);
        this.cardPrice = ensureElement('.card__price', this.container);    
    }   
    
    set id (id: string) {
        this.cardId = id;
    }

    get id () {
        return this.cardId;
    }

    set title (title: string) {
        this.setText(this.cardTitle, title);
    }

    set price (price: number | null) {
        if (price === null) {
            this.setText(this.cardPrice, 'Бесценно');
            this.setDisabled(this.cardButton, true);
        } else {
            this.setText(this.cardPrice, `${price} синапсов`);
            this.setDisabled(this.cardButton, false);
        };
    }
    
    set button (selected: boolean) {
        selected ? 
        this.setText(this.cardButton, 'Удалить из корзины') : 
        this.setText(this.cardButton, 'В корзину');   
    }

    set category (category: string) {
        this.setText(this.cardCategory, category);
    }
    
    set image (image: string) {
        this.setImage(this.cardImage, image, this.title);
    }

    set description (description: string) {
        this.setText(this.cardDescription, description);
    }

    set index (index: number) {
        this.setText(this.cardIndex, `${index + 1}`);
    }

    protected deleteProduct () {
        this.container.remove();
        this.container = null;
    }

    render(data: Partial<IProduct>): HTMLElement {
        const { ...otherData } = data;
        return super.render(otherData);
    }
}

export class CardFull extends Card {
        constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardDescription = ensureElement('.card__text', this.container);
        this.cardCategory = ensureElement('.card__category', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        if(this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.events.emit('select:change', {id: this.cardId});
            })
        }   
    }   
}

export class GalleryItem extends Card implements IGalleryItem {
    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);
        
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardCategory = ensureElement('.card__category', this.container);
        
        if(this.container.classList.contains('gallery__item')) {
            this.container.addEventListener('click', () => {
                this.events.emit('product:open', {id: this.cardId});
            })
        }
    }
}

export class CardCompact extends Card {
    constructor(protected container: HTMLElement, protected events: IEvents) {
        super(container, events);
        
        this.cardIndex = ensureElement(`.basket__item-index`, this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
        
        if(this.cardButton) {
            this.cardButton.addEventListener('click', () => {
                this.events.emit('select:change', {id: this.cardId});
                this.deleteProduct();
                this.events.emit('basket:open');
            })
        }    
    }
}