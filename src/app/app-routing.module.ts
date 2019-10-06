import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {FlowPlayerComponent} from './flow-player/flow-player.component';
import {FlowPopupComponent} from './flow-popup/flow-popup.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)},
  {path: 'play', component: FlowPlayerComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule],
  entryComponents: [FlowPopupComponent]
})
export class AppRoutingModule {
}
