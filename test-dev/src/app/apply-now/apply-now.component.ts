import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-apply-now',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './apply-now.component.html',
  styleUrls: ['./apply-now.component.css']
})
export class ApplyNowComponent implements OnInit {

  // ============================================================
  // STEP
  // ============================================================

  step = 1;

  // ============================================================
  // FORMS
  // ============================================================

  personalForm: FormGroup;
  courseForm: FormGroup;
  courseQuestions: FormGroup;

  // ============================================================
  // COURSE
  // ============================================================

  selectedCourse = '';

  // ============================================================
  // DOCUMENTS
  // ============================================================

  resumeFiles: File[] = [];

  // ============================================================
  // PAYMENT
  // ============================================================

  paymentMode = '';
  customAmount = 0;

  // ============================================================
  // BANK DETAILS MODAL (UPI / IMPS / NEFT / RTGS)
  // ============================================================

  showBankDetails = false;

  bankDetails = {
    accountHolderName: 'Your Company Pvt Ltd',   // TODO: replace with real value
    bankName: 'HDFC Bank',                        // TODO: replace with real value
    accountNumber: '000000000000',                // TODO: replace with real value
    ifscCode: 'HDFC0000000',                      // TODO: replace with real value
    upiId: 'yourcompany@hdfcbank',                // TODO: replace with real value
    qrCodeUrl: ''                                  // TODO: set to your real QR image path, e.g. '/assets/images/upi-qr.png'
  };

  // ============================================================
  // LOADING
  // ============================================================

  isLoading = false;

  constructor(private fb: FormBuilder) {

    // ==========================================================
    // STEP 1 - PERSONAL DETAILS
    // ==========================================================

    this.personalForm = this.fb.group({

      fullName: [
        '',
        Validators.required
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        Validators.required
      ],

      city: [
        '',
        Validators.required
      ],

      dob: [
        '',
        Validators.required
      ],

      preferredContact: this.fb.array(
        [],
        Validators.required
      ),

      heardFrom: [
        '',
        Validators.required
      ]

    });

    // ==========================================================
    // STEP 2 - COURSE
    // ==========================================================

    this.courseForm = this.fb.group({

      course: [
        '',
        Validators.required
      ]

    });

    // ==========================================================
    // COURSE QUESTIONS
    // ==========================================================

    this.courseQuestions = this.fb.group({

      usedCamera: [
        '',
        Validators.required
      ],

      hospitalityExp: [
        '',
        Validators.required
      ],

      professionalExperience: [
        '',
        Validators.required
      ],

      photographyExperience: [
        '',
        Validators.required
      ],

      visibleTattoos: [
        '',
        Validators.required
      ],

      medicalCondition: [
        ''
      ],

      message: [
        ''
      ]

    });
  }

  // ============================================================
  // INIT
  // ============================================================

  ngOnInit(): void {

    this.courseForm
      .get('course')
      ?.valueChanges
      .subscribe((value: string) => {

        this.selectedCourse = value;

        this.paymentMode = '';
        this.customAmount = 0;

        const medicalControl =
          this.courseQuestions.get('medicalCondition');

        medicalControl?.reset('');

        if (value === 'course2') {

          medicalControl?.setValidators(
            Validators.required
          );

        } else {

          medicalControl?.clearValidators();

        }

        medicalControl?.updateValueAndValidity();

      });

  }

  // ============================================================
  // SELECTED COURSE NAME
  // ============================================================

  get selectedCourseName(): string {

    switch (this.selectedCourse) {

      case 'course1':
        return 'Certification in Cruise Photography';

      case 'course2':
        return 'Complete Cruise Career Program';

      default:
        return '';

    }
  }

  // ============================================================
  // COURSE TOTAL
  // ============================================================

  get selectedCourseTotal(): number {

    switch (this.selectedCourse) {

      case 'course1':
        return 149000;

      case 'course2':
        return 208000;

      default:
        return 0;

    }
  }

  // ============================================================
  // PAYMENT AMOUNT
  // ============================================================

  get paymentAmount(): number {

    switch (this.paymentMode) {

      case 'c1_advance':
        return 50000;

      case 'c1_balance':
        return 99000;

      case 'c1_custom':
        return this.customAmount || 0;

      case 'c2_advance':
        return 50000;

      case 'c2_balance':
        return 158000;

      case 'c2_custom':
        return this.customAmount || 0;

      default:
        return 0;
    }
  }

  // ============================================================
  // PROCESSING FEE
  // ============================================================

  get processingFee(): number {

    return this.paymentAmount * 0.025;

  }

  // ============================================================
  // TOTAL PAYABLE
  // ============================================================

  get paymentAmountWithProcessingFee(): number {

    return this.paymentAmount + this.processingFee;

  }

