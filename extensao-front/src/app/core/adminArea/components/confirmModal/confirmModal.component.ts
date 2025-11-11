import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmModal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmModal.component.html',
  styleUrls: ['./confirmModal.component.scss']
})
export class ConfirmModalComponent {
  @Input()
  message: string = 'Você tem certeza?';
  @Output()
  confirm = new EventEmitter<void>();
  @Output()
  close = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onClose(): void {
    this.close.emit();
  }

}
