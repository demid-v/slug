"use client";

import { UploadButton } from "utils/uploadthing";

export const SlugUploadButton = () =>
	<UploadButton
		endpoint="imageUploader"
		onClientUploadComplete={(res) => {
			// Do something with the response
			console.log("Files: ", res);
		}}
		onUploadError={(error: Error) => {
			// Do something with the error.
			console.error(`ERROR! ${error.message}`);
		}}
	/>
