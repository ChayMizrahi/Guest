import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import * as fromApp from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { take, map, exhaustMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(auth => {
        return auth.user;
      }),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        } else {
          // Inject the userId to the URL.
          const x = req.url.split('/');
          let newUrl:string = '';
          x.forEach((element,index) => {
            newUrl = newUrl.concat(element+'/');
            if(index === 2){
              newUrl = newUrl.concat(user.userId+'/')
            } 
          });
          const httpRequest = new HttpRequest(<any>req.method, newUrl, req.body);
          req = Object.assign(req, httpRequest);
          const modifePath = req.clone({ params: new HttpParams().set('auth', user.token) });
          return next.handle(modifePath);
        }
      })
    );
  }
}
