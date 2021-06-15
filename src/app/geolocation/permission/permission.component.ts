import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent {

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) { }

  allowGeolocation() {
    const coords = JSON.parse(localStorage.getItem('geolocation')!);

    if (!coords) {
      navigator.geolocation.getCurrentPosition(async (position: any) => {
        const location = {
          latitude: position.coords.latitude.toFixed(7),
          longitude: position.coords.longitude.toFixed(7)
        };

        await localStorage.setItem('geolocation', JSON.stringify(location));

        this.ngZone.run(() => {
          this.router.navigate(['/geolocation/map']);
        });
      }, (error) => {
        console.log(error);
      });

      return;
    }

    this.ngZone.run(() => {
      this.router.navigate(['/geolocation/map']);
    });
  }
}
