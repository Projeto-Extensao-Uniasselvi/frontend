import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sideBar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.scss']
})
export class SideBarComponent{

}
