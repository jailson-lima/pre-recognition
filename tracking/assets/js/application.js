const video = document.querySelector('video')
const canvas = document.querySelector('canvas')
const span = document.querySelector('small span')
const context = canvas.getContext('2d')
const tracker = new tracking.ObjectTracker('face')

tracking.track(video, tracker, {camera: true})

tracker.on('track', function (event) {
    // Mostra os dados da detecção.
    console.log(event.data)

    // Limpa o canvas.
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Nesse ponto o pre serviço irá disparar um sinal para ativar ou desativar
    // o fluxo de detecção do motor.
    if (event.data.length > 0) {
        // console.log(data.length + ' faces detected') // LOG
        span.textContent = event.data.length.toString()

        event.data.forEach(function (rect) {
            context.strokeStyle = '#ff0000'
            context.lineWidth = 2
            context.strokeRect(rect.x, rect.y, rect.width, rect.height)
        })
    }
    else {
        // console.log('Zero faces detected') // LOG
        span.textContent = event.data.length.toString()
    }
})