/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Retrieve a list of all users
     * @returns any A list of users.
     * @throws ApiError
     */
    public static getV1Users(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/v1/users',
            errors: {
                500: `Internal Server Error`,
            },
        });
    }
}
