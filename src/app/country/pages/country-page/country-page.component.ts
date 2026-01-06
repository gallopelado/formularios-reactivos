import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

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
    const countrySubscription = this.onCountryChanged();
    onCleanUp(() => {
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });
  });

  onRegionChanged() {
    return this.myForm.get('region')!.valueChanges
      .pipe(
        // cambiamos los otros controles desde el tap
        tap( () => this.myForm.get('country')!.setValue('') ),
        tap( () => this.myForm.get('border')!.setValue('') ),
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

  onCountryChanged() {
     return this.myForm.get('country')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('border')!.setValue('') ),
        filter((value) => value!.length > 0),
        //tap( () => this.borders.set([]) ),
        switchMap( countryCode => this.countryService.getCountryByAlphaCode(countryCode ?? '') ),
        switchMap( ({ borders }) => this.countryService.getCountryNamesByCodeArray(borders) )
      )
      .subscribe((countries) => this.borders.set(countries))
  }

}
