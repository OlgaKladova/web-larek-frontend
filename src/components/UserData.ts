import { IUserData } from "../types";
import { IEvents } from "./base/events";


interface FormErrors {
    payment?: string;
    address?: string;
    email?: string;
    phone?: string;
}   

export class UserData implements IUserData {
    payment: string;
    address: string;
    email: string;
    phone: string;
    total: number;
    items: string[];
    events: IEvents;
    formErrors: FormErrors = {};
    
    constructor(events: IEvents) {
        this.events = events;
    }
    
    set userInfo(value: Partial<IUserData>) {
        this.payment = value.payment;
        this.address = value.address;
        this.email = value.email;
        this.phone = value.phone;
        this.total = value.total;
        this.items = value.items;
    }

    get userInfo() {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone,
            total: this.total,
            items: this.items
        }
    }

    validate() {
        if (this.userInfo.payment !== undefined &&
            this.userInfo.address !== undefined && 
            this.userInfo.address !== '') {
            this.events.emit('order:change');
        } else {
            this.events.emit('order:error');
        }

        if (this.userInfo.email !== undefined &&
            this.userInfo.email !== '' &&
            this.userInfo.phone !== '' &&
            this.userInfo.phone !== undefined) {
            this.events.emit('contacts:change');
        } else {
            this.events.emit('contacts:error');
        }
    }
}