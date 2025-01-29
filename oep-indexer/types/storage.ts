import { Address } from "viem";
import { PersistentJson } from "../utils/persistent-json.js";
import { Reserved } from "./reserve.js";
import { User } from "./user.js";

export type ReservedStorage = Reserved[];
export interface UsersStorage {
  [address: Address]: User;
}

export interface Storage {
  reserved: PersistentJson<ReservedStorage>;
  users: PersistentJson<UsersStorage>;
}
