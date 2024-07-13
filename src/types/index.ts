export interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
    selected: boolean;
} 

export interface IUserData {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export type IGalleryItem = Pick<IProduct, 'id' | 'title' | 'image' | 'price' | 'category'>;

export type IBasketItem = Pick<IProduct, 'id' | 'title' | 'price' | 'selected'>;

export type IUserAddress = Pick<IUserData, 'address' | 'payment'>;

export type IUserContacts = Pick<IUserData, 'email' | 'phone'>;