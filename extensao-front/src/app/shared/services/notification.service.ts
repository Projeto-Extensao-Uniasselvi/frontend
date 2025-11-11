import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from '../interfaces/notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new Subject<Notification>();
  notifications$ = this.notificationsSubject.asObservable();
  private idCounter = 0;

  addNotification(message: string, isSuccess: boolean) {
    const id = this.idCounter++;
    const timestamp = Date.now();
    this.notificationsSubject.next({ message, isSuccess, id, timestamp });
    return id;
  }

  removeNotification(id: number) {
    this.notificationsSubject.next({ message: '', isSuccess: false, id, timestamp: 0 });
  }

}
