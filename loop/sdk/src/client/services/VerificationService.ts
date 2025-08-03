/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VerificationService {
    /**
     * Retrieve a list of all verifications, joined with user wallet addresses
     * @returns any A list of verifications.
     * @throws ApiError
     */
    public static getV1Verifications(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/verifications',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
