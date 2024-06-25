class UserController {
    async createUser(user: any): Promise<void> {
        console.log('Creating user:', user);
    }

    async updateUser(user: any): Promise<void> {
        console.log('Updating user:', user);
    }

    async deleteUser(userId: string): Promise<void> {
        console.log('Deleting user with ID:', userId);
    }

    async getAllUsers(): Promise<any[]> {
        console.log('Getting all users');
        return [];
    }
}

export { UserController };
