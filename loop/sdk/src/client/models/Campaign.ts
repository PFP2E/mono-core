/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Campaign = {
    /**
     * The unique identifier for the campaign.
     */
    id?: string;
    /**
     * The name of the campaign.
     */
    name?: string;
    /**
     * A brief description of the campaign.
     */
    description?: string;
    /**
     * The type of the campaign.
     */
    type?: Campaign.type;
    /**
     * Information about the campaign's rewards.
     */
    reward_info?: Record<string, any>;
    /**
     * Unix timestamp of when the campaign was created.
     */
    created_at?: number;
};
export namespace Campaign {
    /**
     * The type of the campaign.
     */
    export enum type {
        NFT = 'nft',
        OVERLAY = 'overlay',
    }
}

