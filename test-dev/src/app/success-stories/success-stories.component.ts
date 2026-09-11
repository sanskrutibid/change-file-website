import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

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

  showVideoModal = false;

  // Vimeo video URL
  rawVideoUrl: string =
    'https://player.vimeo.com/video/1225859631';

  videoUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {

    if (this.rawVideoUrl) {
      this.videoUrl =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          this.rawVideoUrl
        );
    }

  }

  testimonials: Testimonial[] = [
    {
      name: 'Anurag Tiwari',
      role: 'CLA Graduate',
      quote:
        'CLA changed my life. The training, support and placement assistance is unmatched.',
      avatarInitial: 'A'
    },
    {
      name: 'CLA Student',
      role: 'Cruise Photography Certification',
      quote:
        'Professional training, practical exposure and excellent guidance for building a cruise career.',
      avatarInitial: 'S'
    },
    {
      name: 'CLA Student',
      role: 'Complete Cruise Career Program',
      quote:
        'A great place to learn photography and understand the opportunities available on cruise ships.',
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
