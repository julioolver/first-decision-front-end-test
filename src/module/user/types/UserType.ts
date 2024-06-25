export type UserType = {
    id: number | null;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    current_password?: string;
};