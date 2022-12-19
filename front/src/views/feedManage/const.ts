export const CATEGORY_LIST = [
    '植物蛋白质饲料',
    '动物蛋白质饲料',
    '碳水化合物饲料',
    '脂肪饲料',
    '青绿饲料',
    '矿物质饲料',
    '特种饲料',
].map(item => ({ label: item, value: item }));

export interface Conditions {
    categeory?: string;
    puchaseTime?: string[];
    produceTime?: string[];
    purchaseAmount?: number[];
    currentAmount?: number[];
    shelfLife?: number[];
}
