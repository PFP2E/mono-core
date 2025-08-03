/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Campaign = {
    /**
     * The campaign ID.
     */
    id?: string;
    /**
     * The campaign name.
     */
    name?: string;
    /**
     * The campaign description.
     */
    description?: string;
    /**
     * The campaign type.
     */
    type?: Campaign.type;
    reward_info?: {
        totalPool?: string;
        dailyRate?: string;
    };
    /**
     * Creation timestamp.
     */
    created_at?: number;
};
export namespace Campaign {
    /**
     * The campaign type.
     */
    export enum type {
        NFT = 'nft',
        OVERLAY = 'overlay',
    }
}

