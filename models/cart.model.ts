export class CartItem {
  public id: number;
  public name: string;
  public amount: number;
  public price: number;
  public total: number;

  constructor(id: number, name: string, amount: number, price: number) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.price = price;
    this.total = this.amount * this.price;
  }

}