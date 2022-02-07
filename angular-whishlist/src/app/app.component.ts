import { Component } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-whishlist';
  time = new Observable((observer) => {
    setInterval(() => observer.next(new Date().toString()), 100);
  });

  constructor(public translate: TranslateService) {
    console.log('************** get tranlation');
    translate
      .getTranslation('en')
      .subscribe((x) => console.log('x' + JSON.stringify(x)));
    translate.setDefaultLang('es');
  }
}
