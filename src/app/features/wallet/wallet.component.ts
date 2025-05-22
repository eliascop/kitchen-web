import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Wallet, WalletTransaction } from '../../model/wallet.model';
import { WalletService } from '../../core/service/wallet.service';
import { FormsModule } from '@angular/forms';
import { FormatDateTimePipe } from '../../core/pipes/format-date-time.pipe';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, FormatDateTimePipe],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})

export class WalletComponent implements OnInit {
  wallet: Wallet | null = null;
  transactions: WalletTransaction[] = [];

  creditAmount = 0;
  creditDesc = '';

  debitAmount = 0;
  debitDesc = '';

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.loadWallet();
  }

  loadWallet() {
    this.walletService.getWallet().subscribe(wallet => 
      this.wallet = wallet.data!);

    this.walletService.getTransactions().subscribe(txs => 
      this.transactions = txs.data!);
  }

  credit() {
    if (this.creditAmount > 0) {
      this.walletService.credit({ amount: this.creditAmount, description: this.creditDesc })
        .subscribe(() => this.loadWallet());
    }
  }

  debit() {
    if (this.debitAmount > 0) {
      this.walletService.debit({ amount: this.debitAmount, description: this.debitDesc })
        .subscribe(() => this.loadWallet());
    }
  }
}
