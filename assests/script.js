const userLocation = document.getElementById("userLocation");
converter = document.getElementById("converter");
weatherIcon = document.querySelector(".weatherIcon");
temperature = document.querySelector(".temperature");
feelsLike = document.querySelector(".feelsLike");
description = document.querySelector(".description");
date = document.querySelector(".date");
city = document.querySelector(".city");

HValue = document.getElementById("HValue");
WValue = document.getElementById("WValue");
SRValue = document.getElementById("SRValue");
SSValue = document.getElementById("SSValue");
CValue = document.getElementById("CValue");
UVValue = document.getElementById("UVValue");
PValue = document.getElementById("PValue");

Forecast = document.querySelector(".Forecast");

WEATHER_API_ENDPOINT=`https://api.openweathermap.org/data/2.5/weather?APPID=abd81b794f391c5fc583a64c8e5ae81e&q=`;
WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?APPID=abd81b794f391c5fc583a64c8e5ae81e&exclude=minutely&units=metric&`;

function findUserLocation(){
    Forecast.innerHTML="";

    fetch(WEATHER_API_ENDPOINT+userLocation.value)
    .then((response)=>response.json())
    .then((data)=>{
        if(data.cod!="" && data.cod!=200){
            alert(data.message);
            return;
        }
        console.log(data);

        city.innerHTML = data.name+","+data.sys.country;
        weatherIcon.style.background=`url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
        
        fetch(WEATHER_DATA_ENDPOINT+`lat=${data.coord.lat}&lon=${data.coord.lon}`)
        .then((response)=>
            response.json())
        .then((data)=>{
            console.log(data);
            temperature.innerHTML=TemConverter(data.list[0].main.temp);
            feelsLike.innerHTML="Feels Like "+ data.list[0].main.feels_like;
            description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;`+data.list[0].weather[0].description;

            const option = {
                weekday:"long",
                month:"long",
                day:"numeric",
                hour:"numeric",
                minute:"numeric",
                hour12:true
            };

            date.innerHTML = getLongFormatDateTime(
                data.list[0].dt,data.city.timezone,option
            );
            HValue.innerHTML  = Math.round(data.list[0].main.humidity)+"<span>%</span?";
            WValue.innerHTML = Math.round(data.list[0].wind.speed)+"<span>m/s</span>";

            const option1 = {
                hour:"numeric",
                minute:"numeric",
                hour12:true,
            };

            SRValue.innerHTML = getLongFormatDateTime(data.city.sunrise,data.city.timezone,option1);
            SSValue.innerHTML = getLongFormatDateTime(data.city.sunset,data.city.timezone,option1);
            CValue.innerHTML  = Math.round(data.list[0].clouds.all)+"<span>%</span?";
            UVValue.innerHTML  = Math.round(data.list[0].main.humidity)+"<span>%</span?";
            PValue.innerHTML  = Math.round(data.list[0].main.pressure)+"<span></span?"; 
            
            data.list.forEach((weather)=>{
                let div = document.createElement("div");

                const options={
                    weekday:'long',
                    month:'long',
                    day:"numeric"
                }

                let daily = getLongFormatDateTime(weather.dt,0,options).split(" at ");
                div.innerHTML = daily[0];

                div.innerHTML+=`<img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png"/>`;
                div.innerHTML+=`<p class="forecast-desc>${data.list[0].weather[0].description}"</p>`;
                div.innerHTML+=`<span><span>${TemConverter(data.list[0].main.temp_min)}&nbsp;${TemConverter(data.list[0].main.temp_max)}</span></span>`
                Forecast.append(div);
            });
        });
    });
}
function formatUnixTime(dtValue, offset, options = {}){
    const date = new Date((dtValue + offset)*1000);
    return date.toLocaleTimeString([], {timeZone: "UTC", ...options });
}

function getLongFormatDateTime(dtValue, offset, options){
    return formatUnixTime(dtValue,offset,options)
}

function TemConverter(temp){
    let tempValue = Math.round(temp);
    let message = "";
    if(converter.value=="°C"){
        message=tempValue+"<span>"+"\xB0C</span>";
    }
    else{
        let ctof = (tempValue*9)/5+32;
        message=ctof+"<span>"+"\xB0f</span>";
    }
    return message;
}