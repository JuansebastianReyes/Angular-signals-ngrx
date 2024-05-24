import { Component, OnInit, inject, signal } from '@angular/core';
import { CardStore } from '../../store/card.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit {
  readonly store = inject(CardStore)
  page = signal(0);

  ngOnInit(): void {
    this.loadData(this.page());
  }

  nextPage(){
    this.page.update(page => page + 1);
    this.loadData(this.page());
  }

  lastPage(){
    this.page.update(page => page - 1);
    this.loadData(this.page());
  }

  loadData(page: number){
    this.store.loadPage(page);
  }
}

