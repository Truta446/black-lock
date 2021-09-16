import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { SystemService } from '../../system.service';

@Component({
  selector: 'app-qrcode-reader',
  templateUrl: './qrcode-reader.component.html',
  styleUrls: ['./qrcode-reader.component.scss']
})
export class QrcodeReaderComponent implements OnInit {
  scannerEnabled: boolean;

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private sys: SystemService
  ) {
    this.scannerEnabled = true;
  }

  ngOnInit(): void {
  }

  scanSuccessHandler(lotNumber: string): void {
    this.scannerEnabled = false;

    this.sys.insertDataOnLocalStorage({ lotNumber });

    this.ngZone.run(() => {
      this.router.navigate(['/check-in/hours-choice']);
    });
  }
}
