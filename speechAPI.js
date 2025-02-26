window.addEventListener("DOMContentLoaded", () => {
    const recordingButton = document.getElementById("recording-button");
    const speakButton = document.getElementById("speak");
    const transcriptionResult = document.getElementById("transcription-result");

    let isRecording = false;
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof SpeechRecognition !== "undefined") {

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        const U = new SpeechSynthesisUtterance();
        let voices = speechSynthesis.getVoices();

        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            voices.forEach((voice, index) => {
                select.options[index] = new Option(voice.name, index)
            })
            const defaultVoiceIndex = voices.findIndex(
                (voice) => voice.name === 'Google US English'
            )
            select.selectedIndex = defaultVoiceIndex
        };

        const onResult = (event) => {
            transcriptionResult.textContent = "";
            for (const result of event.results) {
                const text = document.createTextNode(result[0].transcript);

                const p = document.createElement("p");
                p.appendChild(text);
                if (result.isFinal) {
                    p.classList.add("final");
                }
                transcriptionResult.appendChild(p);
            }
        };

        const onClick = (event) => {
            if (isRecording) {
                recognition.stop();
                recordingButton.textContent = "Start recording";
            } else {
                recognition.start();
                recordingButton.textContent = "Stop recording";
            }
            isRecording = !isRecording;
        };

        const onClickS = (event) => {
            speechSynthesis.cancel()

            const  textContent  = textarea.value;

            if (!textContent) return;

            textContent.split('.').forEach((text) => {
                const trimmed = text.trim()
                if (trimmed) {
                    const U = new SpeechSynthesisUtterance(text)
                    const voice = voices[select.value]
                    U.voice = voice
                    U.lang = voice.lang
                    U.volume = 1
                    U.rate = 1
                    U.pitch = 1
                    speechSynthesis.speak(U)
                }
            })
        }

    recognition.addEventListener("result", onResult);
    recordingButton.addEventListener("click", onClick);
    speakButton.addEventListener("click", onClickS);
} else {
    recordingButton.remove();
    const message = document.getElementById("error-message");
    message.removeAttribute("hidden");
    message.setAttribute("aria-hidden", "false");
}
});