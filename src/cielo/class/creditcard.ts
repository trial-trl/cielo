import { CancelTransactionResponseModel } from '../models/credit-card/cancel-transaction.response.model';
import { Utils } from './utils';
import { TransactionInterface } from '../interface/transaction.interface';
import {
    TransactionCreditCardRequestModel,
    TransactionCreditCardResponseModel,
    CaptureRequestModel,
    CaptureResponseModel,
    CancelTransactionRequestModel,
} from '../models/credit-card';

export class CreditCard {
    private util: Utils;

    constructor(transactionParams: TransactionInterface) {
        this.util = new Utils(transactionParams);
    }

    public transaction(
        transaction: TransactionCreditCardRequestModel
    ): Promise<TransactionCreditCardResponseModel> {
        return this.util.postToSales<
            TransactionCreditCardResponseModel,
            TransactionCreditCardRequestModel
        >(transaction);
    }

    public captureSaleTransaction(
        transaction: CaptureRequestModel
    ): Promise<CaptureResponseModel> {
        const options = {
            path: `/1/sales/${transaction.paymentId}/capture`,
        };

        if (transaction.amount && transaction.amount > 0) {
            options.path = `${options.path}?amount=${transaction.amount}`;
        }

        return this.util.put<CaptureResponseModel>(options);
    }

    public cancelTransaction(
        cancelTransactionRequest: CancelTransactionRequestModel
    ): Promise<CancelTransactionResponseModel> {
        // Caso seja passado o valor do cancelamento, adiciona na url
        const amount = cancelTransactionRequest.amount
            ? `?amount=${cancelTransactionRequest.amount}`
            : '';
        const path = cancelTransactionRequest.paymentId
            ? `/1/sales/${cancelTransactionRequest.paymentId}/void${amount}`
            : `/1/sales/OrderId/${cancelTransactionRequest.merchantOrderId}/void${amount}`;
        return this.util.put<CancelTransactionResponseModel>({
            path: path,
        });
    }
}
