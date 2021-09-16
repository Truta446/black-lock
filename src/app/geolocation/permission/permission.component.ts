import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { SystemService } from '../../system.service';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent {

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private sys: SystemService
  ) { }

  allowGeolocation(): void {
    const coords = this.sys.getDataToLocalStorage();

    if (!coords) {
      navigator.geolocation.getCurrentPosition(async (position: any) => {
        const location = {
          latitude: position.coords.latitude.toFixed(7),
          longitude: position.coords.longitude.toFixed(7)
        };

        await this.sys.insertDataOnLocalStorage({ location });

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
