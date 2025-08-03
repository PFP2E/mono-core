/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Campaign } from '../models/Campaign';
import type { User } from '../models/User';
import type { Verification } from '../models/Verification';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Retrieve a list of campaigns
     * @returns Campaign A list of campaigns.
     * @throws ApiError
     */
    public static getV1Campaigns(): CancelablePromise<Array<Campaign>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/campaigns',
        });
    }
    /**
     * Retrieve a single campaign
     * @param id
     * @returns Campaign A single campaign.
     * @throws ApiError
     */
    public static getV1Campaigns1(
        id: string,
    ): CancelablePromise<Campaign> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/campaigns/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Retrieve a list of verifications
     * @returns Verification A list of verifications.
     * @throws ApiError
     */
    public static getV1Verifications(): CancelablePromise<Array<Verification>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/verifications',
        });
    }
    /**
     * Retrieve a list of target PFP hashes for a campaign
     * @param campaignId
     * @returns string A list of PFP hashes.
     * @throws ApiError
     */
    public static getV1TargetPfps(
        campaignId: string,
    ): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/target-pfps/{campaignId}',
            path: {
                'campaignId': campaignId,
            },
        });
    }
    /**
     * Retrieve a list of users
     * @returns User A list of users.
     * @throws ApiError
     */
    public static getV1Users(): CancelablePromise<Array<User>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/users',
        });
    }
}
