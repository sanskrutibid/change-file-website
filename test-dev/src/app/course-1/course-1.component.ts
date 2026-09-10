import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
interface CrewMember {
  name: string;
  role: string;
  img: string;
}


@Component({
  selector: 'app-course-1',
  imports: [CommonModule,RouterModule],
  templateUrl: './course-1.component.html',
  styleUrl: './course-1.component.css'
})
export class Course1Component {
 crewMembers: CrewMember[] = [
  {
    name: "Build the Foundation",
    role: "Days 1–3: Camera & exposure, composition, lighting fundamentals, understanding lenses, and professional shooting techniques.",
    img: "assets/images/starter-track04.webp"
  },
  {
    name: "Think Like a Cruise Photographer",
    role: "Days 4–6: Cruise photography workflow, guest interaction, communication & posing, professional etiquette, and the onboard environment.",
    img: "assets/images/image-25.jpg"
  },
  {
    name: "Master the Image",
    role: "Days 7–9: Portrait photography, posing & composition, lighting for people, different environments, and practical photography sessions.",
    img: "assets/images/image-26.jpg"
  },
  {
    name: "Edit. Present. Sell.",
    role: "Days 10–12: Photo selection, professional editing, image presentation, guest engagement, and photography sales fundamentals.",
    img: "assets/images/image-27.jpg"
  },
  {
    name: "Prove Your Skill",
    role: "Days 13–15: Photography assessment, editing evaluation, knowledge assessment, professional/HR evaluation, and certification process.",
    img: "assets/images/image-23.jpg"
  },
  {
    name: "Certification in Cruise Photography",
    role: "15-Working-Day Professional Photography Program | Program Investment: ₹1,49,000/- | MSU Certification, Skill Points & Digital Credential.",
    img: "assets/images/image-24.jpg"
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

