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
     * Record a batch of new verifications for an epoch
     * @param requestBody
     * @returns any Verifications recorded successfully.
     * @throws ApiError
     */
    public static postV1Verifications(
        requestBody: {
            campaignId?: string;
            epoch?: number;
            verifiedHandles?: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/verifications',
            body: requestBody,
            mediaType: 'application/json',
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
    /**
     * Get the verification status of a user across all campaigns
     * @param socialHandle
     * @returns any User status details.
     * @throws ApiError
     */
    public static getV1UserStatus(
        socialHandle: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/user-status/{socialHandle}',
            path: {
                'socialHandle': socialHandle,
            },
            errors: {
                404: `User not found.`,
            },
        });
    }
    /**
     * Get a Merkle proof for a user to claim rewards for a campaign
     * @param campaignId
     * @param socialHandle
     * @returns any The Merkle proof and reward details.
     * @throws ApiError
     */
    public static getV1Proof(
        campaignId: string,
        socialHandle: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/proof/{campaignId}/{socialHandle}',
            path: {
                'campaignId': campaignId,
                'socialHandle': socialHandle,
            },
            errors: {
                404: `User or verification not found.`,
            },
        });
    }
}
