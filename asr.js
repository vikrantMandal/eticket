function callme() {
    document.getElementById("startButton").click();
}


var output = document.getElementById('output');
const translation = document.getElementById('translation');
const startButton = document.getElementById('startButton');

// Event listener for button click to start recognition
startButton.addEventListener('click', function () {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Create a new instance of SpeechRecognition
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        const sl = document.getElementById('source_lang').value;

        // Set recognition parameters
        recognition.lang = sl;
        console.log(recognition)
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Event handler when recognition starts
        recognition.onstart = function () {
            output.textContent = 'Listening...';
        };

        // Event handler when recognition ends
        recognition.onend = function () {
            //output.textContent = 'Stopped listening.';
            document.getElementById("micButton").checked = false;
        };

        // Event handler for recognized speech
        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            output.textContent = '';//'You said: ' + transcript;

            // Call translation API
            translateText(transcript);

        };

        // Event handler for errors
        recognition.onerror = function (event) {
            output.textContent = 'Error occurred in recognition: ' + event.error;
        };

        recognition.start();
    } else {
        output.textContent = 'Speech recognition not supported in your browser.';
    }
});




function translateText(text) {
    const sl = document.getElementById('source_lang').value;
    const dl = document.getElementById('dest_lang').value;
    const myHeaders = new Headers();
    myHeaders.append("Accept", " */*");
    myHeaders.append("User-Agent", " Thunder Client (https://www.thunderclient.com)");
    myHeaders.append("Authorization", "IFbnC4rEgADvDFDukOTK2KN2IUn28kd4R3KIN4-teWdc12zZHxpuelxR2wrnjRuR");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": sl,
                        "targetLanguage": dl
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": text
                }
            ]
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            const jsonString = result;
            const parsedObject = JSON.parse(jsonString);
            const translationOutput = parsedObject.pipelineResponse[0].output[0];
            const sourceText = translationOutput.source;
            const targetText = translationOutput.target;
            translation.textContent = targetText;
            texttospeech(targetText);
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });

}


function texttospeech(text) {
    const sl = document.getElementById('source_lang').value;
    const dl = document.getElementById('dest_lang').value;
    var serviceId = getServiceId(dl);
    const myHeaders = new Headers();
    myHeaders.append("Accept", " */*");
    myHeaders.append("User-Agent", " Thunder Client (https://www.thunderclient.com)");
    myHeaders.append("Authorization", "IFbnC4rEgADvDFDukOTK2KN2IUn28kd4R3KIN4-teWdc12zZHxpuelxR2wrnjRuR");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "tts",
                "config": {
                    "language": {
                        "sourceLanguage": dl
                    },
                    "serviceId": serviceId,
                    "gender": "female",
                    "samplingRate": 8000
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": text
                }
            ]
        }
    });
    console.log(raw);
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(result)
            var baseaudio = JSON.parse(result).pipelineResponse[0].audio[0].audioContent;
            //const trimmedBase64 = base64data.replace('data:audio/mp3;base64,', '');
            const audio = new Audio();
            audio.src = `data:audio/wav;base64,${baseaudio}`;
            audio.play();
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });
}

function getServiceId(lang) {
    const myHeaders = new Headers();
    myHeaders.append("userID", "ba1e9cc516004c129f70b60412b19884");
    myHeaders.append("ulcaApiKey", "58618dfd40-9db6-4f23-97ca-7d2a30f29b17");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "tts",
                "config": {
                    "language": {
                        "sourceLanguage": lang
                    }
                }
            }
        ],
        "pipelineRequestConfig": {
            "pipelineId": "64392f96daac500b55c543cd"
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline", requestOptions)
        .then((response) => {
        })

        .then((result) => {
            var data = JSON.parse(result);
            var serviceId = data.pipelineResponseConfig[0].config[0].serviceId;
            console.log('service id', serviceId);
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });
}

// api call for language translation
function languageTranslation(stext) {
    var dl = document.getElementById("trans_dest_lang").value;
    var sl = document.getElementById("trans_source_lang").value;
    const myHeaders = new Headers();
    myHeaders.append("Accept", " */*");
    myHeaders.append("User-Agent", " Thunder Client (https://www.thunderclient.com)");
    myHeaders.append("Authorization", "IFbnC4rEgADvDFDukOTK2KN2IUn28kd4R3KIN4-teWdc12zZHxpuelxR2wrnjRuR");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": sl,
                        "targetLanguage": dl
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": stext
                }
            ]
        }
    });

    const requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };

    fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(result);
            document.getElementById("trans_langtextDest").value = JSON.parse(result).pipelineResponse[0].output[0].target;
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });
}

function neuraltranslation() {
    var sl = document.getElementById("trans_source_lang").value;
    var stext = document.getElementById("trans_langtextSource").value;
    const myHeaders = new Headers();
    myHeaders.append("Accept", " */*");
    myHeaders.append("User-Agent", " Thunder Client (https://www.thunderclient.com)");
    myHeaders.append("Authorization", "IFbnC4rEgADvDFDukOTK2KN2IUn28kd4R3KIN4-teWdc12zZHxpuelxR2wrnjRuR");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": sl,
                        "targetLanguage": sl
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": stext
                }
            ]
        }
    });

    const requestOptions = { method: "POST", headers: myHeaders, body: raw, redirect: "follow" };

    fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            var transtext = JSON.parse(result).pipelineResponse[0].output[0].target;
            languageTranslation(transtext);
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });
}


