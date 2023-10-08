import Realm from "realm";

export const realmApp = new Realm.App({
  id: process.env.REALM_APP_ID as string,
});
