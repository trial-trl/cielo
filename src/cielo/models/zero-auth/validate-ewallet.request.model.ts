import { EWalletType } from '../../enums';
import { CreditCardModel } from '../credit-card.model';

export interface ZeroAuthEWalletModel {
    type: EWalletType;
    cavv: string;
    eci: number;
}

export interface ZeroAuthValidateEWalletRequestModel {
    card: CreditCardModel;
    wallet: ZeroAuthEWalletModel;
}
