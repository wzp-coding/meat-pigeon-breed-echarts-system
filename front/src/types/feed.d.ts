declare namespace FeedType {
    export interface CreateReq {
        category: string;
        purchaseTime: string;
        purchaseAmount: number;
        currentAmount: number;
        produceTime: string;
        shelfLife: number;
    }
    
    export type UpdateReq = CreateReq

    export interface Data {
        id: number;
		name: string;
		category: string;
		purchaseTime: string;
		purchaseAmount: number;
		currentAmount: number;
		produceTime: string;
		shelfLife: number
    }

}