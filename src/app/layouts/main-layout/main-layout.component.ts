import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/blocks/header/header.component';
import { FooterComponent } from "../../components/blocks/footer/footer.component";
import { HeaderMobileComponent } from "../../components/blocks/header-mobile/header-mobile.component";
import { ScrollToTopComponent } from "../../components/ui/scroll-to-top/scroll-to-top.component";


@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, HeaderMobileComponent, ScrollToTopComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {

}
