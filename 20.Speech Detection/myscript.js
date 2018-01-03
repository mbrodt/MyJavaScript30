    
    // Library to create bubbles in the background
    bubbly({
        animate: true, // default is true
        blur: 1, // default is 4
        bubbleFunc: () => `hsla(${Math.random() * 360}, 100%, 50%, ${Math.random() * 0.25})`, // default is () => `hsla(0, 0%, 100%, ${r() * 0.1})`)
        bubbles: 10, // default is Math.floor((canvas.width + canvas.height) * 0.02);
        canvas: document.querySelector("#background"), // default is created and attached
        colorStart: "#00F260", // default is blue-ish
        colorStop: "#0575E6",// default is blue-ish
        compose: "lighter", // default is "lighter"
        shadowColor: "#fff", // default is #fff
    });
    
    // Get the HTML elements
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const input = document.querySelector('.input')
    const recognition = new SpeechRecognition();
    const getWeatherButton = document.querySelector("button");
    const h3 = document.querySelector("h3");
    const speechOutput = document.querySelector('.speechOutput');
    const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    let p = document.createElement('p');
    speechOutput.appendChild(p);


    // Declare functions

    function getCphWeather() {
        getWeather("Copenhagen");
      }

    // Main function that grabs the weather from the OpenWeatherMap API
    // Receives a JSON response and sets the HTML text with the variables  
    function getWeather(city){
      // speech recognition shortens Copenhagen to CPH
      if (city === 'CPH') city = 'Copenhagen'
      // if there is no input, return from the function to prevent sending an api request
      if (city === '' ) { h3.innerText = 'Please enter a city'; return}
          $.getJSON(`http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=31a20c37cb371651aef061539f43b521`,function(json){
            // Show the entire JSON response
            // h2.innerText = (JSON.stringify(json));
            let city = json.name;
            let curTemp = json.main.temp;
            let minTemp = json.main.temp_min;
            let maxTemp = json.main.temp_max;
            let windSpeed = json.main.temp_max;
            let cloudPer = json.clouds.all;
  
            let cityText = `Current weather in ${city}
            
            ` //has to be like this to force newlines
            let tempText = `The temperature is ${curTemp}°. The minimum temperature is ${minTemp}°, and the maximum temperature is ${maxTemp}°. ` 
            let windText = `The wind speed is ${windSpeed}m/s. `
            let cloudText = `The cloudiness is ${cloudPer}%. `
            let enjoyText = "Enjoy your day!"
  
            // go through each checkbox manually and if it is checked, append the appropriate text. TODO: think of better way to do this
            let finalText = cityText;
            if (checkBoxes[0].checked) {
              finalText += tempText;
            }
  
            if (checkBoxes[1].checked) {
              finalText += windText;
            }
  
            if (checkBoxes[2].checked) {
              finalText += cloudText;
            }
  
            finalText += enjoyText;
  
          // Update the h3 element to display the output to the user
          h3.innerText = `${finalText}`
  
          }).fail(function() { //if the JSON request fails, tell the user
            h3.innerHTML = "That is not a valid search. Please try a different city";
          });
          
      }
  
    // Take the speech and transform it into actual words
    function speechToText(e) {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
        console.log(transcript);
        p.textContent = transcript;
        if (e.results[0].isFinal) {
          speechOutput.appendChild(p);
          getWeather(transcript);
        }
      console.log(transcript);  
    }  
  

    // Add event listeners 

    getWeatherButton.addEventListener('click', () => {
      let city = input.value;
      console.log(city);
      getWeather(city); 
      input.value = '';
    });
  
    // if Enter is pressed when the input is in focus, click the weatherButton to search
    input.addEventListener('keyup', function(e) {
      if (e.keyCode === 13) {
        getWeatherButton.click();
      }
    });

    recognition.addEventListener('result', speechToText);
    recognition.addEventListener('end', recognition.start);
    recognition.interimResults = true; // save the recorded words while talking    
    recognition.start();
  