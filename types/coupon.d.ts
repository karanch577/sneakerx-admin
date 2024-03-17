interface Coupon {
    code: string;
    discount: number;
    active: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
    formattedCreatedAt?: string;
    formattedUpdatedAt?: string;
}

interface AddCoupon {
    success: boolean;
    coupon: Coupon;
}

interface GetCouponsRes {
    success: boolean;
    coupons: Coupon[];
    currentPage: number;
    totalPage: number;
}