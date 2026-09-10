import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent implements OnInit {
  txnid: string | null = null;
  paymentData: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.txnid = this.route.snapshot.queryParamMap.get('txnid');
    if (this.txnid) {
      this.fetchPaymentDetails(this.txnid);
    } else {
      this.errorMessage = 'Transaction ID not found!';
      this.isLoading = false;
    }
  }

  fetchPaymentDetails(txnid: string) {
    const cleanTxnId = txnid.replace(/\s+/g, '').trim();

this.http.get(`${environment.backendUrl}/payment-details?txnid=${cleanTxnId}`)
      .subscribe({
        next: (data: any) => {
          this.paymentData = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching payment details:', err);
          this.errorMessage = 'Could not fetch payment details.';
          this.isLoading = false;
        },
      });
  }

  get statusMessage(): string {
    if (!this.paymentData) return '';
    switch (this.paymentData.status) {
      case 'failure':
        return 'Payment Failed ❌';
      case 'pending':
        return 'Payment Pending ⏳';
      case 'success':
        return 'Payment Successful ✅';
      default:
        return 'Unknown status';
    }
  }

  get statusBadgeClass(): string {
    if (!this.paymentData) return 'bg-secondary';
    switch (this.paymentData.status) {
      case 'failure':
        return 'bg-danger text-white';
      case 'pending':
        return 'bg-warning text-dark';
      case 'success':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  goBackToHome() {
  if (window.opener) {
    // 👇 If opened in new tab/popup
    // window.opener.location.href = '/apply-now'; // open "Apply Now" in main tab
    window.close(); // close PayU tab
  } else {
    // 👇 If opened in same tab
    window.location.href = '/apply-now';
  }
}

}
