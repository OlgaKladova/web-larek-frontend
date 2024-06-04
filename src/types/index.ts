interface IProduct {
    id: string;
    title: string;
    description: string;
    category: string;
    image: string;
    price: number | null;
    addProduct (id: string): void;
    deleteProduct (id: string): void;
}

interface IUserData {
    payment: 'online' | 'personally';
    address: string;
    email: string;
    tel: string;
}

interface IBascet {
    products: Map<string, number>;
    deleteProduct: IProduct['deleteProduct'];
    summationPrice(price: number | null): number | null;
}

interface IProductRender {
    products: TProductRender[];
    getProduct(id: string): IProduct;
}

type TProductRender = Omit<IProduct, 'description'>;

type TUserAddress = Pick<IUserData, 'address' | 'payment'>;

type TUserContacts = Pick<IUserData, 'email' | 'tel'>;