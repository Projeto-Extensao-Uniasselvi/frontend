import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ContactModalComponent } from '../contactModal/contactModal.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ContactModalComponent],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public isContactModalOpen = false;

  public toggleContactModal(): void {
    this.isContactModalOpen = !this.isContactModalOpen;
  }

}
