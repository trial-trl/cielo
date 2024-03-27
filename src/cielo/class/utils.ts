import { IncomingMessage, request, RequestOptions } from 'http';
import { TransactionInterface } from '../interface/transaction.interface';
import camelcaseKeys from 'camelcase-keys';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export class Utils {
    constructor(private transactionParams: TransactionInterface) {}

    public get<T>(params: { path: string }): Promise<T> {
        const hostname = this.transactionParams.hostnameQuery;
        const { path } = params;
        const method = HttpRequestMethodEnum.GET;

        const options: IHttpRequestOptions = this.getHttpRequestOptions({
            path,
            hostname,
            method,
        });
        return this.request<T>(options, {});
    }

    public postToSales<T, U>(data: U): Promise<T> {
        return this.post<T, U>({ path: '/1/sales/' }, data);
    }

    public post<T, U>(params: { path: string }, data?: U): Promise<T> {
        const { path } = params;
        const options: IHttpRequestOptions = this.getHttpRequestOptions({
            method: HttpRequestMethodEnum.POST,
            path,
            hostname: this.transactionParams.hostnameTransaction,
        });
        return this.request<T, U>(options, data);
    }

    public put<T, U = any>(params: { path: string }, data?: U): Promise<T> {
        const { path } = params;
        const options: IHttpRequestOptions = this.getHttpRequestOptions({
            method: HttpRequestMethodEnum.PUT,
            path,
            hostname: this.transactionParams.hostnameTransaction,
        });
        return this.request<T, U>(options, data);
    }

    public getHttpRequestOptions(params: {
        hostname: string;
        path: string;
        method: HttpRequestMethodEnum;
    }): IHttpRequestOptions {
        return {
            method: params.method,
            path: params.path,
            hostname: params.hostname,
            port: 443,
            encoding: 'utf-8',
            headers: {
                MerchantId: this.transactionParams.merchantId,
                MerchantKey: this.transactionParams.merchantKey,
                RequestId: this.transactionParams.requestId || '',
                'Content-Type': 'application/json',
            },
        } as IHttpRequestOptions;
    }

    private parseHttpRequestError(
        data: any,
        responseHttp: IHttpResponse,
        responseCielo: any
    ): IHttpRequestReject {
        responseHttp.Code =
            (Array.isArray(responseCielo) &&
                responseCielo[0] &&
                responseCielo[0].Code) ||
            '';
        responseHttp.Message =
            (Array.isArray(responseCielo) &&
                responseCielo[0] &&
                responseCielo[0].Message) ||
            '';
        return {
            statusCode: responseHttp.statusCode || '',
            request: JSON.stringify(data).toString(),
            response: responseHttp,
        } as IHttpRequestReject;
    }

    public httpRequest<T>(
        options: IHttpRequestOptions,
        data: any
    ): Promise<IHttpResponse> {
        const dataPost = JSON.stringify(data)
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const axiosOptions: AxiosRequestConfig = {
            method: options.method,
            url: `https://${options.hostname}:${options.port}${options.path}`,
            headers: options.headers,
            data: dataPost,
        };

        return new Promise<IHttpResponse>((resolve, reject) => {
            axios
                .request<T>(axiosOptions)
                .then((response: AxiosResponse) => {
                    const responseData = response.data;
                    const camelcasedData = camelcaseKeys(responseData, {
                        deep: true,
                    });
                    const httpResponse: IHttpResponse = {
                        statusCode: response.status || 0,
                        statusMessage: response.statusText || '',
                        data: camelcasedData,
                    };
                    resolve(httpResponse);
                })
                .catch((error: AxiosError<any>) => {
                    if (error.response) {
                        const response = error.response.data;
                        const httpResponse: IHttpResponse = {
                            statusCode: error.response.status || 0,
                            statusMessage: error.response.statusText || '',
                            data: camelcaseKeys(response, { deep: true }),
                        };
                        reject(
                            this.parseHttpRequestError(
                                data,
                                httpResponse,
                                response
                            )
                        );
                    } else if (error.request) {
                        reject(error.request);
                    } else {
                        reject(error.message);
                    }
                });
        });
    }

    public request<T, U = any>(options: IHttpRequestOptions, data?: U): Promise<T> {
        return new Promise((resolve, reject) => {
            this.httpRequest<T>(options, data)
                .then((response) => {
                    const data = response.data ? response.data : {};
                    resolve(data as T);
                })
                .catch(reject);
        });
    }
}

export enum HttpRequestMethodEnum {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
}

export interface IHttpRequestOptions extends RequestOptions {
    method: HttpRequestMethodEnum;
    path: string;
    hostname: string;
    headers: any;
    encoding: string;
    port: number;
}

export interface IHttpRequestReject {
    statusCode: string;
    request: string;
    response: IncomingMessage;
}

/**
 * Interface com dados que serão retornados em todas as requisições
 */
export interface IHttpResponse {
    statusCode: number;
    statusMessage: string;
    data?: any;
}
