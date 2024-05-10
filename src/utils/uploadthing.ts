import { generateReactHelpers } from "@uploadthing/react";
import type { VoiceUploaderRouter } from "~/app/api/uploadthing/core";

export const { useUploadThing } = generateReactHelpers<VoiceUploaderRouter>();
