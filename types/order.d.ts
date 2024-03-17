
interface OrderedProduct {
    productId: string;
    count: number;
    size: string;
    price: string;
    _id: string;
}

interface OrderedProductDetail {
    count: number;
    size: string;
    price: string;
    _id: string;
    product: Product
}

interface OrderUser {
    _id: string;
    name: string;
}


interface Order {
    _id: string;
    products: OrderedProduct[];
    user: OrderUser;
    phoneNumber: string;
    address: string;
    amount: number;
    coupon: string;
    transactionStatus: string;
    status: string;
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
    orderBy?: string;
    noOfProducts?: number;
    formattedCreatedAt?: string;
    formattedUpdatedAt?: string;
}


interface GetOrdersRes {
    success: boolean;
    message: string;
    orders: Order[];
    currentPage: number;
    totalPage: number;
}

interface GetOrderDetail {
    success: boolean;
    order: Order;
}