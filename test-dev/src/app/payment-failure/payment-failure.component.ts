import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpParams
} from '@angular/common/http';

import { environment } from '../../environments/environment';


@Component({
  selector: 'app-payment-failure',
  standalone: true,

  imports: [
    CommonModule,
    HttpClientModule
  ],

  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.css']
})
export class PaymentFailureComponent implements OnInit {

  // ============================================================
  // PAYMENT
  // ============================================================

  txnid: string | null = null;

  paymentData: any = null;


  // ============================================================
  // UI
  // ============================================================

  isLoading = true;

  errorMessage = '';


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}


  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.txnid =
      this.route.snapshot.queryParamMap.get('txnid');


    console.log(
      'Failure transaction ID:',
      this.txnid
    );


    if (!this.txnid) {

      this.errorMessage =
        'Transaction ID not found!';

      this.isLoading = false;

      return;

    }


    this.fetchPaymentDetails(
      this.txnid
    );

  }


  // ============================================================
  // FETCH PAYMENT DETAILS
  // ============================================================

  fetchPaymentDetails(
    txnid: string
  ): void {

    // Remove spaces
    const cleanTxnId =
      txnid
        .replace(/\s+/g, '')
        .trim();


    if (!cleanTxnId) {

      this.errorMessage =
        'Invalid transaction ID.';

      this.isLoading = false;

      return;

    }


    // Use HttpParams instead of manually
    // concatenating the query string.

    const params =
      new HttpParams()
        .set(
          'txnid',
          cleanTxnId
        );


    this.http
      .get(
        `${environment.backendUrl}/payment-details`,
        { params }
      )
      .subscribe({

        // ------------------------------------------------------
        // SUCCESS
        // ------------------------------------------------------

        next: (data: any) => {

          console.log(
            'Payment details:',
            data
          );


          this.paymentData = data;

          this.isLoading = false;

        },


        // ------------------------------------------------------
        // ERROR
        // ------------------------------------------------------

        error: (err) => {

          console.error(
            'Error fetching payment details:',
            err
          );


          this.paymentData = null;

          this.errorMessage =
            'Could not fetch payment details.';

          this.isLoading = false;

        }

      });

  }


  // ============================================================
  // STATUS MESSAGE
  // ============================================================

  get statusMessage(): string {

    if (!this.paymentData) {

      return '';

    }


    const status =
      String(
        this.paymentData.status || ''
      )
        .toLowerCase()
        .trim();


    switch (status) {

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


  // ============================================================
  // STATUS BADGE
  // ============================================================

  get statusBadgeClass(): string {

    if (!this.paymentData) {

      return 'bg-secondary';

    }


    const status =
      String(
        this.paymentData.status || ''
      )
        .toLowerCase()
        .trim();


    switch (status) {

      case 'failure':

        return 'bg-danger text-white';


      case 'pending':

        return 'bg-warning text-dark';


      case 'success':

        return 'bg-success text-white';


      default:

        return 'bg-secondary text-white';

    }

  }


  // ============================================================
  // GO BACK TO APPLY NOW
  // ============================================================

  goBackToHome(): void {

    // ----------------------------------------------------------
    // If PayU opened this page in a new tab/window
    // ----------------------------------------------------------

    if (window.opener) {

      try {

        window.opener.location.href =
          '/apply-now';

      } catch (error) {

        console.error(
          'Could not redirect opener:',
          error
        );

      }


      // Close the PayU result tab

      window.close();

      return;

    }


    // ----------------------------------------------------------
    // If opened in the same browser tab
    // ----------------------------------------------------------

    window.location.href =
      '/apply-now';

  }

}