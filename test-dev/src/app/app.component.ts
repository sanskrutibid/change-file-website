import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from '@angular/common';
import { PopupService } from './services/popup.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit,OnDestroy 
  
{
  showImagePopup = false;
  enablePopup = false; // Toggle to true to re-enable the opening popup
  images: string[] = [];
  currentImageIndex = 0;
  sliderInterval: any;

  constructor(
    private router: Router,
    private popupService: PopupService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  ngOnInit() {
    if (!this.enablePopup) {
      return;
    }
    const seen = sessionStorage.getItem('imagePopupSeen');

    if (!seen) {
      this.popupService.getPopupImages().subscribe(res => {

        this.images = res.map(img => img.image_url);

        if (this.images.length > 0) {
          setTimeout(() => {
            this.showImagePopup = true;
            this.startAutoSlide();
          }, 1200);
        }

      });
    }
  }

  startAutoSlide() {
    this.sliderInterval = setInterval(() => {
      this.nextImage();
    }, 3500);
  }

  nextImage() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.images.length;
  }

  prevImage() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) %
      this.images.length;
  }

  closePopup() {
    this.showImagePopup = false;
    sessionStorage.setItem('imagePopupSeen', 'true');
    clearInterval(this.sliderInterval);
  }

  ngOnDestroy() {
    clearInterval(this.sliderInterval);
  }
}
