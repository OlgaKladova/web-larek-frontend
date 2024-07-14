import './scss/styles.scss';

import { ProductModel } from './components/Product';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardFull, CardCompact, GalleryItem } from './components/Card';
import { UserData } from './components/UserData';
import { Modal } from './components/Modal';
import { Success } from './components/Success';
import { Basket } from './components/Basket';
import { Contacts, Order } from './components/Form';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const userData = new UserData(events);
const model = new ProductModel(events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);

const cardFull = new CardFull(cloneTemplate(cardPreviewTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);       
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

api.getProducts()
    .then(data => {model.products = data})
    .catch(error => console.error(error));

events.on ('products:changed', () => {
    const cards = model.products.map(product => {
        const galleryCard = new GalleryItem(cloneTemplate(cardCatalogTemplate), events);
        return galleryCard.render(product);
    });

    page.render({
        gallery: cards,
        counter: model.selectedProducts.length
    });
})

events.on ('product:open', (data: { id: string }) => {
    modal.open;
    modal.render({content: cardFull.render(model.getProduct(data.id))}); 
    cardFull.button = model.getselected(data.id);
})

events.on('select:change', (data: { id: string }) => {
    model.changeSelect(data.id);
})

events.on('select:changed', (data: { id: string }) => {
    cardFull.button = model.getselected(data.id);
    page.render({
        counter: model.selectedProducts.length}); 
})

events.on('basket:open', () => {
    const basket = new Basket(cloneTemplate(basketTemplate), events);
    const cards = model.selectedProducts.map((product, index) => {
        const cardCompact = new CardCompact(cloneTemplate(cardBasketTemplate), events);    
        cardCompact.index = index;
        return cardCompact.render(product);
    });
    modal.render({content: basket.render({
        price: model.total,
        list: cards
        })
    });
})

events.on('modal:open', () => {
    page.locked = true;
})

events.on('modal:close', () => {
    page.locked = false;
})

events.on('order:open', () => {
    modal.render({content: order.render({
        error: {
            field: 'address',
            errorMessage: 'Введите данные'},
        valid: true
        }
    )});
    userData.userInfo = {
        total: model.total,
        items: model.selectedProducts.map(product => product.id),
    }    
})

events.on('pay:select', (data: {name: string}) => {
    order.payment = data.name;
    userData.userInfo = Object.assign(userData.userInfo, {
        payment: data.name
    })
    userData.validate();
})

events.on('order:input', (data: {value: string, field: string}) => {
    if (data.field === 'address') {
        userData.userInfo = Object.assign(userData.userInfo, {
            address: data.value
        })
    };

    if (data.value === '') {
        order.error = {field: data.field, errorMessage: 'Вы пропустили поле'};
    } else {
        order.error = {field: data.field, errorMessage: ''};
    }
    userData.validate();
})

events.on('order:change' , () => {
    order.valid = false;
})

events.on('order:submit', () => {
    order.validButton(); 
    modal.render({content: contacts.render({
        valid: true
        }
    )});
    order.clear();
})

events.on('contacts:change', () => {
    contacts.valid = false;
})

events.on('contacts:input', (data: {value: string, field: string}) => {
    if(data.field === 'email') {
        userData.userInfo = Object.assign(userData.userInfo, {
            email: data.value
        })
    };

    if(data.field === 'phone') {
        userData.userInfo = Object.assign(userData.userInfo, {
            phone: data.value
        })
    };

    if (data.value === '' || null) {
        contacts.error = {field: data.field, errorMessage: 'Вы пропустили поле'};
    } else {
        contacts.error = {field: data.field, errorMessage: ''};
    }
    userData.validate();
})

events.on('contacts:submit', () => {
    const success = new Success(cloneTemplate(successTemplate), events);
    modal.render({content: success.render({
        total: userData.total
    })});
    contacts.clear();
    model.clearSelectedProducts();
    
    api.postData({...userData})
    .then(res => console.log(res))
    .catch(error => console.error(error))

})

events.on('success:close', () => {
    modal.close();
})

