import { Component, ContentChild, Input, TemplateRef } from '@angular/core'
import {
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from '@angular/router'
import { Observable, tap } from 'rxjs'
import { LoadingService } from 'src/services/loading.service'

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  loading$: Observable<boolean>

  @Input()
  detectRouteTransitions = false

  @ContentChild('loading')
  customLoadingIndicator: TemplateRef<any> | null = null

  constructor(private loadingService: LoadingService, private router: Router) {
    this.loading$ = this.loadingService.loading$
  }

  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn()
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff()
            }
          })
        )
        .subscribe()
    }
  }
}
