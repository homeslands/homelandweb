import { prop, Ref } from "../../libs/typegoose/typegoose";
import { Basic } from "../basic";
import { User } from "../user";
import { MotelRoom } from "./motelRoom";

class MotelRevenue {
    @prop({ ref: () => MotelRoom })
    motelId: Ref<MotelRoom>;

    @prop()
    motelName: string;

    @prop()
    amount: number;
}

export class Revenue extends Basic {
    @prop({ ref: () => User })
    userId: Ref<User>;

    @prop()
    userName: string;

    @prop()
    motels: MotelRevenue[];

    @prop()
    totalAmount: number;
}

export const RevenueModel = (connection) => {
    return new Revenue().getModelForClass(Revenue, {
        existingConnection: connection,
        schemaOptions: {
            timestamps: true,
            collection: "revenue",
        },
    });
};
