export interface IAuthService {
    // signUp (email: string, password: string): Promise<any>
    // login (email: string, password: string): Promise<any>
    hashPassword (password: string): Promise<string>
    generateJwtToken (email: string, password: string): string
}
