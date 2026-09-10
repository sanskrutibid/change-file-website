import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
interface CrewMember {
  name: string;
  role: string;
  img: string;
}


@Component({
  selector: 'app-course-2',
  imports: [CommonModule,RouterModule],
  templateUrl: './course-2.component.html',
  styleUrl: './course-2.component.css'
})
export class Course2Component {
  crewMembers: CrewMember[] = [
  { 
    name: "Skip documentation – focus purely on creativity & technicals", 
    role: "Learn with a practical-first approach, focusing on creative photography and technical mastery without unnecessary theory.", 
    img: "assets/images/image-58.jpg" 
  },
  { 
    name: "Hands-on photography & editing workshops", 
    role: "Intensive classroom and outdoor workshops covering DSLR usage, lighting, framing, and professional editing practices.", 
    img: "assets/images/image-59.jpg" 
  },
  { 
    name: "Roleplays, real-world experiences, and guest lectures", 
    role: "Simulated cruise-ship scenarios, roleplays, and insights from industry professionals to prepare you for actual onboard conditions.", 
    img: "assets/images/image-64.jpg" 
  },
  { 
    name: "Editing & Software Training", 
    role: "Master industry-standard tools like Adobe Lightroom, Photoshop, Bridge, and IRIS for professional-level editing.", 
    img: "assets/images/image-61.jpg" 
  },
  { 
    name: "Career Preparation & Placement Assistance", 
    role: "Guidance on grooming, communication, mock HR interviews, employer-specific preparation, and direct placement opportunities.", 
    img: "assets/images/image-62.jpg" 
  },
  { 
    name: "Duration & Details", 
    role: "Course Duration: 15 Days Photography + 14 Days Maritime STCW Training (NAMAC). Fees: ₹2,08,000 (Includes Stay & Meals during STCW). Batch Size: 6–8 students.", 
    img: "assets/images/image-63.jpg" 
  }
];


crewIndex = 0;
crewAnimating = false;
crewName = this.crewMembers[0].name;
crewRole = this.crewMembers[0].role;
autoScrollInterval: any;

ngOnInit(): void {
  this.updateCrewCarousel(0);

  // Auto-scroll every 3 seconds
  this.autoScrollInterval = setInterval(() => {
    this.next();
  }, 3000);
}

ngOnDestroy(): void {
  if (this.autoScrollInterval) {
    clearInterval(this.autoScrollInterval);
  }
}

updateCrewCarousel(newIndex: number) {
  if (this.crewAnimating) return;
  this.crewAnimating = true;

  this.crewIndex = (newIndex + this.crewMembers.length) % this.crewMembers.length;

  setTimeout(() => {
    this.crewName = this.crewMembers[this.crewIndex].name;
    this.crewRole = this.crewMembers[this.crewIndex].role;
  }, 300);

  setTimeout(() => {
    this.crewAnimating = false;
  }, 800);
}

prev() {
  this.updateCrewCarousel(this.crewIndex - 1);
}

next() {
  this.updateCrewCarousel(this.crewIndex + 1);
}


  // Keyboard navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') this.prev();
    else if (event.key === 'ArrowRight') this.next();
  }

  // Touch/swipe
  touchStartX = 0;
  @HostListener('touchstart', ['$event'])
  onTouchStart(e: TouchEvent) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(e: TouchEvent) {
    const diff = this.touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.next();
      else this.prev();
    }
  }

  getCardClass(i: number): string {
    const offset = (i - this.crewIndex + this.crewMembers.length) % this.crewMembers.length;

    if (offset === 0) return 'center';
    else if (offset === 1) return 'right-1';
    else if (offset === 2) return 'right-2';
    else if (offset === this.crewMembers.length - 1) return 'left-1';
    else if (offset === this.crewMembers.length - 2) return 'left-2';
    else return 'hidden';
  }

}

