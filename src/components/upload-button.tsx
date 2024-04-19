"use client";

import { useRouter } from "next/navigation";
import { UploadButton } from "utils/uploadthing";

export const SlugUploadButton = () => {
	const router = useRouter();
	
	return (
		<UploadButton
			endpoint="voiceUploader"
			onClientUploadComplete={(res) => {
				console.log("Files: ", res);
				router.refresh();
			}}
			onUploadError={(error: Error) => {
				console.error(`ERROR! ${error.message}`);
			}}
		/>
	)
};
