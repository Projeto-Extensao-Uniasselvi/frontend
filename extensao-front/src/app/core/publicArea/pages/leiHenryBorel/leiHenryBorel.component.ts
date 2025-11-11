import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { leiHenryBorel } from './content';
import { MoreArticlesComponent } from '../../components/moreArticles/moreArticles.component';

@Component({
  selector: 'app-leiHenryBorel',
  standalone: true,
  imports: [CommonModule, MoreArticlesComponent],
  templateUrl: './leiHenryBorel.component.html',
  styleUrls: ['./leiHenryBorel.component.scss']
})
export class LeiHenryBorelComponent {
  public content = leiHenryBorel;

}
