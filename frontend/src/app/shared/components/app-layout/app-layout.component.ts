import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive], // Importando ferramentas de navegação
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {}
