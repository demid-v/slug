"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUploadThing } from "utils/uploadthing";

let mediaRecorder: MediaRecorder | null = null;

export const SlugUploadButton = () => {
	const router = useRouter();

	const [isRecording, setIsRecording] = useState(false);

	const { startUpload } = useUploadThing("voiceUploader", {
		onClientUploadComplete: (res) => {
      console.log("Upload Completed.", res);

			router.refresh();
    },
	});

	useEffect(() => {
		if (isRecording) {
			const constraints = { audio: true };
		
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then((stream) => {
					mediaRecorder = new MediaRecorder(stream);
					
					mediaRecorder.ondataavailable = (e) => {
						const file = new File(
							[e.data],
							`${new Date().toISOString()}.mp3`,
						);
						void startUpload([file]);
					};

					mediaRecorder.start();

					console.log(mediaRecorder.state);
					console.log("recorder started");

				}).catch((err) => {
					console.error(err);
				})
		} else {
			mediaRecorder?.stop();

			console.log(mediaRecorder?.state);
			console.log("recorder stopped");
		}

		return () => {
			mediaRecorder?.stop();
			mediaRecorder = null;
		}
	}, [isRecording, startUpload])

  return (
    <div>
      <p>{isRecording}</p>
      <button onClick={() => setIsRecording((state) => !state)}>
				{isRecording ? <span>Stop</span> : <span>Start</span>} Recording
			</button>
    </div>
  );
};