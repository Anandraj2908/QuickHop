import mongoose, { Schema } from "mongoose";

const rideSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        driverId: {
            type: Schema.Types.ObjectId,
            ref: "Rider",
            required: true
        },
        charge: {
            type: Number,
            required: true
        },
        currentLocationName: {
            type: String,
            required: true,
            trim: true
        },
        destinationLocationName: {
            type: String,
            required: true,
            trim: true
        },
        distance: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
);

export const Ride = mongoose.model("Ride", rideSchema);
