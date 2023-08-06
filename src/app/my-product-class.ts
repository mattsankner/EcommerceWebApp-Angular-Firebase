
export class MyProductClass {
[x: string]: any;
    constructor(
        private _id : number,
        private _name: string,
        private _price: number,
        private _description: string,
        private _image: string,
        public quantity: number = 0,
        public rating: number = 0,
        public isAdded: boolean = false,
        public removed: boolean = false,
    ) {
    }

    getPrice(): number | 0 {
        console.log(this._price)
        console.log("PRICE GETTER CALLED")
        return this._price;
    }
    
   //search in checkout, called in service

   setIsAdded(isAdded: boolean){
    this.isAdded = isAdded;
   }
}
