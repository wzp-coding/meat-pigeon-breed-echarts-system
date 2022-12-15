declare namespace IllnessType {
    export interface CreateReq {
        name: string
        description?: string
        treatment?: string,
        pictures?: string
    }
    
    export type UpdateReq = CreateReq

}