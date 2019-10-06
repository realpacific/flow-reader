import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  sentence = '';

  constructor(private router: Router, private toastController: ToastController) {

  }


  async startFlowReader() {
    if (this.sentence.split(' ').length < 5) {
      await this.presentToast();
      return;
    }
    localStorage.setItem('data', this.sentence);
    await this.router.navigate(['play']);
  }


  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Must be at least 5 words long.',
      duration: 1500
    });
    await toast.present();
  }
}
