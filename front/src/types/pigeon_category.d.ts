declare namespace PigeonCategoryType {
    export interface CreateReq {
        category: string;
        yearEggs: string;
        adultWeight: string;
        fourAgeWeight: string;
        feature: string;
    }
    
    export type UpdateReq = CreateReq

    export interface Data {
        id: number;
        category: string;
        yearEggs: string;
        adultWeight: string;
        fourAgeWeight: string;
        feature: string
    };
}