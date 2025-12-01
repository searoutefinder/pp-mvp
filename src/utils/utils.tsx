  /**
   * Determines the time period (dawn, day, dusk, night) based on current time
   * @param {number} currentTime - Current time as unix timestamp (integer)
   * @returns {Promise<string>} - Returns 'dawn', 'day', 'dusk', or 'night'
   * @throws {Error} - Throws error for invalid input or API issues
   */


  export enum MapMode {
    Day = "day",
    Night = "night",
    Dusk = "dusk",
    Dawn = "dawn"
  }


  export const getTimePeriod = async(currentTime) => {
    // Input validation
    if (!Number.isInteger(currentTime)) {
        throw new Error('Input must be an integer (unix timestamp)');
    }
    
    if (currentTime < 0) {
        throw new Error('Unix timestamp must be positive');
    }
    
    const API_URL = 'https://api.sunrisesunset.io/json?lat=47.51083&lng=18.92717&time_format=unix';
    
    try {
        // Fetch data from API
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate API response structure
        if (!data.results || typeof data.results !== 'object') {
            throw new Error('Invalid API response: missing results object');
        }

        const { dawn: dawnStr, sunrise: sunriseStr, dusk: duskStr, sunset: sunsetStr } = data.results;
        
        const dawn = parseInt(dawnStr, 10);
        const sunrise = parseInt(sunriseStr, 10);
        const dusk = parseInt(duskStr, 10);
        const sunset = parseInt(sunsetStr, 10);

        // Validate that all required timestamps exist and are numbers
        const timestamps = { dawn, sunrise, dusk, sunset };

        for (const [key, value] of Object.entries(timestamps)) {
            if (typeof value !== 'number' || !Number.isInteger(value)) {
                throw new Error(`Invalid ${key} timestamp in API response`);
            }
        }
        
        //console.log(currentTime, dawn, sunrise, dusk, sunset)
        // Determine time period based on logic
        if (currentTime < dawn) {
            return MapMode.Night;
        } else if (currentTime >= dawn && currentTime < sunrise) {
            return MapMode.Dawn;
        } else if (currentTime >= sunrise && currentTime < dusk) {
            return MapMode.Day;
        } else if (currentTime >= dusk && currentTime < sunset) {
            return MapMode.Dusk;
        } else if(currentTime >= sunset) {
          return MapMode.Night;
        }
        
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Network error: Unable to reach sunrise/sunset API');
        }
        throw error; // Re-throw other errors as-is
    }
  }

  export const diffFromNow = (timestampUtc: string) => {
    const inputDate = new Date(timestampUtc);
    const now = new Date();
  
    // difference in milliseconds
    const diffMs = now.getTime() - inputDate.getTime();
  
    // convert to minutes
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
  
    return {
      "hours": Math.abs(hours) < 10 ? `0${Math.abs(hours)}` : `${Math.abs(hours)}`,
      "minutes": Math.abs(minutes) < 10 ? `0${Math.abs(minutes)}` : `${Math.abs(minutes)}`
    };
  }  