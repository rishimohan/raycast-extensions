import { showToast, Toast, getPreferenceValues, LaunchProps } from "@raycast/api";
import { writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

interface Preferences {
  apiKey?: string;
}

interface Arguments {
  tweetUrl: string;
}

interface ApiResponse {
  data?: {
    content?: string;
  };
  error?: string;
}

export default async function Command(props: LaunchProps<{ arguments: Arguments }>) {
  let { tweetUrl } = props.arguments;

  if (!tweetUrl || tweetUrl.trim() === "") {
    await showToast({
      style: Toast.Style.Failure,
      title: "Tweet URL Required",
      message: "Please provide a valid tweet URL",
    });
    return;
  }

  // Add https:// if URL doesn't start with http or https
  tweetUrl = tweetUrl.trim();
  if (!tweetUrl.startsWith("http://") && !tweetUrl.startsWith("https://")) {
    tweetUrl = "https://" + tweetUrl;
  }

  await showToast({
    style: Toast.Style.Animated,
    title: "Generating Tweet Screenshot",
    message: "Please wait...",
  });

  try {
    const preferences = getPreferenceValues<Preferences>();

    const response = await fetch("https://orshot.com/api/templates/make-playground-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateSlug: "tweet-image",
        modifications: {
          tweetUrl: tweetUrl,
        },
        userAPIKey: preferences.apiKey,
        responseType: "base64",
        responseFormat: "png",
        renderType: "images",
      }),
    });

    const data = (await response.json()) as ApiResponse;

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate screenshot");
    }

    if (!data.data?.content) {
      throw new Error("No image data received");
    }

    // Extract base64 data from data URL format
    const base64Data = data.data.content.split(",")[1];
    if (!base64Data) {
      throw new Error("Invalid image data format");
    }

    // Convert base64 to buffer and save to desktop
    const imageBuffer = Buffer.from(base64Data, "base64");
    const desktopPath = join(homedir(), "Desktop");
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `tweet-screenshot-${timestamp}.png`;
    const filepath = join(desktopPath, filename);

    writeFileSync(filepath, imageBuffer);

    await showToast({
      style: Toast.Style.Success,
      title: "Screenshot Generated",
      message: `Saved to Desktop as ${filename}`,
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to Generate Screenshot",
      message: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
