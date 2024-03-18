interface ApiCustomError {
    success: boolean;
    message: string;
}

interface DeleteRes {
    success: boolean;
    message: string;
}


interface Sales {
    totalSales: number;
}
interface TotalSalesRes {
    success: boolean;
    sales: Sales[];
}

