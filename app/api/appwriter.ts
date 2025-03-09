import { Client, Account, ID } from "appwrite";

export const client: any = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

const account = new Account(client);

export { account, ID };
