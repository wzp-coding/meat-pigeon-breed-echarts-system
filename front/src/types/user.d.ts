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