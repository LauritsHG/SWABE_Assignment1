import {Schema} from 'mongoose'

export interface Order{
    
        "material": string,
        "amount": number,
        "currency": string,
        "price": number,
        "timestamp":Date,
        "delivery":{
          "first_name": string,
          "last_name": string,
          "address":{
            "street_name": string,
            "street_number": string,
            "city": string
            }
          }
}
      
export const schema = new Schema<Order>({
    "material":{ type: String, required: false},
    "amount": { type: Number, required: false},
    "currency": { type: String, required: false},
    "price": { type: Number, required: false},
    "timestamp":{ type: Date, required: false},
    "delivery":{
      "first_name": { type: String, required: false},
      "last_name": { type: String, required: false},
      "address":{
        "street_name": { type: String, required: false},
        "street_number": { type: String, required: false},
        "city": { type: String, required: false}
        }
      }

})