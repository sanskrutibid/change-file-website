import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-why-cruise',
  imports: [CommonModule],
  templateUrl: './why-cruise.component.html',
  styleUrl: './why-cruise.component.css'
})
export class WhyCruiseComponent {

  // component.ts
features: string[] = [
  'Industry-Focused Training',
  'Experienced Faculty',
  'Global Career Opportunities',
  'End-to-End Guidance',
  'State-of-the-Art Learning',
  'Placement Support',
  'Focused on Personality & Skills',
  'Affordable & Transparent Fees'
];


}
