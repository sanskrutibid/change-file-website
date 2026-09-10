import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  fullText: string = `Recognizing this gap, Rohan built Cruise Lens Academy 
to create a dedicated platform for maritime education, 
ensuring aspiring photographers receive structured guidance, 
hands-on training, and international exposure.`;

  displayedText: string = '';
  currentIndex: number = 0;
  typingSpeed: number = 50;

  galleryImages = [
    { url: '/assets/images/image-18.jpg', alt: 'Classroom Training' },
    { url: '/assets/images/image-19.jpg', alt: 'Hands-on Shoot' },
    { url: '/assets/images/image-20.jpg', alt: 'Student Portraiture' },
    { url: '/assets/images/image-12.jpg', alt: 'Camera Editing Classroom' },
    { url: '/assets/images/image-14.webp', alt: 'Field Practice' },
    { url: '/assets/images/image-6.jpg', alt: 'Graduation Group' }
  ];

  showLightbox = false;
  activeImageIndex = 0;

  ngOnInit() {
    this.typeText();
  }

  typeText() {
    if (this.currentIndex < this.fullText.length) {
      this.displayedText += this.fullText[this.currentIndex];
      this.currentIndex++;
      setTimeout(() => this.typeText(), this.typingSpeed);
    }
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openLightbox(index: number) {
    this.activeImageIndex = index;
    this.showLightbox = true;
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeLightbox() {
    this.showLightbox = false;
    if (typeof window !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  nextImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.activeImageIndex = (this.activeImageIndex + 1) % this.galleryImages.length;
  }

  prevImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.activeImageIndex = (this.activeImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    console.error('IMAGE FAILED TO LOAD:', img.src);
  }
}