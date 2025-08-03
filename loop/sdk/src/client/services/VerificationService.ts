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
     * Verify a user's PFP against a campaign
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
