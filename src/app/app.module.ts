import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { FilterComponent } from './filter/filter.component';
import { FilterService } from './filter/filter.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AppStateService } from './app.state.service';

@NgModule({
  declarations: [
    AppComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
  ],
  providers: [FilterService, AppStateService],
  bootstrap: [AppComponent],
  entryComponents: [FilterComponent],
})
export class AppModule { }
