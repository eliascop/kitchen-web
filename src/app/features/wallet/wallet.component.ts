import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CreditRequest, DebitRequest, Wallet, WalletTransaction } from '../../model/wallet.model';
import { WalletService } from '../../core/service/wallet.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormatDateTimePipe } from '../../core/pipes/format-date-time.pipe';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../../core/service/toast.service';
import { CurrencyInputComponent } from '../../shared/components/currency-input/currency-input.component';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormatDateTimePipe, CurrencyInputComponent],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})

export class WalletComponent implements OnInit {
  walletForm: FormGroup;
  wallet: Wallet | null = null;
  transactions: WalletTransaction[] = [];
  debitRequest!: DebitRequest;

  constructor(private route: ActivatedRoute,
    private toast: ToastService,
    private walletService: WalletService,
    private fb: FormBuilder) {
      this.walletForm = this.fb.group({
        amount: [null, Validators.required],
        description: ['', [Validators.required]],
      });
    }

  ngOnInit() {
    this.loadWallet();
    this.loadCreditStatus();
  }

  loadWallet() {
    this.walletService.getWallet().subscribe(wallet => this.wallet = wallet.data!);
    this.walletService.getTransactions().subscribe(txs => this.transactions = txs.data!);
  }

  loadCreditStatus() {
    let message = '';
    this.route.queryParamMap.subscribe(params => {
      const messageParam = params.get('paymentStatus');
      if(messageParam === 'succeeded'){
        message = 'Credito efetuado com sucesso.';
      }else if (messageParam === 'cancelled') {
        message = 'Credito cancelado pelo usuário.';
      } else if (messageParam === 'errortocancel') {
        message = 'Ocorreu um erro ao cancelar pagamento.';
      } else {
        message = 'Erro desconhecido: '+messageParam;
      }

      if (message) {
        this.toast.show(message);
      }
    }); 
  }

  credit() {
    if (this.walletForm.valid && this.walletForm.value.amount > 0) {
      const creditRequest: CreditRequest = this.walletForm.value;
  
      this.walletService.credit(creditRequest).subscribe({
        next: response => {
          window.location.href = response.data!.message;
          this.loadWallet();
        },
        error: err => {
          this.toast.show('Ocorreu um erro ao iniciar pagamento.');
          console.error(err);
        }
      });
    }
  }

  debit() {
    if (this.debitRequest.amount > 0) {
      this.walletService.debit(this.debitRequest)
        .subscribe(() => this.loadWallet());
    }
  }
}
