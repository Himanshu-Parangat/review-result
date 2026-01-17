import argon2 from "argon2";
import { config } from "@config"

export async function hashPassword(password: string) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: config.hashMemoryCost,
    timeCost: config.hashComputeTimeCost,
    parallelism: config.hashComputeParallelism,
  });
}

export async function verifyPassword(hash: string, password: string) {
  return argon2.verify(hash, password);
}

