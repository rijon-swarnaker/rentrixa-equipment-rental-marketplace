import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("rentrixdb");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  user: {
    additionalFields: {
      role: {
        type: ["Customer", "Admin", "Owner"],
        input: false,
        defaultValue: "Customer",
      },

      address: {
        type: "string",
        required: false,
        input: true,
      },

      phone: {
        type: "string",
        required: false,
        input: true,
        
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  //  plugins: [
  //       admin() 
  //   ],
  database: mongodbAdapter(db, {
    client,
  }),
});
