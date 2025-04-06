import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackButtonComponent } from "../../../components/ui/back-button/back-button.component";

@Component({
  selector: 'app-footer',
  imports: [RouterLink, BackButtonComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
