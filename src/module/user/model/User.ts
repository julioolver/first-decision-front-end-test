import { UserType } from "../types/UserType";

class User {
    id: number | null;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    current_password?: string;

    constructor(
        user: UserType = {
            id: null,
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        }
    ) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.password = user.password;
        this.password_confirmation = user.password_confirmation;
        this.current_password = user.current_password;
    }
}

export { User };