import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.css']
})
export class PartnersComponent implements OnInit {

  // Gallery images with custom captions
  galleryImages = [
    { url: 'assets/images/image-23.jpg', caption: 'Student Placement Grooming' },
    { url: 'assets/images/image-24.jpg', caption: 'Goa Classroom Training' },
    { url: 'assets/images/image-25.jpg', caption: 'Maritime Safety Induction' },
    { url: 'assets/images/image-26.jpg', caption: 'DSLR Technical Workshop' },
    { url: 'assets/images/image-27.jpg', caption: 'Adobe Lightroom Session' },
    { url: 'assets/images/image-28.webp', caption: 'Outdoor Photography Practice' },
    { url: 'assets/images/image-29.jpg', caption: 'Mentor Guidance Session' },
    { url: 'assets/images/image-30.jpg', caption: 'Onboard Dining Hall Portraiture' },
    { url: 'assets/images/image-31.jpg', caption: 'STCW First Aid Practice' },
    { url: 'assets/images/image-32.jpg', caption: 'Night Portrait Lighting' },
    { url: 'assets/images/image-33.jpg', caption: 'Deck Guest Shooting Practice' },
    { url: 'assets/images/image-34.jpg', caption: 'Onboard Life & Work Culture' },
    { url: 'assets/images/image-35.jpg', caption: 'Seascapes & Composition' },
    { url: 'assets/images/image-36.jpg', caption: 'Career Guidance & Placements' },
    { url: 'assets/images/image-37.jpg', caption: 'Student Group Photo' },
    { url: 'assets/images/image-7.jpg', caption: 'Cruise Ship Sailing' },
    { url: 'assets/images/image-8.jpg', caption: 'Onboard Guest Engagement' },
    { url: 'assets/images/image-9.webp', caption: 'Studio Portrait Session' },
    { url: 'assets/images/image-10.jpg', caption: 'Sunset Cruise Silhouette' },
    { url: 'assets/images/image-11.webp', caption: 'Adobe Photoshop Retouching' }
  ];

  showLightbox = false;
  activeImageIndex = 0;

  constructor() {}

  ngOnInit(): void {}

  /* ================= LIGHTBOX LOGIC ================= */

  openLightbox(index: number): void {
    this.activeImageIndex = index;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  closeLightbox(): void {
    this.showLightbox = false;
    document.body.style.overflow = ''; // Unlock background scrolling
  }

  nextImage(event?: Event): void {
    if (event) event.stopPropagation();
    this.activeImageIndex = (this.activeImageIndex + 1) % this.galleryImages.length;
  }

  prevImage(event?: Event): void {
    if (event) event.stopPropagation();
    this.activeImageIndex = (this.activeImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
  }

  // Keyboard controls for Lightbox
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.showLightbox) {
      if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'Escape') {
        this.closeLightbox();
      }
    }
  }
}
