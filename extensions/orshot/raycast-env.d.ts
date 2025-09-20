/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Orshot API Key - Your Orshot API key (optional - without it you'll have rate limits) */
  "apiKey"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `create-tweet-screenshot` command */
  export type CreateTweetScreenshot = ExtensionPreferences & {}
  /** Preferences accessible in the `create-website-screenshot` command */
  export type CreateWebsiteScreenshot = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `create-tweet-screenshot` command */
  export type CreateTweetScreenshot = {
  /** twitter.com/orshotapp/status/123456789 */
  "tweetUrl": string
}
  /** Arguments passed to the `create-website-screenshot` command */
  export type CreateWebsiteScreenshot = {
  /** orshot.com */
  "websiteUrl": string
}
}