function textToSpeechConversion() {
    var sl = document.getElementById("tts_source_lang").value;
    var dl = document.getElementById("tts_dest_lang").value;
    var text = document.getElementById("ttsTextarea").value;
    const myHeaders = new Headers();
    myHeaders.append("Accept", " */*");
    myHeaders.append("User-Agent", " Thunder Client (https://www.thunderclient.com)");
    myHeaders.append("Authorization", "IFbnC4rEgADvDFDukOTK2KN2IUn28kd4R3KIN4-teWdc12zZHxpuelxR2wrnjRuR");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": sl,
                        "targetLanguage": dl
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": text
                }
            ]
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            const jsonString = result;
            const parsedObject = JSON.parse(jsonString);
            const translationOutput = parsedObject.pipelineResponse[0].output[0];
            const sourceText = translationOutput.source;
            const targetText = translationOutput.target;
            translation.textContent = targetText;
            texttospeechconversion(targetText);
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });
}

function texttospeechconversion(text) {
    const sl = document.getElementById('tts_source_lang').value;
    const dl = document.getElementById('tts_dest_lang').value;
    var serviceId = getServiceId(dl);
    const myHeaders = new Headers();
    myHeaders.append("Accept", " */*");
    myHeaders.append("User-Agent", " Thunder Client (https://www.thunderclient.com)");
    myHeaders.append("Authorization", "IFbnC4rEgADvDFDukOTK2KN2IUn28kd4R3KIN4-teWdc12zZHxpuelxR2wrnjRuR");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "tts",
                "config": {
                    "language": {
                        "sourceLanguage": dl
                    },
                    "serviceId": serviceId,
                    "gender": "female",
                    "samplingRate": 8000
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": text
                }
            ]
        }
    });
    console.log(raw);
    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(result)
            var baseaudio = JSON.parse(result).pipelineResponse[0].audio[0].audioContent;
            //const trimmedBase64 = base64data.replace('data:audio/mp3;base64,', '');
            const audio = new Audio();
            audio.src = `data:audio/wav;base64,${baseaudio}`;
            audio.play();
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });
}


function speechRecg() {
    output = document.getElementById("trans_langtextSource");
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        // Create a new instance of SpeechRecognition
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        const sl = document.getElementById('source_lang').value;

        // Set recognition parameters
        recognition.lang = sl;
        console.log(recognition)
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // Event handler when recognition starts
        recognition.onstart = function () {
            output.textContent = 'Listening...';
        };

        // Event handler when recognition ends
        recognition.onend = function () {
            //output.textContent = 'Stopped listening.';
            document.getElementById("micButton1").checked = false;
        };

        // Event handler for recognized speech
        recognition.onresult = function (event) {
            document.getElementById("startButton1").click();
            const transcript = event.results[0][0].transcript;
            //output.textContent = 'You said: ' + transcript;

            // Call translation API
            translateTextNeuralOutput(transcript);

        };

        // Event handler for errors
        recognition.onerror = function (event) {
            output.textContent = 'Error occurred in recognition: ' + event.error;
        };

        recognition.start();
    } else {
        output.textContent = 'Speech recognition not supported in your browser.';
    }
}

function translateTextNeuralOutput(text) {
    const sl = document.getElementById('source_lang1').value;
    const dl = document.getElementById('dest_lang1').value;
    const myHeaders = new Headers();
    myHeaders.append("Accept", " */*");
    myHeaders.append("User-Agent", " Thunder Client (https://www.thunderclient.com)");
    myHeaders.append("Authorization", "IFbnC4rEgADvDFDukOTK2KN2IUn28kd4R3KIN4-teWdc12zZHxpuelxR2wrnjRuR");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": sl,
                        "targetLanguage": sl
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": text
                }
            ]
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            const jsonString = result;
            const parsedObject = JSON.parse(jsonString);
            const translationOutput = parsedObject.pipelineResponse[0].output[0];
            const sourceText = translationOutput.source;
            const targetText = translationOutput.target;
            translateTextOutput(targetText);
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });

}

function translateTextOutput(text) {
    const sl = document.getElementById('source_lang1').value;
    const dl = document.getElementById('dest_lang1').value;
    const myHeaders = new Headers();
    myHeaders.append("Accept", " */*");
    myHeaders.append("User-Agent", " Thunder Client (https://www.thunderclient.com)");
    myHeaders.append("Authorization", "IFbnC4rEgADvDFDukOTK2KN2IUn28kd4R3KIN4-teWdc12zZHxpuelxR2wrnjRuR");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": sl,
                        "targetLanguage": dl
                    },
                    "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": text
                }
            ]
        }
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            const jsonString = result;
            const parsedObject = JSON.parse(jsonString);
            const translationOutput = parsedObject.pipelineResponse[0].output[0];
            const sourceText = translationOutput.source;
            const targetText = translationOutput.target;
            document.getElementById("sttTextarea").textContent = targetText;
        })
        .catch((error) => {
            alert(error);
            //console.error(error)
        });

}