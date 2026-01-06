import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {

  fb = inject(FormBuilder);
  countryService = inject(CountryService);

  regions = signal<string[]>( this.countryService.regions );

  countriesByRegion = signal<Country[]>([])
  borders = signal<Country[]>([])

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  });

  // 1 forma
  // formRegionChanged = this.myForm.get('region')!.valueChanges.subscribe(value => {
  //   console.log({value});
  // });

  onFormChanged = effect( ( onCleanUp ) => {
    // const regionSubscription = this.myForm.get('region')!.valueChanges.subscribe(value => {
    //   console.log({value});
    // });
    const regionSubscription = this.onRegionChanged();
    onCleanUp(() => {
      regionSubscription.unsubscribe();
    });
  });

  onRegionChanged() {
    return this.myForm.get('region')!.valueChanges
      .pipe(
        // cambiamos los otros controles desde el tap
        tap( () => this.myForm.get('country')!.setValue('')),
        tap( () => this.myForm.get('border')!.setValue('')),
        tap( () => {
          this.borders.set([]);
          this.countriesByRegion.set([]);
        }),
        // convierte un observable en otro
        switchMap( region => this.countryService.getCountriesByRegion(region ?? '') )
      )
      .subscribe( countries => {
        this.countriesByRegion.set(countries);
      })
  }

}
