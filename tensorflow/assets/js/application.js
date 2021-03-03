const video = document.querySelector('video')
const span = document.querySelector('small span')

// Inicialização da câmera.
function initVideo() {
    navigator.mediaDevices.enumerateDevices()
    .then(devices => {
        if (Array.isArray(devices)) {
            // console.log(devices) // LOG
            devices.forEach(device => {
                if (device.kind == 'videoinput') {
                    // console.log(device) // LOG
                    if (device.label.includes('Webcam')) {
                        // Utiliza o vídeo da câmera.
                        navigator.getUserMedia(
                            {video: {deviceId: device.deviceId}},
                            stream => video.srcObject = stream,
                            error => console.error(error)
                        )
                    }
                }
            })

        }
    })
}

// Importação dos modelos.
Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri('./assets/lib/face-api/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./assets/lib/face-api/weights'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/lib/face-api/weights')
]).then(initVideo)

video.addEventListener('play', async function () {
    // Criação do canvas associado ao video.
    const canvas = faceapi.createCanvasFromMedia(video)
    faceapi.matchDimensions(canvas, {width: video.width, height: video.height})
    document.body.appendChild(canvas)

    setInterval(async function() {
        faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .then((detections) => {
                // Mostra os dados da detecção.
                console.log(detections)

                // Limpa o canvas.
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

                // Nesse ponto o pre serviço irá disparar um sinal para ativar ou desativar
                // o fluxo de detecção do motor.
                if (detections.length > 0) {
                    // console.log(detections.length + ' faces detected') // LOG
                    span.textContent = detections.length.toString()

                    detections.forEach(function (detection) {
                        // Desenha os retângulos nas faces detectadas.
                        faceapi.draw.drawDetections(canvas, detection.box)
                    })
                }
                else {
                    // console.log('Zero faces detected') // LOG
                    span.textContent = detections.length.toString()
                }
            })
    }, 200)
})