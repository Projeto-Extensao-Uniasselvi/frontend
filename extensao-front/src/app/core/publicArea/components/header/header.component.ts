import { Component } from '@angular/core';
import { ContactModalComponent } from '../contactModal/contactModal.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, ContactModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public isMobileMenuOpen = false;
  public isContactModalOpen = false;

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public toggleContactModal(): void {
    this.isContactModalOpen = !this.isContactModalOpen;
  }

}
