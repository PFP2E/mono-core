/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VerificationRequest } from '../models/VerificationRequest';
import type { VerificationResponse } from '../models/VerificationResponse';
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
    /**
     * Verify a user's PFP against a campaign (READ-ONLY)
     * This endpoint is a placeholder to demonstrate the original API design. In the oracle-centric model, the core verification logic is handled by the rewards service.
     * @param requestBody
     * @returns VerificationResponse Verification status
     * @throws ApiError
     */
    public static postV1Verify(
        requestBody: VerificationRequest,
    ): CancelablePromise<VerificationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request - Missing parameters`,
            },
        });
    }
}
