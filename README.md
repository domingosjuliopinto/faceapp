# faceapp
Final Assessment for React Training. Faceapp performs real-time face detection and emotion recognition through the user's webcam. It provides an interactive interface with button and toggle to enable or disable face and emotion detection features respectively.

## Features

- **Real-time Face Detection**: Detects faces in the webcam feed by surrounding the face with a box.
- **Emotion Recognition**: Identifies emotions such as happiness, neutral, surprised etc., and displays them on the video feed.
- **Interactive Controls**: Button and Toggle switch to enable or disable face and emotion detection respectively.
- **Responsive Design**: Utilizes Material-UI components for a clean and responsive UI.

## Dependencies

- [React](https://reactjs.org/)
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [@mui/material](https://mui.com/)

## FaceDetector.jsx Component Breakdown

- **`videoRef`**: Reference to the HTML `<video>` element capturing the webcam feed.
- **`canvaRef`**: Reference to the `<canvas>` element used for drawing detections.
- **`countFaces`**: State variable to keep track of the number of faces detected.
- **`faceDetect`**: Boolean state to toggle face detection on or off.
- **`emotionDetect`**: Boolean state to toggle emotion recognition on or off.
- **`handleClick`**: Function to toggle face detection.
- **`handleToggle`**: Function to toggle emotion recognition.

**Note**: Ensure that your application has permission to access the webcam.
