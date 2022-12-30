declare namespace PigeonType {
    export interface CreateReq {
        pigeonId: string;
        houseId: number;
        categoryId: number;
        startFeedTime: string;
        feedCount: number;
        weight: number;
        eggs: number;
        health: string;
        illnessIds: number[];
    }
    
    export type UpdateReq = CreateReq

    export interface Data {
        id: number;
        pigeonId: string;
        houseId: number;
        categoryId: number;
        startFeedTime: string;
        feedDays: number;
        isFinished: false;
        feedCount: number;
        weight: number;
        eggs: number;
        health: string;
        house_id: number;
        categoryInfo: PigeonCategoryType.Data;
        houseInfo: PigeonHouseType.Data;
        illnesses: IllnessType.Data[]
    }
}