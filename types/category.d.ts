interface Category {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    formattedCreatedAt?: string;
    formattedUpdatedAt?: string;
}

interface GetCategoriesRes {
    success: boolean;
    message: string;
    collections: Category[];
    currentPage: number;
    totalPage: number;
}

interface AddCategory {
    success: boolean;
    message: string;
    collection: Category;
}