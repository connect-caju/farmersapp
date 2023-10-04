/* eslint-disable prettier/prettier */

import { realm } from "./screens/HomeScreen/HomeScreen";
import { Realm, useApp } from "@realm/react";

export const syncConfig = (isManualResetConfirmed, onSyncError) => ({
    flexible: true,
    existingRealmFileBehavior: {
        type: "openImmediately",
        timeOut: 1000,
        timeOutBehavior: "openLocalRealm",
    },
    clientReset: {
        mode: "recoverUnsyncedChanges",
        onBefore: (realm) => {
            console.log("Beginning the client reset for", realm.path);
        },
        onAfter: (beforeRealm, afterRealm) => {
            console.log("Finished the client reset for", beforeRealm.path);
            console.log("New realm path", afterRealm.path);
        },
        onFallback: (_session, path) => {
            try {
                // Prompt user to perform a client reset immediately. If they don't,
                // they won't receive any data from the server until they restart the app
                // and all changes they make will be discarded when the app restarts.

                if (isManualResetConfirmed) {
                    // Close and delete old realm from device
                    realm.close();
                    Realm.deleteFile(path);
                    // Perform client reset
                    const app = useApp();
                    Realm.App.Sync.initiateClientReset(app, path);
                    // Navigate the user back to the main page or reopen the
                    // the Realm and reinitialize the current page
                }
            } catch (error) {
                // Reset failed. Notify user that they'll need to
                // update the app
                console.log("Client Reset Error =>", { cause: error });
            }
        },
    },
    onError: (_, error) => {
        onSyncError(error);
        console.log("Sync Error =>", error);
    },
});
