import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';

import { SystemService } from '../../system.service';
import { LotService } from '../../services/lot.service';

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
    private toastr: ToastrService,
    private sys: SystemService,
    private lotService: LotService
  ) {
    this.scannerEnabled = true;
  }

  ngOnInit(): void {
  }

  async scanSuccessHandler(lotNumber: string): Promise<void> {
    try {
      const lot = await this.lotService.getLotDetails(lotNumber)
      ?.pipe(take(1))
      .toPromise();

      if (!lot) {
        this.toastr.error('QRCode inválido.');
        return;
      }

      this.scannerEnabled = false;

      this.sys.insertDataOnLocalStorage({ lot });

      this.ngZone.run(() => {
        this.router.navigate(['/check-in/hours-choice']);
      });
    } catch (error) {
      console.error('error', error);
    }
  }
}
