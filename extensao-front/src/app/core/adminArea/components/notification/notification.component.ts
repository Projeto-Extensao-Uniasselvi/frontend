import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Notification } from '../../../../shared/interfaces/notifications';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  private readonly _notificationService = inject(NotificationService);
  private subscription: Subscription = new Subscription();
  public notifications: Notification[] = [];

  ngOnInit() {
    this.subscription = this._notificationService.notifications$.subscribe(notification => {
      if (notification.message && !this.notifications.some(n => n.id === notification.id)) {
        this.notifications.push(notification);
        const notificationTimeout = setTimeout(() => this.removeNotification(notification.id), 5000); // Desaparece após 5 segundos
        notification.timeout = notificationTimeout;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.notifications.forEach(n => clearTimeout(n.timeout));
  }

  removeNotification(id: number) {
    const notificationToRemove = this.notifications.find(n => n.id === id);
    if (notificationToRemove) {
      clearTimeout(notificationToRemove.timeout); // Limpa o timeout específico
      this.notifications = this.notifications.filter(notification => notification.id !== id);
    }
  }
  
}
