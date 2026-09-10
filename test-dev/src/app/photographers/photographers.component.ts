import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-photographers',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './photographers.component.html',
  styleUrls: ['./photographers.component.css']
})
export class PhotographersComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('track') trackRef!: ElementRef;

  photographers: any[] = [];
  doubled: any[] = [];

  translateX = 0;
  currentIndex = 0;
  cardWidth = 330;
  isTransitionEnabled = true;

  autoSlideInterval: any = null;
  flippedCard: string | null = null;

  apiUrl = `${environment.backendUrl}/testimonials`;

  // Directory filter variables
  isStandalonePage = false;
  filterStatus = 'all';
  searchQuery = '';
  filteredPhotographers: any[] = [];

  private static cachedPhotographers: any[] | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.isStandalonePage = this.router.url.includes('/photographers');
    this.loadPhotographers();
  }

  ngAfterViewInit(): void {
    if (!this.isStandalonePage) {
      setTimeout(() => {
        this.detectCardWidth();
        this.startAutoSlide();
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.pauseAutoSlide();
  }

  loadPhotographers(): void {
    if (PhotographersComponent.cachedPhotographers) {
      this.photographers = PhotographersComponent.cachedPhotographers;
      this.filteredPhotographers = this.photographers;
      this.doubled = [...this.photographers, ...this.photographers];
      return;
    }

    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (res) => {
        const mapped = res.map((p: any, i: number) => ({
          ...p,
          initials:
            p.initials ||
            p.name?.split(' ').map((n: string) => n[0]).join('') ||
            `P${i}`,
          skills: p.skills ? p.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [],
          certifications: p.certifications ? p.certifications.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : []
        }));

        PhotographersComponent.cachedPhotographers = mapped;
        this.photographers = mapped;
        this.filteredPhotographers = mapped;
        this.doubled = [...mapped, ...mapped];
      },
      error: (err) => {
        console.error('Failed to load testimonials:', err);
      }
    });
  }

  detectCardWidth(): void {
    if (this.trackRef) {
      const card = this.trackRef.nativeElement.querySelector('.card-item');
      if (card) {
        this.cardWidth = card.offsetWidth + 24;
      }
    }
  }

  /* ================= AUTO SLIDE ================= */

  startAutoSlide(): void {
    if (!this.isStandalonePage) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 3000);
    }
  }

  pauseAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  resumeAutoSlide(): void {
    if (!this.isStandalonePage && !this.autoSlideInterval) {
      this.startAutoSlide();
    }
  }

  /* ================= SLIDER CONTROLS ================= */

  nextSlide(): void {
    const listLength = this.filteredPhotographers.length;
    if (listLength === 0) return;

    this.isTransitionEnabled = true;
    this.currentIndex++;
    this.updatePosition();

    if (this.currentIndex === listLength) {
      setTimeout(() => {
        this.isTransitionEnabled = false;
        this.currentIndex = 0;
        this.updatePosition();
      }, 600);
    }
  }

  prevSlide(): void {
    const listLength = this.filteredPhotographers.length;
    if (listLength === 0) return;

    this.isTransitionEnabled = true;
    this.currentIndex--;

    if (this.currentIndex < 0) {
      this.isTransitionEnabled = false;
      this.currentIndex = listLength - 1;
      this.updatePosition();

      setTimeout(() => {
        this.isTransitionEnabled = true;
      }, 50);
    } else {
      this.updatePosition();
    }
  }

  updatePosition(): void {
    this.translateX = -(this.currentIndex * this.cardWidth);
  }

  /* ================= CARD FLIP ================= */

  flipCard(initials: string | null): void {
    this.flippedCard = initials;
  }

  /* ================= DIRECTORY FILTERS ================= */

  setFilter(status: string): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  onSearchChange(event: any): void {
    this.searchQuery = event.target.value.toLowerCase().trim();
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredPhotographers = this.photographers.filter(p => {
      const matchesStatus = this.filterStatus === 'all' || p.status === this.filterStatus;
      const nameLower = (p.name || '').toLowerCase();
      const initialsLower = (p.initials || '').toLowerCase();
      const matchesSearch = nameLower.includes(this.searchQuery) || initialsLower.includes(this.searchQuery);
      return matchesStatus && matchesSearch;
    });

    // Reset slider state
    this.currentIndex = 0;
    this.translateX = 0;
    this.isTransitionEnabled = false;

    // Double for infinite scroll track (only if we have elements)
    if (this.filteredPhotographers.length > 0) {
      this.doubled = [...this.filteredPhotographers, ...this.filteredPhotographers];
    } else {
      this.doubled = [];
    }

    setTimeout(() => {
      this.detectCardWidth();
      this.isTransitionEnabled = true;
    }, 100);
  }

  trackByInitials(index: number, item: any) {
    return item.initials || item.name || index;
  }
}
