import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // For ngIf, ngFor
import { RouterModule } from '@angular/router'; // For routerLink

@Component({
  selector: 'app-about',
  standalone: true, // This component is standalone
  imports: [CommonModule, RouterModule], // Import necessary modules
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}