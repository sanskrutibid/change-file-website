import { Routes } from '@angular/router';

export const routes: Routes = [

  // =========================
  // HOME
  // =========================

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component')
        .then(m => m.HomeComponent)
  },


  // =========================
  // ABOUT
  // =========================

  {
    path: 'about',
    loadComponent: () =>
      import('./about/about.component')
        .then(m => m.AboutComponent)
  },


  // =========================
  // CLA 2.0 PROGRAMS
  // =========================

  // Program 1
  {
    path: 'certification-cruise-photography',
    loadComponent: () =>
      import('./course-1/course-1.component')
        .then(m => m.Course1Component)
  },

  // Program 2
  {
    path: 'complete-cruise-career',
    loadComponent: () =>
      import('./course-2/course-2.component')
        .then(m => m.Course2Component)
  },


  // =========================
  // OLD PARTNERS ROUTE
  // =========================

  // Keep the old URL working, but redirect it to About.
  {
    path: 'partners',
    redirectTo: 'about',
    pathMatch: 'full'
  },


  // =========================
  // SUCCESS STORIES
  // =========================

  // NOTE: Update the import path / component class name below to match
  // your actual success-stories component location and class name.
  {
    path: 'success-stories',
    loadComponent: () =>
      import('./success-stories/success-stories.component')
        .then(m => m.SuccessStoriesComponent)
  },


  // =========================
  // CONTACT
  // =========================

  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component')
        .then(m => m.ContactComponent)
  },


  // =========================
  // FAQ
  // =========================

  {
    path: 'faq',
    loadComponent: () =>
      import('./faq/faq.component')
        .then(m => m.FaqComponent)
  },


  // =========================
  // APPLY NOW
  // =========================

  {
    path: 'apply-now',
    loadComponent: () =>
      import('./apply-now/apply-now.component')
        .then(m => m.ApplyNowComponent)
  },


  // =========================
  // WHY CRUISE
  // =========================

  {
    path: 'why-cruise',
    loadComponent: () =>
      import('./why-cruise/why-cruise.component')
        .then(m => m.WhyCruiseComponent)
  },


  // =========================
  // PHOTOGRAPHERS / CREW DECK
  // =========================

  {
    path: 'photographers',
    loadComponent: () =>
      import('./photographers/photographers.component')
        .then(m => m.PhotographersComponent)
  },


  // =========================
  // POLICIES
  // =========================

  {
    path: 'terms&Condition',
    loadComponent: () =>
      import('./terms-conditions/terms-conditions.component')
        .then(m => m.TermsConditionsComponent)
  },

  {
    path: 'privacy-policy',
    loadComponent: () =>
      import('./privacy-policy/privacy-policy.component')
        .then(m => m.PrivacyPolicyComponent)
  },

  {
    path: 'refund-cancellation-policy',
    loadComponent: () =>
      import('./refund-cancellation-policy/refund-cancellation-policy.component')
        .then(m => m.RefundCancellationPolicyComponent)
  },

  {
    path: 'disclaimer',
    loadComponent: () =>
      import('./disclaimer/disclaimer.component')
        .then(m => m.DisclaimerComponent)
  },

  {
    path: 'cookie-policy',
    loadComponent: () =>
      import('./cookie-policy/cookie-policy.component')
        .then(m => m.CookiePolicyComponent)
  },

  {
    path: 'Shipping-Delivery-Policy',
    loadComponent: () =>
      import('./shipping-delivery-policy/shipping-delivery-policy.component')
        .then(m => m.ShippingDeliveryPolicyComponent)
  },

  {
    path: 'grievance-redressal-policy',
    loadComponent: () =>
      import('./grievance-redressal-policy/grievance-redressal-policy.component')
        .then(m => m.GrievanceRedressalPolicyComponent)
  },

  {
    path: 'academic-training-policy',
    loadComponent: () =>
      import('./academic-training-policy/academic-training-policy.component')
        .then(m => m.AcademicTrainingPolicyComponent)
  },

  {
    path: 'code-conduct-policy',
    loadComponent: () =>
      import('./code-conduct-policy/code-conduct-policy.component')
        .then(m => m.CodeConductPolicyComponent)
  },

  {
    path: 'academic-integrity-policy',
    loadComponent: () =>
      import('./academic-integrity-policy/academic-integrity-policy.component')
        .then(m => m.AcademicIntegrityPolicyComponent)
  },

  {
    path: 'payment-emi-policy',
    loadComponent: () =>
      import('./payment-emi-policy/payment-emi-policy.component')
        .then(m => m.PaymentEMIPolicyComponent)
  },


  // =========================
  // PAYMENT
  // =========================

  {
    path: 'payment-success',
    loadComponent: () =>
      import('./payment-success/payment-success.component')
        .then(m => m.PaymentSuccessComponent)
  },

  {
    path: 'payment-failure',
    loadComponent: () =>
      import('./payment-failure/payment-failure.component')
        .then(m => m.PaymentFailureComponent)
  },


  // =========================
  // FALLBACK
  // =========================

  {
    path: '**',
    redirectTo: 'home'
  }

];