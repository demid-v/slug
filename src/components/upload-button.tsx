"use client";

import { useEffect, useState } from "react";

let mediaRecorder: MediaRecorder | null = null;
const chunks: Blob[] = [];

export const SlugUploadButton = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [mediaBlobUrl, setMediaBlobUrl] = useState<string>();

	useEffect(() => {
		if (isRecording) {
			const constraints = { audio: true };
		
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then((stream) => {
					mediaRecorder = new MediaRecorder(stream);
					
					mediaRecorder.ondataavailable = (e) => {
						chunks.push(e.data);

						console.log(chunks);
						const blob = new Blob(chunks);
						const audioURL = URL.createObjectURL(blob);
						setMediaBlobUrl(audioURL);
					};

					mediaRecorder.start();

					console.log(mediaRecorder.state);
					console.log("recorder started");

				}).catch((err) => {
					console.error(err);
				})
		} else {
			mediaRecorder?.stop();

			chunks.splice(0, chunks.length);

			console.log(mediaRecorder?.state);
			console.log("recorder stopped");
		}
	}, [isRecording])

  return (
    <div>
      <p>{isRecording}</p>
      <button onClick={() => setIsRecording((state) => !state)}>
				{isRecording ? <span>Stop</span> : <span>Start</span>} Recording
			</button>
      <audio src={mediaBlobUrl} controls />
    </div>
  );
};