import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByCategory'
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(dishes: any[], category: string): any[] {
    if (!dishes || !category) {
      return dishes;
    }
    return dishes.filter(dish => dish.category === category);
  }
}