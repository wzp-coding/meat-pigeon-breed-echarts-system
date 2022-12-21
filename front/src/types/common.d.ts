declare namespace CommonType {
    export interface Res {
        code: number;
        msg: string;
    }
    export interface Pagination {
        page: number;
        pageSize: number;
    }

    export interface Conditions extends Pagination {
        keywords?: string;
    }

    export interface Headers extends AxiosRequestHeaders {
        successAlert?: Boolean;
        errorAlert?: Boolean;
        isLoading?: Boolean;
        [key: string]: any;
    }

    export interface Option { value: string, label: string }
}