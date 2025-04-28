import React, {useEffect, useRef, useState} from "react"
import * as faceapi from 'face-api.js'
import {Box, Grid} from '@mui/material'

const FaceDetector = () => {
    const videoRef = useRef(null);
    const canvaRef = useRef(null);
    const [countFaces, setCountFaces] = useState(0);
    const [faceDetect, setFaceDetect] = useState(true);
    //const [emotionDetect, setEmotionDetect] = useState(true);

    const handleClick = () => {
        setFaceDetect((prev) => !prev);
    };

    // const handleToggle = () => {
    //     setEmotionDetect((prev) => !prev);
    // };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({video:{}}).then(stream=>{
            videoRef.current.srcObject = stream
        }).catch(err=>console.error("Error accessing webcam:",err))
    }

    useEffect(() => {
        const loadModels = async() => {
            const MODEL_URL = '/models';
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
            startVideo()
        }
        loadModels()
    }, [])

    useEffect(() => {
        const interval = setInterval(async() => {
            if(videoRef.current && faceapi.nets.tinyFaceDetector.params){
                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();

                const canvas = canvaRef.current;
                faceapi.matchDimensions(canvas,{
                    width:videoRef.current.width,
                    height:videoRef.current.height
                })

                const resized = faceapi.resizeResults(detections, {
                    width:videoRef.current.width,
                    height:videoRef.current.height                    
                })

                canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
                if (faceDetect) {
                    faceapi.draw.drawDetections(canvas,resized);

                    faceapi.draw.drawFaceExpressions(canvas,resized);
                }
                faceDetect ? setCountFaces(detections.length) : setCountFaces(0); 
            }
        },500)

        //unmount
        return () => clearInterval(interval);
    }, [faceDetect/*, emotionDetect*/])

    return(
        <>
            <Box position={'relative'} display={'flex'} justifyContent={'center'} mt={4}>
                <>
                    <video 
                        ref={videoRef}
                        autoPlay
                        muted
                        width={'720'}
                        height={'560'}
                        style={{border:10}}
                    />
                    <canvas 
                        ref={canvaRef}
                        width={'720'}
                        height={'560'}
                        style={{
                            position:'absolute',
                            top:0,
                            left:0,
                            borderRadius:10
                        }}
                    />
                </>
            </Box>
            <Grid container spacing={2}>
                <Grid size={{ xs: 6, md: 4 }}>
                <button
                    onClick={handleClick}
                    style={{
                        backgroundColor: faceDetect ? "green" : "red",
                        color: "white",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    {faceDetect ? "Face Detection On" : "Face Detection Off"}
                </button>
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                    Expression Toggle
                </Grid>
                <Grid size={{ xs: 6, md: 4 }}>
                    Number of Faces Detected : {countFaces}
                </Grid>
            </Grid>
        </>
    )
}
export default FaceDetector
