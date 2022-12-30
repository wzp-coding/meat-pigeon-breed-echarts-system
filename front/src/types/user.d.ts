declare namespace LoginType {
    export interface Req {
        password: string,
        account: string
    }

    export interface Res {
        code: 1 | -1,
        msg: string,
        userInfo: {
            id?: number,
            account?: string
            name?: string
            password?: string,
            avatar?: string,
            role?: 1 | 0,
            phone?: string
            email?: string,
            csrfToken?: string,
            token?: string
        }
    }
}
declare namespace UserType {
    export interface CreateReq {
        account: string
        password: string,
        name?: string
        avatar?: string,
        phone?: string
        email?: string,
    }
    
    export type UpdateReq = Partial<Omit<CreateReq, 'account'>>

    export interface Data {
        id: number;
		account: string;
		name: string;
		password: string;
		avatar: string;
		role: number;
		phone: string;
		email: string
    }

}