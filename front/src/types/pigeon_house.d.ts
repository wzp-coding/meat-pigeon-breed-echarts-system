declare namespace PigeonHouseType {
    export interface CreateReq {
        name: string;
        lastCleanTime?: string;
        cleanGap: number;
        lastFeedTime?: string;
        feedGap: number;
    }
    
    export type UpdateReq = CreateReq

    export interface Feed {
        houseId: number;
        feeds: {
            id: number;
            amount: number;
        }[]
    }

    export interface Data {
        lastCleanTime: string;
        lastFeedTime: string;
        id: number;
        name: string;
        cleanGap: number;
        feedGap: number
    };
}