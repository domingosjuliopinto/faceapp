import React, {useEffect, useRef, useState} from "react"
import * as faceapi from 'face-api.js'
import {Box, Typography} from '@mui/material'

const FaceDetector = () => {
    const videoRef = useRef(null);
    const canvaRef = useRef(null);
    const [loading, setLoading] = useState(true);

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
                faceapi.draw.drawDetections(canvas,resized);
                faceapi.draw.drawFaceExpressions(canvas,resized);
            }
        },500)

        //unmount
        return () => clearInterval(interval);
    }, [])

    return(
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
    )
}
export default FaceDetector
