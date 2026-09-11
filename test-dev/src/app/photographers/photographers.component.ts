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
import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';

import { environment } from '../../environments/environment';


@Component({
  selector: 'app-photographers',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],

  templateUrl: './photographers.component.html',

  styleUrls: [
    './photographers.component.css'
  ]
})


export class PhotographersComponent
  implements OnInit, AfterViewInit, OnDestroy {


  /* =========================================================
     VIEW
     ========================================================= */

  @ViewChild('track')
  trackRef!: ElementRef;


  /* =========================================================
     PHOTOGRAPHER DATA
     ========================================================= */

  photographers: any[] = [];

  filteredPhotographers: any[] = [];

  doubled: any[] = [];


  /* =========================================================
     CREW GRID
     ========================================================= */

  /*
    6 cards are displayed initially.

    Desktop:
    3 columns × 2 rows = 6 cards
  */

  visibleCount = 6;


  /* =========================================================
     SLIDER VARIABLES
     ========================================================= */

  translateX = 0;

  currentIndex = 0;

  cardWidth = 330;

  isTransitionEnabled = true;


  autoSlideInterval: any = null;


  /* =========================================================
     CARD FLIP
     ========================================================= */

  flippedCard: string | null = null;


  /* =========================================================
     API
     ========================================================= */

  apiUrl =
    `${environment.backendUrl}/testimonials`;


  /* =========================================================
     DIRECTORY VARIABLES
     ========================================================= */

  isStandalonePage = false;

  filterStatus = 'all';

  searchQuery = '';


  /* =========================================================
     CACHE
     ========================================================= */

  private static cachedPhotographers:
    any[] | null = null;


  /* =========================================================
     CONSTRUCTOR
     ========================================================= */

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  ngOnInit(): void {

    this.isStandalonePage =
      this.router.url.includes('/photographers');

    this.loadPhotographers();

  }


  ngAfterViewInit(): void {

    /*
      Only the Home Page embedded version
      uses the carousel.
    */

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


  /* =========================================================
     LOAD PHOTOGRAPHERS
     ========================================================= */

  loadPhotographers(): void {

    /*
      Use cached data if already available.
    */

    if (
      PhotographersComponent.cachedPhotographers
    ) {

      this.photographers =
        PhotographersComponent.cachedPhotographers;

      this.filteredPhotographers =
        this.photographers;

      this.doubled = [
        ...this.photographers,
        ...this.photographers
      ];

      return;
    }


    /*
      API REQUEST
    */

    this.http.get<any[]>(this.apiUrl)
      .subscribe({

        next: (res) => {

          const mapped = res.map(
            (p: any, i: number) => ({

              ...p,

              initials:
                p.initials ||
                p.name
                  ?.split(' ')
                  .map(
                    (n: string) => n[0]
                  )
                  .join('') ||
                `P${i}`,

              skills:
                p.skills
                  ? p.skills
                      .split(',')
                      .map(
                        (s: string) =>
                          s.trim()
                      )
                      .filter(
                        (s: string) =>
                          s.length > 0
                      )
                  : [],

              certifications:
                p.certifications
                  ? p.certifications
                      .split(',')
                      .map(
                        (s: string) =>
                          s.trim()
                      )
                      .filter(
                        (s: string) =>
                          s.length > 0
                      )
                  : []

            })
          );


          /*
            Cache API data
          */

          PhotographersComponent
            .cachedPhotographers = mapped;


          this.photographers = mapped;

          this.filteredPhotographers =
            mapped;


          /*
            Home page carousel
            needs duplicated data.
          */

          this.doubled = [
            ...mapped,
            ...mapped
          ];

        },

        error: (err) => {

          console.error(
            'Failed to load testimonials:',
            err
          );

        }

      });

  }


  /* =========================================================
     GRID DATA
     ========================================================= */

  /*
    Returns only the number of cards
    currently allowed to be displayed.

    Initially:
    6 cards.

    After SEE MORE:
    all filtered cards.
  */

  get displayedPhotographers(): any[] {

    return this.filteredPhotographers
      .slice(
        0,
        this.visibleCount
      );

  }


  /* =========================================================
     SEE MORE
     ========================================================= */

  showMorePhotographers(): void {

    /*
      Display all remaining
      filtered photographers.
    */

    this.visibleCount =
      this.filteredPhotographers.length;

  }


  /* =========================================================
     CARD WIDTH
     ========================================================= */

  detectCardWidth(): void {

    if (this.trackRef) {

      const card =
        this.trackRef.nativeElement
          .querySelector('.card-item');

      if (card) {

        this.cardWidth =
          card.offsetWidth + 24;

      }

    }

  }


  /* =========================================================
     AUTO SLIDE
     ========================================================= */

  startAutoSlide(): void {

    /*
      Only Home page uses
      automatic carousel.
    */

    if (!this.isStandalonePage) {

      this.autoSlideInterval =
        setInterval(() => {

          this.nextSlide();

        }, 3000);

    }

  }


  pauseAutoSlide(): void {

    if (this.autoSlideInterval) {

      clearInterval(
        this.autoSlideInterval
      );

      this.autoSlideInterval = null;

    }

  }


  resumeAutoSlide(): void {

    if (
      !this.isStandalonePage &&
      !this.autoSlideInterval
    ) {

      this.startAutoSlide();

    }

  }


  /* =========================================================
     SLIDER - NEXT
     ========================================================= */

  nextSlide(): void {

    const listLength =
      this.filteredPhotographers.length;


    if (listLength === 0) {

      return;

    }


    this.isTransitionEnabled = true;

    this.currentIndex++;

    this.updatePosition();


    if (
      this.currentIndex === listLength
    ) {

      setTimeout(() => {

        this.isTransitionEnabled =
          false;

        this.currentIndex = 0;

        this.updatePosition();

      }, 600);

    }

  }


  /* =========================================================
     SLIDER - PREVIOUS
     ========================================================= */

  prevSlide(): void {

    const listLength =
      this.filteredPhotographers.length;


    if (listLength === 0) {

      return;

    }


    this.isTransitionEnabled = true;

    this.currentIndex--;


    if (this.currentIndex < 0) {

      this.isTransitionEnabled =
        false;

      this.currentIndex =
        listLength - 1;

      this.updatePosition();


      setTimeout(() => {

        this.isTransitionEnabled =
          true;

      }, 50);

    } else {

      this.updatePosition();

    }

  }


  /* =========================================================
     UPDATE SLIDER POSITION
     ========================================================= */

  updatePosition(): void {

    this.translateX =
      -(this.currentIndex * this.cardWidth);

  }


  /* =========================================================
     CARD FLIP
     ========================================================= */

  flipCard(
    initials: string | null
  ): void {

    this.flippedCard = initials;

  }


  /* =========================================================
     DIRECTORY FILTER
     ========================================================= */

  setFilter(
    status: string
  ): void {

    this.filterStatus = status;

    this.applyFilters();

  }


  /* =========================================================
     SEARCH
     ========================================================= */

  onSearchChange(
    event: any
  ): void {

    this.searchQuery =
      event.target.value
        .toLowerCase()
        .trim();

    this.applyFilters();

  }


  /* =========================================================
     APPLY FILTERS
     ========================================================= */

  applyFilters(): void {

    this.filteredPhotographers =
      this.photographers.filter(
        (p) => {

          /*
            STATUS
          */

          const matchesStatus =
            this.filterStatus === 'all' ||
            p.status === this.filterStatus;


          /*
            NAME
          */

          const nameLower =
            (p.name || '')
              .toLowerCase();


          /*
            INITIALS
          */

          const initialsLower =
            (p.initials || '')
              .toLowerCase();


          /*
            SEARCH
          */

          const matchesSearch =
            nameLower.includes(
              this.searchQuery
            ) ||
            initialsLower.includes(
              this.searchQuery
            );


          return (
            matchesStatus &&
            matchesSearch
          );

        }
      );


    /*
      Reset the visible grid
      after every search/filter.
    */

    this.visibleCount = 6;


    /*
      Reset slider state
      for Home page.
    */

    this.currentIndex = 0;

    this.translateX = 0;

    this.isTransitionEnabled = false;


    /*
      Keep duplicated data
      for the existing Home carousel.
    */

    if (
      this.filteredPhotographers.length > 0
    ) {

      this.doubled = [
        ...this.filteredPhotographers,
        ...this.filteredPhotographers
      ];

    } else {

      this.doubled = [];

    }


    /*
      Recalculate carousel width.
    */

    setTimeout(() => {

      this.detectCardWidth();

      this.isTransitionEnabled = true;

    }, 100);

  }


  /* =========================================================
     TRACK BY
     ========================================================= */

  trackByInitials(
    index: number,
    item: any
  ) {

    return (
      item.initials ||
      item.name ||
      index
    );

  }

}