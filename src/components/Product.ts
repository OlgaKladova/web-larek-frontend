import { IEvents } from './base/events';
import { IProduct } from '../types/index';

export class ProductModel {
    protected _products: IProduct[];
    protected _selected: IProduct['selected'];
    constructor (protected events: IEvents) {
        this._selected = false;
    }

    set products(products: IProduct[]) {
        this._products = products;
        this.events.emit('products:changed');
    }
    get products(): IProduct[] {
        return this._products;
    }
    
    get selectedProducts(): IProduct[] {
        return this._products.filter(product => product.selected === true);
    }  
    
    get selectedCount(): number {
        return this.selectedProducts.length;
    }
    
    get total (): number {
        return this.selectedProducts.reduce((total, product) =>  total + product.price, 0)
    }

    getselected(id: string): boolean {
        const item = this._products.find(product => product.id === id);
        return item.selected;
    }

    getProduct(id: string): IProduct{
        return this._products.find(product => product.id === id)
    };

    changeSelect(id: string): void {
        const product = this.getProduct(id);
        if (product) {
            product.selected = !product.selected;
            this.events.emit('select:changed', {id});
        }
    }

    clearSelectedProducts () {
        this.selectedProducts.forEach(product => 
            product.selected = false)
        this.events.emit('products:changed');
    }
} 