import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatarInitial: string;
}

@Component({
  selector: 'app-success-stories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './success-stories.component.html',
  styleUrls: ['./success-stories.component.css']
})
export class SuccessStoriesComponent {

  constructor(private sanitizer: DomSanitizer) {
    if (this.rawVideoUrl) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawVideoUrl);
    }
  }

  // Set this to true once the real testimonial video URL is added below.
  showVideoModal = false;

  // Replace with the actual hosted video (YouTube/Vimeo embed URL, etc.)
  // e.g. 'https://www.youtube.com/embed/XXXXXXXXXXX'
  rawVideoUrl: string | null = null;

  videoUrl: SafeResourceUrl | null = null;

  testimonials: Testimonial[] = [
    {
      name: 'Anurag Tiwari',
      role: 'CLA Graduate',
      quote: 'CLA changed my life. The training, support and placement assistance is unmatched.',
      avatarInitial: 'A'
    },
    {
      name: 'CLA Student',
      role: 'Cruise Photography Certification',
      quote: 'Professional training, practical exposure and excellent guidance for building a cruise career.',
      avatarInitial: 'S'
    },
    {
      name: 'CLA Student',
      role: 'Complete Cruise Career Program',
      quote: 'A great place to learn photography and understand the opportunities available on cruise ships.',
      avatarInitial: 'R'
    }
  ];

  openVideoModal(): void {
    if (this.videoUrl) {
      this.showVideoModal = true;
    }
  }

  closeVideoModal(): void {
    this.showVideoModal = false;
  }
}