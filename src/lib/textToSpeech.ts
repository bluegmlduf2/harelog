export function textToSpeech(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    const voices = speechSynthesis.getVoices();

    // getVoices가 비어있는 버그가 있어서 onvoiceschanged 이벤트를 사용
    if (voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => textToSpeech(text);
        return;
    }

    // 해당 브라우저(모바일)에서 지원하지 않는 목소리가 있기 때문에 여러 이름을 시도
    const selectedVoice =
        voices.find((v) =>
            ["Aaron", "Samantha", "Google US English"].some((name) =>
                v.name.includes(name)
            )
        ) || voices.find((v) => v.lang === "en-US");

    if (selectedVoice) utterance.voice = selectedVoice;

    speechSynthesis.speak(utterance);
}