  // ============================================================
  // IS CUSTOM AMOUNT INVALID (for template error/disabled states)
  // ============================================================

  get isCustomAmountInvalid(): boolean {

    if (
      this.paymentMode !== 'c1_custom' &&
      this.paymentMode !== 'c2_custom'
    ) {

      return false;

    }

    return !this.customAmount || this.customAmount < 5000;

  }

  // ============================================================
  // PREFERRED CONTACT
  // ============================================================

  get preferredContactArray(): FormArray {

    return this.personalForm.get(
      'preferredContact'
    ) as FormArray;

  }

  // ============================================================
  // CURRENT STEP VALIDATION
  // ============================================================

  isCurrentStepValid(): boolean {

    // STEP 1
    if (this.step === 1) {

      return this.personalForm.valid;

    }

    // STEP 2
    if (this.step === 2) {

      if (!this.courseForm.valid) {
        return false;
      }

      if (!this.selectedCourse) {
        return false;
      }

      return this.courseQuestions.valid;

    }

    // STEP 3
    if (this.step === 3) {

      return this.resumeFiles.length > 0;

    }

    // STEP 4
    if (this.step === 4) {

      if (!this.paymentMode) {
        return false;
      }

      if (
        this.paymentMode === 'c1_custom' ||
        this.paymentMode === 'c2_custom'
      ) {

        return this.customAmount >= 5000;

      }

      return this.paymentAmount >= 5000;

    }

    return false;
  }

  // ============================================================
  // NEXT STEP
  // ============================================================

  nextStep(): void {

    if (!this.isCurrentStepValid()) {

      this.markCurrentStepTouched();

      return;

    }

    if (this.step < 4) {

      this.step++;

    }

  }

  // ============================================================
  // PREVIOUS STEP
  // ============================================================

  prevStep(): void {

    if (this.step > 1) {

      this.step--;

    }

  }

  // ============================================================
  // MARK CURRENT STEP TOUCHED
  // ============================================================

  private markCurrentStepTouched(): void {

    if (this.step === 1) {

      this.markFormGroupTouched(
        this.personalForm
      );

    }

    if (this.step === 2) {

      this.markFormGroupTouched(
        this.courseForm
      );

      this.markFormGroupTouched(
        this.courseQuestions
      );

    }

  }

  // ============================================================
  // MARK FORM TOUCHED
  // ============================================================

  private markFormGroupTouched(
    formGroup: FormGroup
  ): void {

    Object.values(
      formGroup.controls
    ).forEach(control => {

      control.markAsTouched();

      if (control instanceof FormGroup) {

        this.markFormGroupTouched(control);

      }

      if (control instanceof FormArray) {

        control.controls.forEach(child => {

          child.markAsTouched();

        });

      }

    });

  }

  // ============================================================
  // COURSE CHANGE
  // ============================================================

  onCourseChange(event: Event): void {

    const target =
      event.target as HTMLSelectElement;

    const selectedValue =
      target.value;

    this.courseForm.patchValue({
      course: selectedValue
    });

  }

  // ============================================================
  // PAYMENT MODE
  // ============================================================

  selectPaymentMode(mode: string): void {

    this.paymentMode = mode;

    if (
      mode !== 'c1_custom' &&
      mode !== 'c2_custom'
    ) {

      this.customAmount = 0;

    }

  }

  // ============================================================
  // CUSTOM PAYMENT
  // ============================================================

  validateCustomAmount(): void {

    if (
      !this.customAmount ||
      this.customAmount < 0
    ) {

      this.customAmount = 0;

    }

  }

  // ============================================================
  // PAYMENT AMOUNT FOR BACKEND
  // ============================================================

  private getPaymentAmountForSubmission(): number {

    switch (this.paymentMode) {

      case 'c1_advance':
        return 50000;

      case 'c1_balance':
        return 99000;

      case 'c1_custom':
        return this.customAmount;

      case 'c2_advance':
        return 50000;

      case 'c2_balance':
        return 158000;

      case 'c2_custom':
        return this.customAmount;

      default:
        return 0;

    }

  }

  // ============================================================
  // FILE UPLOAD
  // ============================================================

  onFileChange(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }

    const maxSize =
      2 * 1024 * 1024;

    const newFiles =
      Array.from(input.files);

    for (const file of newFiles) {

      // 2 MB validation
      if (file.size > maxSize) {

        alert(
          `${file.name} is larger than 2MB and was not added.`
        );

        continue;

      }

      // Optional: restrict file types
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {

        alert(
          `${file.name} is not a supported file type.`
        );

        continue;

      }

      // Prevent duplicate
      const alreadyExists =
        this.resumeFiles.some(
          existingFile =>
            existingFile.name === file.name &&
            existingFile.size === file.size
        );

      if (!alreadyExists) {

        this.resumeFiles.push(file);

      }

    }

