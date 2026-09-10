import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  // ============================================
  // Existing functionality - Navbar scroll state
  // ============================================
  isScrolled = false;

  constructor(private router: Router) {}

  // ============================================
  // Detect page scroll
  // Keeps your existing navbar functionality
  // ============================================
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  // ============================================
  // Close mobile navbar
  // Keeps your existing functionality
  // ============================================
  closeNavbar(): void {
    const navbar = document.getElementById('navbarNav');

    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }

  // ============================================
  // Programs navigation
  // ============================================
  goToCertificationCourse(): void {
    this.closeNavbar();

    this.router.navigate(['/certification-cruise-photography']);
  }

  goToCompleteCruiseCareer(): void {
    this.closeNavbar();

    this.router.navigate(['/complete-cruise-career']);
  }
}