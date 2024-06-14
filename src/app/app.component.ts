import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountdownSvgComponent } from './countdown-svg/countdown-svg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CountdownSvgComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Grocery List Plus';
}
