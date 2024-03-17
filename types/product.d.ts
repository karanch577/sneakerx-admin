
interface Sold {
    size?: string;
    quantity?: number;
}

interface Photos {
    secure_url: string;
}

interface Sizes {
    size: string;
    quantity: number;
    id: string;
}

interface CollectionId {
    name: string;
    _id: string;
}

interface Product {
    _id: string;
    name: string;
    sellingPrice: number;
    price: number;
    description: string;
    colourShown: string;
    style: string;
    collectionId: CollectionId;
    sold: Sold[];
    photos: Photos[];
    sizes: Sizes[];
    createdAt: string;
    updatedAt: string;
    formattedCreatedAt?: string;
    formattedUpdatedAt?: string;
}


interface GetProductsRes {
    success: boolean;
    products: Product[];
    currentPage: number;
    totalPage: number
}

interface GetProductDetail {
    success: boolean;
    product: Product;
}