interface User {
    name: string;
    email: string;
    role: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    formattedCreatedAt?: string;
    formattedUpdatedAt?: string;
}

interface LoginData {
    success: boolean;
    message: string;
    user: User
}

interface GetUsersRes {
    success: boolean;
    users: User[];
    currentPage: number;
    totalPage: number
}

interface UpdateUser {
    success: boolean;
    user: User;
}

interface GetUserRoles {
    success: boolean;
    roles: string[];
}