import { Express, Response, json } from "express";

import { Storage } from "../types/storage.js";
import { replacer } from "../utils/json.js";
import { normalizeAddress } from "../utils/normalize-address.js";
import { publicClients } from "../utils/chain-cache.js";
import { createUserIfNotExists } from "../event-watchers/userHelpers.js";

function malformedRequest(res: Response, error: string): void {
  res.statusCode = 400;
  res.end(error);
}

export function registerRoutes(app: Express, storage: Storage) {
  const basePath = "/indexer/";
  app.use(json());

  // Get all reserved events
  app.get(basePath + "reserved", async function (req, res) {
    const reserved = await storage.reserved.get();

    res.end(JSON.stringify(reserved, replacer));
  });

  // Gets all users
  app.get(basePath + "users", async function (req, res) {
    try {
      if (req.header("Authorization") !== process.env.USERS_SECRET) {
        return malformedRequest(res, "Invalid request secret");
      }

      const users = await storage.users.get();

      res.end(JSON.stringify(users, replacer));
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false }, replacer));
    }
  });

  // Update the metadata of a user
  app.post(basePath + "setMetadata", async function (req, res) {
    try {
      const account = req.body.account;
      const metadata = req.body.metadata;
      const signature = req.body.signature;
      const valid = await Promise.all(
        Object.values(publicClients).map((publicClient) =>
          publicClient.verifyMessage({ address: account, message: `OEP metadata: ${metadata}`, signature: signature })
        )
      );
      if (!valid.some((b) => b)) {
        // No single chain that approved this signature
        return malformedRequest(res, "Signature is not valid");
      }

      await storage.users.update((users) => {
        const address = normalizeAddress(account);
        createUserIfNotExists(users, address);
        users[address].metadata = JSON.parse(metadata);
      });
      res.end(JSON.stringify({ success: true }));
    } catch (error: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error?.message ?? "Unknown error" }));
    }
  });
}
