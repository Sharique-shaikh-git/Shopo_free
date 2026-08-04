const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Monorepo root (two levels up from apps/merchant-mobile)
const monorepoRoot = path.resolve(__dirname, "../..");

const config = getDefaultConfig(__dirname);

// ─── Monorepo: watch shared packages ────────────────────────────────────────
config.watchFolders = [monorepoRoot];

// ─── Resolver: look for node_modules at both app and monorepo root ──────────
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// ─── Limit workers to prevent "Data cannot be cloned, out of memory" ─────────
// Metro uses jest-worker internally. On large monorepos with Node 24,
// multiple workers cause OOM crashes. Capping at 2 keeps memory safe.
config.maxWorkers = 2;

module.exports = config;
