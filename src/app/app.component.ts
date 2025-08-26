import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from "./shared/notification/notification/notification.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    RouterOutlet,
    NotificationComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pappaladabba';
}