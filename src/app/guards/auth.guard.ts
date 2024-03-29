import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private service:ApiService,private toastr:ToastrService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    if (this.service.IsAuthenticated()){
      if (route.url.length>0){
        console.log(route.url[0], 'here========>');
        let menu=route.url[0].path
        console.log('menu:',  menu);
        if(menu==='user'|| menu==='manager-list'){ 
          console.log(this.service.getUserRole(), 'check role');
          if(this.service.getUserRole()==='Admin'){
            return true
          }
          else{
            this.toastr.warning('You are not allowed as you are not admin')
            this.router.navigate(['/login'])
            return false
          }
        }
        else{
          return true
        }
      }else{
        return true
      }
  
    }else{
      return false
    }
  }
}

