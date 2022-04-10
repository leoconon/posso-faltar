import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController: ToastController) { }

  public async showDefault(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }

  public async showError(message: string) {
    const toast = await this.toastController.create({
      color: 'danger',
      message: message,
      duration: 1500
    });
    toast.present();
  }

  public async showSuccess(message: string) {
    const toast = await this.toastController.create({
      color: 'success',
      message: message,
      duration: 1500
    });
    toast.present();
  }

}
