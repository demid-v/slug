"use client";

import { UploadButton } from "utils/uploadthing";

export const SlugUploadButton = () => {
	return (
		<UploadButton
			endpoint="voiceUploader"
			onClientUploadComplete={(res) => {
				console.log("Files: ", res);
			}}
			onUploadError={(error: Error) => {
				console.error(`ERROR! ${error.message}`);
			}}
		/>
	)
};
