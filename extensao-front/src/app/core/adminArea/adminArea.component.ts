import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from './components/sideBar/sideBar.component';

@Component({
  selector: 'app-adminArea',
  standalone: true,
  imports: [RouterOutlet, SideBarComponent],
  templateUrl: './adminArea.component.html',
  styleUrls: ['./adminArea.component.scss']
})
export class AdminAreaComponent{
}
