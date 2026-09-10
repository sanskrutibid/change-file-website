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

import { SupabaseService } from '../supabase.service';
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

  isLoading = false;


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {

    // ==========================================================
    // STEP 1 - PERSONAL FORM
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
    // STEP 2 - COURSE FORM
    // ==========================================================

    this.courseForm = this.fb.group({

      course: [
        '',
        Validators.required
      ]

    });


    // ==========================================================
    // STEP 2 - COMMON COURSE QUESTIONS
    // ==========================================================

    this.courseQuestions = this.fb.group({

      // Question 1
      usedCamera: [
        '',
        Validators.required
      ],

      // Question 2
      hospitalityExp: [
        '',
        Validators.required
      ],

      // Question 3
      professionalExperience: [
        '',
        Validators.required
      ],

      // Question 4
      photographyExperience: [
        '',
        Validators.required
      ],

      // Question 5
      visibleTattoos: [
        '',
        Validators.required
      ],

      // Complete Career Program only
      medicalCondition: [
        ''
      ],

      // Optional
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

        // Reset payment whenever course changes
        this.paymentMode = '';

        this.customAmount = 0;

        // Reset medical question
        this.courseQuestions
          .get('medicalCondition')
          ?.reset('');

        // Medical question is required ONLY
        // for Complete Cruise Career Program
        if (value === 'course2') {

          this.courseQuestions
            .get('medicalCondition')
            ?.setValidators(Validators.required);

        } else {

          this.courseQuestions
            .get('medicalCondition')
            ?.clearValidators();

        }

        this.courseQuestions
          .get('medicalCondition')
          ?.updateValueAndValidity();

      });

  }


  // ============================================================
  // COURSE NAME
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
  // COURSE TOTAL FEES
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

      // ----------------------------------------
      // COURSE 1
      // ----------------------------------------

      case 'c1_advance':
        return 50000;

      case 'c1_balance':
        return 149000 - 50000;

      case 'c1_custom':
        return this.customAmount || 0;


      // ----------------------------------------
      // COURSE 2
      // ----------------------------------------

      case 'c2_advance':
        return 50000;

      case 'c2_balance':
        return 208000 - 50000;

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
  // TOTAL INCLUDING PROCESSING FEE
  // ============================================================

  get paymentAmountWithProcessingFee(): number {

    return this.paymentAmount + this.processingFee;

  }


  // ============================================================
  // PREFERRED CONTACT ARRAY
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

    // ----------------------------------------------------------
    // STEP 1
    // ----------------------------------------------------------

    if (this.step === 1) {

      return this.personalForm.valid;

    }


    // ----------------------------------------------------------
    // STEP 2
    // ----------------------------------------------------------

    if (this.step === 2) {

      if (!this.courseForm.valid) {
        return false;
      }

      if (!this.selectedCourse) {
        return false;
      }

      return this.courseQuestions.valid;

    }


    // ----------------------------------------------------------
    // STEP 3
    // ----------------------------------------------------------

    if (this.step === 3) {

      return this.resumeFiles.length > 0;

    }


    // ----------------------------------------------------------
    // STEP 4
    // ----------------------------------------------------------

    if (this.step === 4) {

      if (!this.paymentMode) {
        return false;
      }

      // Custom payment must be >= ₹5,000
      if (
        this.paymentMode === 'c1_custom' ||
        this.paymentMode === 'c2_custom'
      ) {

        return (
          this.customAmount >= 5000
        );

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
  // MARK CURRENT FORM TOUCHED
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
  // MARK FORM GROUP TOUCHED
  // ============================================================

  private markFormGroupTouched(
    formGroup: FormGroup
  ): void {

    Object.values(
      formGroup.controls
    ).forEach(control => {

      control.markAsTouched();

      if (control instanceof FormGroup) {

        this.markFormGroupTouched(
          control
        );

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

    this.selectedCourse =
      selectedValue;

    this.courseForm.patchValue({
      course: selectedValue
    });

    this.paymentMode = '';

    this.customAmount = 0;

  }


  // ============================================================
  // PAYMENT MODE
  // ============================================================

  selectPaymentMode(mode: string): void {

    this.paymentMode = mode;

    // Reset custom amount when
    // switching away from custom
    if (
      mode !== 'c1_custom' &&
      mode !== 'c2_custom'
    ) {

      this.customAmount = 0;

    }

  }


  // ============================================================
  // CUSTOM PAYMENT VALIDATION
  // ============================================================

  validateCustomAmount(): void {

    if (
      this.customAmount === null ||
      this.customAmount === undefined
    ) {

      this.customAmount = 0;

    }

  }


  // ============================================================
  // CHECK CUSTOM PAYMENT
  // ============================================================

  private isCustomPaymentValid(): boolean {

    if (
      this.paymentMode === 'c1_custom' ||
      this.paymentMode === 'c2_custom'
    ) {

      if (
        !this.customAmount ||
        this.customAmount < 5000
      ) {

        alert(
          'Minimum payment amount is ₹5,000.'
        );

        return false;

      }

    }

    return true;

  }


  // ============================================================
  // CHECK PAYMENT MODE
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
      input.files &&
      input.files.length > 0
    ) {

      const newFiles =
        Array.from(input.files);

      // --------------------------------------------------------
      // Validate max 2MB
      // --------------------------------------------------------

      const validFiles: File[] = [];

      for (const file of newFiles) {

        const maxSize =
          2 * 1024 * 1024;

        if (file.size > maxSize) {

          alert(
            `${file.name} is larger than 2MB and was not added.`
          );

          continue;

        }

        validFiles.push(file);

      }


      // --------------------------------------------------------
      // Avoid duplicate files
      // --------------------------------------------------------

      validFiles.forEach(file => {

        const alreadyExists =
          this.resumeFiles.some(
            existingFile =>
              existingFile.name === file.name &&
              existingFile.size === file.size
          );

        if (!alreadyExists) {

          this.resumeFiles.push(file);

        }

      });

    }

    // Allow same file to be selected again
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

      this.resumeFiles.splice(
        index,
        1
      );

    }

  }


  // ============================================================
  // UPLOAD FILES TO BACKEND
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

      }

    }


    return uploadedUrls;

  }


  // ============================================================
  // COURSE DATA
  // ============================================================

  getCourseData(): any {

    if (!this.selectedCourse) {

      return {};

    }

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
  // PAYU FORM SUBMISSION
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


    Object.entries(params)
      .forEach(([key, value]) => {

        const input =
          document.createElement('input');

        input.type = 'hidden';

        input.name = key;

        input.value =
          String(value ?? '');

        form.appendChild(input);

      });


    document.body.appendChild(form);


    setTimeout(
      () => form.submit(),
      0
    );

  }


  // ============================================================
  // PROCEED TO PAYMENT
  // ============================================================

  async proceedToPayment(): Promise<void> {

    // ----------------------------------------------------------
    // Validate Step 1
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // Validate Course
    // ----------------------------------------------------------

    if (!this.courseForm.valid) {

      alert(
        'Please select a course.'
      );

      this.step = 2;

      return;

    }


    // ----------------------------------------------------------
    // Validate Questions
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // Validate Payment
    // ----------------------------------------------------------

    if (!this.paymentMode) {

      alert(
        'Please select a payment option.'
      );

      return;

    }


    // ----------------------------------------------------------
    // Validate Custom Amount
    // ----------------------------------------------------------

    if (!this.isCustomPaymentValid()) {

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


    // ----------------------------------------------------------
    // Processing Fee
    // ----------------------------------------------------------

    const processingFee =
      paymentAmount * 0.025;

    const totalPayable =
      paymentAmount + processingFee;


    console.log(
      'Payment amount:',
      paymentAmount
    );

    console.log(
      'Processing fee:',
      processingFee
    );

    console.log(
      'Total payable:',
      totalPayable
    );


    try {

      this.isLoading = true;


      // --------------------------------------------------------
      // Upload Documents
      // --------------------------------------------------------

      const resumeUrls =
        await this.uploadFiles();


      // --------------------------------------------------------
      // Application Data
      // --------------------------------------------------------

      const applicationData = {

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
          this.preferredContactArray.value,

        course:
          this.courseForm.value.course,

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
        'Application data:',
        applicationData
      );


      // --------------------------------------------------------
      // Initiate PayU
      // --------------------------------------------------------

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


      if (!response.ok) {

        throw new Error(
          `Payment server returned ${response.status}`
        );

      }


      const payuResp =
        await response.json();


      // --------------------------------------------------------
      // Redirect to PayU
      // --------------------------------------------------------

      if (
        payuResp?.payuUrl &&
        payuResp?.payuParams
      ) {

        this.submitPayuForm(
          payuResp.payuUrl,
          payuResp.payuParams
        );

      } else {

        console.error(
          'Invalid PayU response:',
          payuResp
        );

        alert(
          'Error: PayU response invalid.'
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
          : 'Unexpected error';


      alert(
        'Payment error: ' + message
      );

    } finally {

      this.isLoading = false;

    }

  }


  // ============================================================
  // PREFERRED CONTACT
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
  // SUBMIT APPLICATION
  // ============================================================

  async submitApplication(): Promise<void> {

    if (
      !this.personalForm.valid ||
      !this.courseForm.valid ||
      !this.courseQuestions.valid
    ) {

      alert(
        'Please fill all required fields.'
      );

      return;

    }


    if (
      !this.resumeFiles.length
    ) {

      alert(
        'Please upload at least one document.'
      );

      return;

    }


    this.isLoading = true;


    try {

      const resumeUrls =
        await this.uploadFiles();


      const applicationData = {

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
          this.preferredContactArray.value,

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
          this.paymentMode

      };


      const {
        data: insertData,
        error: insertError
      } =
        await this.supabaseService
          .insertApplication(
            applicationData
          );


      if (insertError) {

        console.error(
          'Database insert error:',
          insertError.message
        );

        alert(
          'Error submitting application!'
        );

      } else {

        console.log(
          'Application inserted:',
          insertData
        );

        alert(
          'Application submitted successfully!'
        );

        this.resetForms();

      }

    } catch (error) {

      console.error(
        'Unexpected error:',
        error
      );

      alert(
        'Something went wrong!'
      );

    } finally {

      this.isLoading = false;

    }

  }


  // ============================================================
  // RESET
  // ============================================================

  resetForms(): void {

    this.personalForm.reset();

    this.courseForm.reset();

    this.courseQuestions.reset();


    // Re-create empty preferred contact array
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