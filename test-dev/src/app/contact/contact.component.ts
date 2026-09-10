import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-contact',
  imports:[CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent {
  
  enquiryForm: FormGroup;
  successMessage: string = '';
  webAppUrl: string = 'https://script.google.com/macros/s/AKfycbxqS4urC6BEneP5cq6o4dvqOA_XgypzobKmnGxt3i2JVNzgZxYImIbVz7IRUePR8QgYuw/exec'; // ← Replace with your Apps Script Web App URL


  //  webAppUrl: string = 'https://script.google.com/macros/s/AKfycbwN0LMR1jxq47LQO3XlQJXPL2V1H2auknxHf1GtdzQKYevuXoTVPmtfzduKbHBcWQdf/exec';
  
   constructor(private fb: FormBuilder, private http: HttpClient) {
    this.enquiryForm = this.fb.group({
  fullName: ['', [Validators.required, Validators.minLength(3)]],
  phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]], // 10-digit phone
  whatsapp: ['', [Validators.pattern(/^[0-9]{10}$/)]], // optional, but must be valid if entered
  email: ['', [Validators.required, Validators.email]],
  city: ['', Validators.required],
  state: ['', Validators.required],
  course: ['', Validators.required],
  notes: ['', [Validators.required, Validators.minLength(5)]],
});

  }

onSubmit() {
  if (this.enquiryForm.invalid) return;

  const formValue = this.enquiryForm.value;
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = this.webAppUrl;
  form.style.display = 'none';
  form.target = 'hidden_iframe';

  for (const key in formValue) {
    if (formValue.hasOwnProperty(key)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = formValue[key];
      form.appendChild(input);
    }
  }

  const iframe = document.createElement('iframe');
  iframe.name = 'hidden_iframe';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  iframe.onload = () => {
    this.successMessage = 'Thank you! Your enquiry has been submitted.';
    this.enquiryForm.reset();
    setTimeout(() => (this.successMessage = ''), 2000);
    iframe.remove();
  };

  document.body.appendChild(form);
  form.submit();
}

}