    // Allow selecting same file again
    input.value = '';

  }

  // ============================================================
  // REMOVE FILE
  // ============================================================

  removeFile(index: number): void {

    if (
      index >= 0 &&
      index < this.resumeFiles.length
    ) {

      this.resumeFiles.splice(index, 1);

    }

  }

  // ============================================================
  // UPLOAD FILES
  // ============================================================

  async uploadFiles(): Promise<string[]> {

    if (!this.resumeFiles.length) {

      return [];

    }

    const uploadedUrls: string[] = [];

    for (const file of this.resumeFiles) {

      const formData =
        new FormData();

      formData.append(
        'file',
        file
      );

      const response =
        await fetch(
          `${environment.backendUrl}/upload-resume`,
          {
            method: 'POST',
            body: formData
          }
        );

      if (!response.ok) {

        throw new Error(
          `Failed to upload ${file.name}`
        );

      }

      const result =
        await response.json();

      if (result.fileUrl) {

        uploadedUrls.push(
          result.fileUrl
        );

      } else {

        throw new Error(
          `No file URL returned for ${file.name}`
        );

      }

    }

    return uploadedUrls;

  }

  // ============================================================
  // COURSE DATA
  // ============================================================

  getCourseData(): any {

    return {

      usedCamera:
        this.courseQuestions.value.usedCamera,

      hospitalityExp:
        this.courseQuestions.value.hospitalityExp,

      professionalExperience:
        this.courseQuestions.value.professionalExperience,

      photographyExperience:
        this.courseQuestions.value.photographyExperience,

      visibleTattoos:
        this.courseQuestions.value.visibleTattoos,

      medicalCondition:
        this.selectedCourse === 'course2'
          ? this.courseQuestions.value.medicalCondition
          : null,

      message:
        this.courseQuestions.value.message

    };

  }

  // ============================================================
  // PAYU FORM
  // ============================================================

  private submitPayuForm(
    payuUrl: string,
    params: Record<string, string>
  ): void {

    const form =
      document.createElement('form');

    form.method = 'POST';
    form.action = payuUrl;
    form.target = '_self';
    form.style.display = 'none';

    Object.entries(params).forEach(
      ([key, value]) => {

        const input =
          document.createElement('input');

        input.type = 'hidden';
        input.name = key;
        input.value = String(value ?? '');

        form.appendChild(input);

      }
    );

    document.body.appendChild(form);

    form.submit();

  }

  // ============================================================
  // PROCEED TO PAYMENT
  // ============================================================

  async proceedToPayment(): Promise<void> {

    // ==========================================================
    // VALIDATE PERSONAL DETAILS
    // ==========================================================

    if (!this.personalForm.valid) {

      alert(
        'Please complete all required personal information.'
      );

      this.step = 1;

      this.markFormGroupTouched(
        this.personalForm
      );

      return;

    }

    // ==========================================================
    // VALIDATE COURSE
    // ==========================================================

    if (!this.courseForm.valid) {

      alert(
        'Please select a course.'
      );

      this.step = 2;

      this.markFormGroupTouched(
        this.courseForm
      );

      return;

    }

    // ==========================================================
    // VALIDATE QUESTIONS
    // ==========================================================

    if (!this.courseQuestions.valid) {

      alert(
        'Please complete all required course details.'
      );

      this.step = 2;

      this.markFormGroupTouched(
        this.courseQuestions
      );

      return;

    }

    // ==========================================================
    // VALIDATE RESUME
    // ==========================================================

    if (!this.resumeFiles.length) {

      alert(
        'Please upload at least one document.'
      );

      this.step = 3;

      return;

    }

    // ==========================================================
    // VALIDATE PAYMENT
    // ==========================================================

    if (!this.paymentMode) {

      alert(
        'Please select a payment option.'
      );

      this.step = 4;

      return;

    }

    const paymentAmount =
      this.getPaymentAmountForSubmission();

    if (
      !paymentAmount ||
      paymentAmount < 5000
    ) {

      alert(
        'Minimum payment amount is ₹5,000.'
      );

      return;

    }

    // ==========================================================
    // PROCESSING FEE
    // ==========================================================

    const processingFee =
      Number(
        (paymentAmount * 0.025).toFixed(2)
      );

    const totalPayable =
      Number(
        (paymentAmount + processingFee).toFixed(2)
      );

    // ==========================================================
    // START
    // ==========================================================

    this.isLoading = true;

    try {

      // ========================================================
      // UPLOAD RESUME
      // ========================================================

      const resumeUrls =
        await this.uploadFiles();

      // ========================================================
      // APPLICATION DATA
      // ========================================================

      const applicationData = {

        // ⚠️ server.js checks `personalInfo?.fullName` and
        // `personalInfo?.email` (see /api/payu-initiate) — these
        // MUST be nested under `personalInfo`, not sent flat, or
        // the backend responds with "Missing required fields".
        personalInfo: {

          fullName:
            this.personalForm.value.fullName,

          email:
            this.personalForm.value.email,

          phone:
            this.personalForm.value.phone,

          city:
            this.personalForm.value.city,

          dob:
            this.personalForm.value.dob,

          heardFrom:
            this.personalForm.value.heardFrom,

          preferredContact:
            this.preferredContactArray.value

        },

        course:
          this.selectedCourse,

        courseName:
          this.selectedCourseName,

        courseTotalFees:
          this.selectedCourseTotal,

        courseData:
          this.getCourseData(),

        resume_urls:
          resumeUrls,

        paymentMode:
          this.paymentMode,

        amount:
          paymentAmount.toFixed(2),

        processingFee:
          processingFee.toFixed(2),

        totalPayable:
          totalPayable.toFixed(2)

      };

      console.log(
        'Sending application:',
        applicationData
      );

      // ========================================================
      // CALL BACKEND
      // ========================================================

      const response =
        await fetch(
          `${environment.backendUrl}/payu-initiate`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify(
                applicationData
              )

          }
        );

      // ========================================================
      // CHECK RESPONSE
      // ========================================================

      if (!response.ok) {

        const errorText =
          await response.text();

        throw new Error(
          errorText ||
          `Server returned ${response.status}`
        );

      }

      const payuResp =
        await response.json();

      console.log(
        'PayU response:',
        payuResp
      );

      // ========================================================
      // REDIRECT TO PAYU
      // ========================================================

      if (
        payuResp &&
        payuResp.payuUrl &&
        payuResp.payuParams
      ) {

        this.submitPayuForm(
          payuResp.payuUrl,
          payuResp.payuParams
        );

      } else {

        throw new Error(
          'Invalid PayU response from server.'
        );

      }

    } catch (error) {

      console.error(
        'Payment error:',
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Unexpected error occurred.';

      alert(
        `Payment error: ${message}`
      );

    } finally {

      this.isLoading = false;

    }

  }

  // ============================================================
  // PREFERRED CONTACT CHECKBOX
  // ============================================================

  onCheckboxChange(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    const checkArray =
      this.preferredContactArray;

    if (input.checked) {

      const alreadyExists =
        checkArray.controls.some(
          control =>
            control.value === input.value
        );

      if (!alreadyExists) {

        checkArray.push(
          this.fb.control(
            input.value
          )
        );

      }

    } else {

      const index =
        checkArray.controls.findIndex(
          control =>
            control.value === input.value
        );

      if (index >= 0) {

        checkArray.removeAt(index);

      }

    }

    checkArray.markAsTouched();
    checkArray.updateValueAndValidity();

  }

  // ============================================================
  // BANK DETAILS MODAL (UPI / IMPS / NEFT / RTGS)
  // ============================================================

  openBankDetails(): void {

    this.showBankDetails = true;

  }

  closeBankDetails(): void {

    this.showBankDetails = false;

  }

  copyToClipboard(value: string): void {

    navigator.clipboard
      ?.writeText(value)
      .catch(err => {

        console.error(
          'Copy failed:',
          err
        );

      });

  }

  downloadBankDetails(): void {

    // Lightweight client-side download so the button works today.
    // Swap this for a call to a backend endpoint that returns a
    // branded PDF whenever that's ready.

    const lines = [

      'Bank & Payment Details',
      '------------------------------',
      `Account Holder Name: ${this.bankDetails.accountHolderName}`,
      `Bank Name: ${this.bankDetails.bankName}`,
      `Account Number: ${this.bankDetails.accountNumber}`,
      `IFSC Code: ${this.bankDetails.ifscCode}`,
      `UPI ID: ${this.bankDetails.upiId}`

    ].join('\n');

    const blob =
      new Blob(
        [lines],
        { type: 'text/plain' }
      );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;
    link.download = 'bank-payment-details.txt';
    link.click();

    window.URL.revokeObjectURL(url);

  }

  // ============================================================
  // RESET
  // ============================================================

  resetForms(): void {

    this.personalForm.reset();
    this.courseForm.reset();
    this.courseQuestions.reset();

    const preferredContact =
      this.preferredContactArray;

    while (
      preferredContact.length > 0
    ) {

      preferredContact.removeAt(0);

    }

    this.resumeFiles = [];

    this.paymentMode = '';
    this.customAmount = 0;
    this.selectedCourse = '';
    this.step = 1;

  }

}