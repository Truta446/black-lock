import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { NgxViacepService } from '@brunoc/ngx-viacep';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('nameModel') nameModel!: NgModel;
  @ViewChild('emailModel') emailModel!: NgModel;
  @ViewChild('cpfModel') cpfModel!: NgModel;
  @ViewChild('cepModel') cepModel!: NgModel;
  @ViewChild('streetModel') streetModel!: NgModel;
  @ViewChild('neighborhoodModel') neighborhoodModel!: NgModel;
  @ViewChild('cityModel') cityModel!: NgModel;
  @ViewChild('stateModel') stateModel!: NgModel;
  @ViewChild('numberModel') numberModel!: NgModel;
  @ViewChild('complementModel') complementModel!: NgModel;
  name: string;
  email: string;
  cpf: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: number;
  complement: string;
  loading: boolean;
  knowCEP: boolean;
  onContentReady?: Subscription;
  subscription?: Subscription;

  constructor(
    private viacep: NgxViacepService,
    private toastr: ToastrService,
    private userService: UserService
  ) {
    this.name = '';
    this.email = '';
    this.cpf = '';
    this.cep = '';
    this.street = '';
    this.neighborhood = '';
    this.city = '';
    this.state = '';
    this.number = 0;
    this.complement = '';
    this.loading = false;
    this.knowCEP = true;
  }

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.onContentReady?.unsubscribe();
    this.subscription?.unsubscribe();
  }

  getUser(): void {
    this.onContentReady = this.userService.contentReady.subscribe(() => {
      this.subscription = this.userService.getUser()?.subscribe((user: User) => {
        if (user && Object.keys(user).length > 0) {
          this.name = user.name;
          this.email = user.email;
          this.cpf = user.cpf;
          this.cep = user.address?.postalCode;
          this.street = user.address?.street;
          this.neighborhood = user.address?.neighborhood;
          this.city = user.address?.city;
          this.state = user.address?.state;
          this.number = user.address?.number;
          this.complement = user.address?.complement;
        }
      });
    });
  }

  saveUser(): void {
    if (!this.onValidateUser()) {
      return;
    }

    const user = {
      name: this.name,
      cpf: this.cpf,
      email: this.email,
      address: {
        street: this.street,
        number: this.number || 0,
        complement: this.complement || '',
        postalCode: this.cep.replace('-', ''),
        neighborhood: this.neighborhood,
        city: this.city,
        state: this.state,
        countryCode: 'BR',
      }
    };

    this.userService.updateUser(user);

    this.toastr.success('Dados atualizados com sucesso.');
  }

  async searchPostalCode(): Promise<void> {
    try {
      this.loading = true;

      if (this.cep.length !== 8) {
        return;
      }

      const address = await this.viacep.buscarPorCep(this.cep);

      this.cep = address.cep;
      this.city = address.localidade;
      this.street = address.logradouro;
      this.state = address.uf;
      this.neighborhood = address.bairro;
    } catch (err) {
      this.toastr.error('CEP não encontrado.');
    } finally {
      this.loading = false;
    }
  }

  onValidateUser(): boolean {
    let count = 0;

    if (!this.name) {
      this.nameModel.control.markAsTouched();
      count += 1;
    }

    if (!this.isValidEmail(this.email)) {
      this.emailModel.control.markAsTouched();
      this.emailModel.control.setErrors({ format: true });
      count += 1;
    }

    if (!this.cpfIsValid(this.cpf)) {
      if (this.cpf.length === 11) {
        this.cpfModel.control.setErrors({ format: true });
      } else {
        this.cpfModel.control.markAsTouched();
      }

      count += 1;
    }

    if (!this.isValidAddress()) {
      this.cepModel.control.markAsTouched();
      this.streetModel.control.markAsTouched();
      this.neighborhoodModel.control.markAsTouched();
      this.cityModel.control.markAsTouched();
      this.stateModel.control.markAsTouched();
      this.numberModel.control.markAsTouched();

      count += 1;
    }

    if (count === 0) {
      return true;
    }

    return false;
  }

  isValidEmail(email: string): boolean {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  isValidAddress(): boolean {
    const data = [
      this.city,
      this.neighborhood,
      this.number,
      this.state,
      this.street,
    ];

    if (this.knowCEP) {
      data.push(this.cep);
    }

    if (data.filter((str) => !str).length > 0) {
      return false;
    }

    return true;
  }

  cpfIsValid(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (
      cpf === '' ||
      cpf.length !== 11 ||
      cpf === '00000000000' ||
      cpf === '11111111111' ||
      cpf === '22222222222' ||
      cpf === '33333333333' ||
      cpf === '44444444444' ||
      cpf === '55555555555' ||
      cpf === '66666666666' ||
      cpf === '77777777777' ||
      cpf === '88888888888' ||
      cpf === '99999999999'
    ) {
      return false;
    }

    let add = 0;

    for (let i = 0; i < 9; i++) {
      add += parseInt(cpf.charAt(i), 0) * (10 - i);
    }

    let rev = 11 - (add % 11);

    if (rev === 10 || rev === 11) { rev = 0; }

    if (rev !== parseInt(cpf.charAt(9), 0)) { return false; }

    add = 0;

    for (let i = 0; i < 10; i++) {
      add += parseInt(cpf.charAt(i), 0) * (11 - i);
    }

    rev = 11 - (add % 11);

    if (rev === 10 || rev === 11) { rev = 0; }

    if (rev !== parseInt(cpf.charAt(10), 0)) { return false; }

    return true;
  }

  onDisableCEP(): void {
    this.knowCEP = !this.knowCEP;
    this.cep = '';
  }
}
