import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink

@Component({
  selector: 'app-footer',
  standalone: true, // This component is standalone
  imports: [RouterModule], // Import RouterModule here for routerLink directive
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear: number = new Date().getFullYear();

  constructor() { }

  ngOnInit(): void {
  }
}