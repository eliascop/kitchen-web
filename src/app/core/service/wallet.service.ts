import { Injectable } from '@angular/core';
import { CreditRequest, DebitRequest, Wallet, WalletTransaction } from '../../model/wallet.model';
import { environment } from '../../../environments/environment.dev';
import { DataService } from './data.service';
import { ServiceResponse } from './model/http-options-request.model';

export const WALLET_REST_SERVICE = environment.WALLET_REST_SERVICE

@Injectable({ providedIn: 'root' })
export class WalletService {

constructor(private dataService: DataService) { }

  getWallet(): ServiceResponse<Wallet> {
    return this.dataService.get<Wallet>({
        url: `${WALLET_REST_SERVICE}`
    });
  }

  getTransactions(): ServiceResponse<WalletTransaction[]> {
    return this.dataService.get<WalletTransaction[]>({
        url: `${WALLET_REST_SERVICE}/transactions`
    });
  }


  credit(data: CreditRequest): ServiceResponse<void> {
    return this.dataService.post<void>({
        url: `${WALLET_REST_SERVICE}/credit`,
        body: data,
    });
  }

  debit(data: DebitRequest): ServiceResponse<void> {
    return this.dataService.post<void>({
        url: `${WALLET_REST_SERVICE}/debit`,
        body: data,
    });
  }

  getBalance(): ServiceResponse<number> {
    return this.dataService.get<number>({
      url: `${WALLET_REST_SERVICE}/balance`,
    });
  }
}
