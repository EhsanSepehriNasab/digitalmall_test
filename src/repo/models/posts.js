
const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const Posts = new Schema(
    { 
        _id: Schema.Types.ObjectId,
        user_id: Schema.Types.ObjectId, 
        brand: Schema.Types.ObjectId,
        clothType: Schema.Types.ObjectId,
        country: Schema.Types.ObjectId,
        price: Number,
        titelEn: String,
        titelAr: String,
        gallery: Array,
        createdAt: Date
    }
) 

var postModel = mongoose.model('posts', Posts);

const findAll = async (filter) => {
    try{
        console.log(filter)
        const pipline = [
            {
              $lookup: {
                from: "users", 
                localField: "user_id", 
                foreignField: "_id", 
                as: "users",
              },
            },
            {
              $lookup: {
                from: "brands", 
                localField: "brand", 
                foreignField: "_id", 
                as: "brand",
              },
            },
            {
              $lookup: {
                from: "clothes", 
                localField: "clothType", 
                foreignField: "_id", 
                as: "clothType",
              },
            },
            {
                $lookup: {
                  from: "countries", 
                  localField: "country", 
                  foreignField: "_id", 
                  as: "country",
                },
              },
              {
                $unwind: {
                    path: '$users'
                }
              },
              {
                $unwind: {
                    path: '$brand'
                }
              },
              {
                $unwind: {
                    path: '$clothType'
                }
              },
              {
                $unwind: {
                    path: '$country'
                }
              },
          ]

        if(filter.order === "high") pipline.push({ "$sort": { "price": -1 }})
        if(filter.order === "low") pipline.push({ "$sort": { "price": 1 }})

        pipline.push({ "$sort": { "createdAt": 1 }})
        let result= await postModel.aggregate(pipline).skip( filter.page > 0 ? ( ( filter.page - 1 ) * filter.limit ) : 0 )
        .limit( filter.limit ).exec();

        return result
    }
    catch(err){
        console.log(err)
    }
}
module.exports = { findAll }