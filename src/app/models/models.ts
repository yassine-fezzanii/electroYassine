export interface Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    products?: Product[];
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    brand: string;
    categoryId: number;
    category?: Category;
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Order {
    id?: number;
    productId: number;
    product?: Product;
    userId: number;
    user?: User;
    quantity: number;
    totalPrice?: number;
    orderDate?: Date;
    status?: string;
}
