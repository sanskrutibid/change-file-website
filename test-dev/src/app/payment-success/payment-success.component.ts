import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  txnid: string | null = null;
  paymentData: any = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

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
        }
      });
  }

  get statusMessage(): string {
    if (!this.paymentData) return '';
    switch (this.paymentData.status) {
      case 'success': return 'Payment Successful ✅';
      case 'failure': return 'Payment Failed ❌';
      case 'pending': return 'Payment Pending ⏳';
      default: return 'Unknown status';
    }
  }

  get statusBadgeClass(): string {
    if (!this.paymentData) return 'bg-secondary';
    switch (this.paymentData.status) {
      case 'success': return 'bg-success';
      case 'failure': return 'bg-danger';
      case 'pending': return 'bg-warning text-dark';
      default: return 'bg-secondary';
    }
  }

  // ✅ Download PDF Receipt using jsPDF
  async downloadReceipt() {
    if (!this.paymentData) return;

    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();

  // --- Load and Add Logo (with proper aspect ratio and centering) ---
  const logo = new Image();
  logo.src = 'assets/images/logo.png'; // Path to your logo inside assets

  logo.onload = () => {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Set logo width for better visibility (adjust as needed)
    const logoWidth = 40;
    const aspectRatio = logo.height / logo.width || 0.4; // fallback ratio
    const logoHeight = logoWidth * aspectRatio;

    // Center horizontally
    const xPos = (pageWidth - logoWidth) / 2;
    const yPos = 10;

    // Add logo to PDF
    doc.addImage(logo, 'PNG', xPos, yPos, logoWidth, logoHeight);

    // --- Header Text ---
    const headerY = yPos + logoHeight + 10;
    doc.setFontSize(18);
    doc.setTextColor(0, 74, 173);
    doc.text('Cruise Lens Academy', pageWidth / 2, headerY, { align: 'center' });

    doc.setFontSize(13);
    doc.setTextColor(60);
    doc.text('Official Payment Receipt', pageWidth / 2, headerY + 8, { align: 'center' });

    doc.line(20, headerY + 12, pageWidth - 20, headerY + 12);

    // --- Receipt Data ---
    const info = [
      ['Transaction ID', this.paymentData.txnid],
      ['Full Name', this.paymentData.fullName],
      ['Email', this.paymentData.email],
      ['Phone', this.paymentData.phone],
      // ['Course', this.paymentData.course],
      ['Amount Paid (₹)', this.paymentData.amount],
      ['Payment Status', this.paymentData.status?.toUpperCase()],
      ['Date', new Date().toLocaleString()],
    ];

    autoTable(doc, {
      startY: headerY + 20,
      head: [['Field', 'Details']],
      body: info,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 74, 173], // brand blue
        textColor: [255, 255, 255],
        halign: 'center',
      },
      styles: {
        fontSize: 12,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: [40, 40, 40] },
        1: { textColor: [0, 0, 0] },
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || headerY + 40;

    // --- Footer Section ---
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(
      'Thank you for choosing Cruise Lens Academy!',
      pageWidth / 2,
      finalY + 15,
      { align: 'center' }
    );
    doc.text(
      'This is a computer-generated receipt, no signature required.',
      pageWidth / 2,
      finalY + 22,
      { align: 'center' }
    );

    // --- Save File ---
    const filename = `CruiseLens_Receipt_${this.paymentData.txnid}.pdf`;
    doc.save(filename);
  };

  // Fallback: If logo fails to load, generate PDF without it
  logo.onerror = () => {
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(0, 74, 173);
    doc.text('Cruise Lens Academy', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(13);
    doc.setTextColor(60);
    doc.text('Official Payment Receipt', pageWidth / 2, 28, { align: 'center' });

    const info = [
      ['Transaction ID', this.paymentData.txnid],
      ['Full Name', this.paymentData.fullName],
      ['Email', this.paymentData.email],
      ['Phone', this.paymentData.phone],
      // ['Course', this.paymentData.course],
      ['Amount Paid (₹)', this.paymentData.amount],
      ['Payment Status', this.paymentData.status?.toUpperCase()],
      ['Date', new Date().toLocaleString()],
    ];

    autoTable(doc, {
      startY: 35,
      head: [['Field', 'Details']],
      body: info,
      theme: 'grid',
      headStyles: { fillColor: [0, 74, 173], textColor: [255, 255, 255] },
      styles: { fontSize: 12 },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.setFontSize(11);
    doc.text('Thank you for choosing Cruise Lens Academy!', pageWidth / 2, finalY + 15, { align: 'center' });
    doc.text('This is a computer-generated receipt, no signature required.', pageWidth / 2, finalY + 22, { align: 'center' });

    const filename = `CruiseLens_Receipt_${this.paymentData.txnid}.pdf`;
    doc.save(filename);
  };
}


  // ✅ Go to Home safely
  goToHome() {
    if (window.opener) {
      window.opener.location.href = '/';
      window.close();
    } else {
      this.router.navigate(['/']);
    }
  }
}
