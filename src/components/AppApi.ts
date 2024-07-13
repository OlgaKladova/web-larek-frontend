import { Api, ApiListResponse } from './base/api';
import { IProduct, IUserData, IOrderResult} from '../types/index';

export class AppApi extends Api {
    readonly cdn: string;
    
    constructor(cdn: string, baseUrl: string, options: RequestInit = {}) {
        super(baseUrl, options);
        this.cdn = cdn;
    }
    
    getProducts(): Promise<IProduct[]> {
        return this.get<ApiListResponse<IProduct>>('/product') 
        .then(data => data.items.map(item => ({
                ...item,
                image: this.cdn + item.image
            }))
        )}

    postData(userData: IUserData): Promise<IOrderResult> {
        return this.post<IOrderResult>('/order', userData)
        .then((data: IOrderResult) => data);
    }
}