export type PointTransactionType = "EARN" | "DEDUCT";

export interface PointTransaction {
    id: number;
    studentCode: string;
    points: number;
    type: PointTransactionType;
    source: string;
    registrationId: number | null;
    createdAt: string;
}

export interface PointBalance {
    studentCode: string;
    balance: number;
}

export interface LeaderboardItem {
    studentCode: string;
    balance: number;
}

export interface PointPayload {
    studentCode: string;
    points: number;
    source: string;
    registrationId?: number;
}
