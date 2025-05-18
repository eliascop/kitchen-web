export class User{
    public id: number | null = null;
    public user: string = '';
    public name: string = '';
    public phone: string = '';
    public profile: number | null = null;
    public email: string = '';

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
      }
}
