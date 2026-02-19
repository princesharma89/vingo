import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    mobile:{
        type: String,
        required:true,
    },
    role:{
        type:String,
        enum:["user","owner","deliveryBoy"],
        required:true,
    },
    resetOtp:{
        type:String,
    },
    isOtpVerified:{
        type:Boolean,
        default:false
    },
    otpExpires:{
        type:Date,
    },
    /*
 GeoJSON (Geospatial JSON) is a standard format used to represent
 geographical data structures using JSON.

 It is commonly used to store locations (latitude & longitude),
 boundaries, routes, and spatial shapes on maps.

 In MongoDB, GeoJSON is used with geospatial indexes (2dsphere)
 to perform location-based queries such as:

 • Finding nearby places (restaurants, shops, parking, etc.)
 • Calculating distance between two locations
 • Searching within a radius
 • Checking if a point lies inside an area (polygon)
 • Building map-based features (delivery apps, ride apps, etc.)

 A typical GeoJSON Point looks like:
 {
   type: "Point",
   coordinates: [longitude, latitude]
 }

 ⚠️ Note: Coordinates are stored as [lng, lat] — NOT [lat, lng].

 This format is essential for applications that depend on
 location services, navigation, or proximity search.
*/

    location:{
        type:{type:String,enum:["Point"],default:"Point"},
        coordinates:{type:[Number],default:[0,0]}, // [longitude, latitude] fixed format for GeoJSON
    }
},{timestamps:true})

userSchema.index({location:"2dsphere"}); //for idetification of mongodb geospatial index for location field set as map beacuse it set to 2d sphere index type

const User= mongoose.model("User",userSchema);
export default User;