import React, { useEffect } from "react";
import "./App.css";
import * as canvas from "canvas";
// import * as tf from "@tensorflow/tfjs";
import * as faceapi from "face-api.js";

function App() {

  

  function startVideo(video) {
    console.log("loaded")
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.log(err)
    )
      startDetection(video)
  }

  function startDetection(video){
    video.addEventListener('play', () => {
      const canvas = faceapi.createCanvasFromMedia(video)
      document.body.append(canvas)
      const displaySize = { width: video.width, height: video.height }
      faceapi.matchDimensions(canvas, displaySize)
      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
      }, 100)
    })
  }

  useEffect(() => {
    var video = document.getElementById("video")
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ]).then(startVideo(video))
  }, []);

  return (
    <>
    <h1 style={{color:"white"}}>
      React Emotion-AI
    </h1>
<video id="video" width="720" height="560" autoplay="true" ></video>
    </>
      
  )
}

export default App;
