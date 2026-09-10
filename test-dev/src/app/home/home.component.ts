import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, NgZone, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PhotographersComponent } from "../photographers/photographers.component";
interface Slide {
  title: string;
  subtitle: string;
  img: string;
  link: string;
  direction?: 'left' | 'right'; 
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PhotographersComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;   // 👈 yeh line zaroori hai
  @ViewChild('grid') grid!: ElementRef<HTMLDivElement>;

  spotlightSize = 500;

  images = [
    '/assets/images/image-1.jpg',
    '/assets/images/image-16.jpg',
    '/assets/images/image-2.jpg',
    '/assets/images/image-4.jpg',
    '/assets/images/image-5.jpg',
    '/assets/images/image-6.jpg',
    '/assets/images/image-7.jpg',
    '/assets/images/image-8.jpg',
    '/assets/images/image-9.webp',
     '/assets/images/image-10.jpg',
    '/assets/images/image-11.webp',
    '/assets/images/image-12.jpg',
     '/assets/images/image-13.jpg',
    '/assets/images/image-14.webp',
    '/assets/images/image-15.webp',
    '/assets/images/image-17.webp',
  ];

  constructor(private router: Router, private ngZone: NgZone) {}

  onMouseMove(event: MouseEvent) {
    if (!this.overlay || !this.grid) return;

    this.ngZone.runOutsideAngular(() => {
      const x = event.clientX;
      const y = event.clientY;
      const size = this.spotlightSize;

      this.overlay.nativeElement.style.background = `
        radial-gradient(
          circle ${size/2}px at ${x}px ${y}px,
          rgba(255,255,255,0.15) 0%,
          transparent 70%,
          rgba(0,0,0,0.85) 100%
        )
      `;

      // Lens border (CSS vars)
      this.overlay.nativeElement.style.setProperty('--lens-x', `${x}px`);
      this.overlay.nativeElement.style.setProperty('--lens-y', `${y}px`);

      // Rotate grid slightly based on mouse position
      const rotateX = (y / window.innerHeight - 0.5) * 90;
      const rotateY = (x / window.innerWidth - 0.5) * 90;

      this.grid.nativeElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }

  onMouseLeave() {
    if (!this.overlay || !this.grid) return;

    this.ngZone.runOutsideAngular(() => {
      this.overlay.nativeElement.style.background = `black`;
      this.overlay.nativeElement.style.setProperty('--lens-x', `-9999px`);
      this.overlay.nativeElement.style.setProperty('--lens-y', `-9999px`);
      this.grid.nativeElement.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  videoIcons = [
    { icon: 'bi bi-camera-reels', label: 'Introduction', video: 'assets/Video/shoot.mp4' },
    { icon: 'bi bi-camera2', label: 'Behind the Scenes', video: 'assets/Video/shoot-1.mp4' },
    { icon: 'bi bi-collection-play', label: 'Student Stories', video: 'assets/Video/student.mp4' }
  ];

  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  selectedVideo: string | null = null;

  selectVideo(index: number) {
    this.selectedVideo = this.videoIcons[index].video;

    setTimeout(() => {
      this.videoPlayer?.nativeElement.play().catch((err: any) => console.log(err));
    }, 0);
  }

  closeVideo() {
    this.selectedVideo = null;
  }

  playFullscreenVideo(src: string) {
    const iframe = document.createElement('iframe');
    iframe.src = src + '?autoplay=1&rel=0&controls=1&modestbranding=1';
    iframe.allow = 'autoplay; fullscreen';
    iframe.allowFullscreen = true;
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100vw';
    iframe.style.height = '100vh';
    iframe.style.zIndex = '9999';
    iframe.style.border = 'none';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.fontSize = '2rem';
    closeBtn.style.color = 'white';
    closeBtn.style.background = 'transparent';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.zIndex = '10000';

    const removeIframe = () => {
      document.body.removeChild(iframe);
      document.body.removeChild(closeBtn);
      document.removeEventListener('keydown', onEsc);
    };

    iframe.addEventListener('click', removeIframe);
    closeBtn.addEventListener('click', removeIframe);

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') removeIframe();
    };
    document.addEventListener('keydown', onEsc);

    document.body.appendChild(iframe);
    document.body.appendChild(closeBtn);
  }

  slides: Slide[] = [
    { title: 'OUR STORY', subtitle: 'CRUISE LENS ACADEMY', img: 'assets/images/image-44.jpg', link: '/about', direction: 'right' },
  ];

  missionVision: Slide[] = [
    { title: 'WHY CRUISE LENS ACADEMY', subtitle: 'Our Purpose', img: 'assets/images/image-53.jpg', link: '/why-cruise', direction: 'left' },
    { title: 'OUR TEAM', subtitle: 'Our Goal', img: 'assets/images/image-54.jpg', link: '/partners', direction: 'right' },
  ];

  activeIndex = 0;

  @HostListener('window:scroll')
  onScroll() {
    this.ngZone.runOutsideAngular(() => {
      const rows = document.querySelectorAll('.course-row');
      let newActiveIndex = this.activeIndex;
      rows.forEach((row, index) => {
        const rect = row.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          newActiveIndex = index;
        }
      });

      if (newActiveIndex !== this.activeIndex) {
        this.ngZone.run(() => {
          this.activeIndex = newActiveIndex;
        });
      }

      const section = document.querySelector('.offer-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight / 1.3) {
          section.classList.add('in-view');
        }
      }
    });
  }

  trackByCourse(index: number, course: any) {
    return course.id || index;
  }

  trackByImg(index: number, img: string) {
    return img || index;
  }

  trackByVideo(index: number, video: any) {
    return video.label || index;
  }


slideAndNavigate(slide: Slide, index: number, listType: 'slides' | 'missionVision') {
  const cards = document.querySelectorAll(`.${listType}-card`);
  const card = cards[index] as HTMLElement;

  if (!card) return;

  // Add animation class depending on direction
  if (slide.direction === 'right') {
    card.classList.add('slide-right');
  } 
  else {
    card.classList.add('slide-left');
  }

  // Navigate after animation
  setTimeout(() => {
    this.router.navigate([slide.link]);
  }, 1500);
}


courses = [
  { 
    id: 'course-1',
    headtitle:'Course 1:',
    title: 'Certification in Cruise Photography', 
    image: 'assets/images/image-55.jpg', 
    description: `Kickstart your cruise photography career! 15-working-day professional program certified by Medhavi Skills University (MSU) & Skill India. Includes DSLR, lighting, editing & placement assistance. 
    Duration: 15 Working Days | Fees: ₹1,49,000 | Small batch size (6–8 students)` 
  },
  { 
    id: 'course-2',
    headtitle:'Course 2:',
    title: 'Complete Cruise Career Program', 
    image: 'assets/images/image-56.jpg', 
    description: `Complete dual-skill program combining 15-day cruise photography with 14-day STCW maritime training by NAMAC. Includes stay (accommodation) & daily meals during STCW. 
    Duration: 15 Days Photography + 14 Days Maritime | Fees: ₹2,08,000 | Small batch size (6–8 students)` 
  },
  { 
    id: 'course-3',
    headtitle:'Course 3:',
    title: 'Working Cruise Photographers (Consultation)', 
    image: 'assets/images/image-4.jpg', 
    description: `Exclusive evaluation & consultation for onboard photographers. 
    Benchmark your portfolio, get career guidance & fast-track to senior roles. 
    Duration: 1 week | Paid evaluation (details after enquiry)` 
  }
];






exploreCourse(course: any) {
  console.log('Exploring:', course.title);
  this.router.navigate([course.id]);  // navigates to 'course-1', 'course-2', etc.
}



//  flippedCard: string | null = null;

//   photographers = [
//     {
//       name: 'Rohan Singh',
//       initials: 'RS',
//       batch: 'Nov 2025',
//       status: 'Available',
//       image: 'assets/images/profile.png',
//       bio: 'Cruise portrait expert with a flair for storytelling and lifestyle photography.',
//       skills: ['Lightroom', 'Portraits', 'Sales'],
//       certifications: ['STCW', 'INDOS', 'SID']
//     },
//     {
//       name: 'Anjali Verma',
//       initials: 'AV',
//       batch: 'Nov 2025',
//       status: 'Onboard',
//     image: 'assets/images/profile.png',
//       bio: 'Known for guest engagement and creative onboard cruise shoots.',
//       skills: ['Candid', 'Teamwork', 'Communication'],
//       certifications: ['STCW', 'INDOS', 'SID']
//     },
//     {
//       name: 'Karan Patel',
//       initials: 'KP',
//       batch: 'Oct 2025',
//       status: 'Hired',
//       image: 'assets/images/profile.png',
//       bio: 'Travel storyteller and creative cruise visuals specialist.',
//       skills: ['Editing', 'Lighting', 'Portraits'],
//       certifications: ['STCW', 'INDOS', 'SID']
//     },
//     {
//       name: 'Divya Sharma',
//       initials: 'DS',
//       batch: 'Dec 2025',
//       status: 'Available',
//       image: 'assets/images/profile.png',
//       bio: 'Experienced in ship-side portraiture and event coverage.',
//       skills: ['Composition', 'Sales', 'Cruise Events'],
//       certifications: ['STCW', 'INDOS', 'SID']
//     }
//   ];

//   // Duplicate for infinite loop
//   get doubledPhotographers() {
//     return [...this.photographers, ...this.photographers];
//   }

//    flipCard(initials: string | null): void {
//     this.flippedCard = initials;

// }
}
