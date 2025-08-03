/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Campaign } from '../models/Campaign';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CampaignsService {
    /**
     * Retrieve a list of all campaigns
     * @returns Campaign A list of campaigns.
     * @throws ApiError
     */
    public static getV1Campaigns(): CancelablePromise<Array<Campaign>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/campaigns',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get a campaign by ID
     * @param id The campaign ID
     * @returns Campaign The campaign description by id
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
            errors: {
                404: `The campaign was not found`,
                500: `Internal Server Error`,
            },
        });
    }
}
