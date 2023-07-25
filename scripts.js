//Function to check if a year is a leap year (as not all years divisible by 4 are leap years)
const checkIfLeapYear = function (year){
    if (year % 4 === 0 && year % 100 !== 0){
        return true;
        } else if (year % 100 === 0 && year % 400 === 0){
            return true;    
        } else {
            return false}
}

//The function below works out how long it's been between date 1 and date 2, taking leap years into consideration.
const howLongSince = function (d1, d2, t){
    //Set variables to be used later - first one is the length of a day in ms.
    const dayMs = 86400000
    let leapYears = 0
    let nonLeapYears = 0
    let remDays = 0

    //Collect the year figure from the given year. D2Year can be changed in this function, hence it is declared with 'let'
    const d1Year = d1.getFullYear()
    let d2Year = d2.getFullYear()

    //Get the number of days in the incomplete years at the start and end of the date period
    let sDays = Math.floor((new Date(d1Year+ 1, 0, 1) - d1) / dayMs)
    let eDays = Math.floor((d2 - new Date(d2Year, 0, 1)) / dayMs)
    
    //Check to see if the incomplete days add up to a year, and if so add another year to the second date, and collect the remainder in a variable. The amount of days in the remainder depends on whether the year after the second date is a leap year or not.
    //Depending on the dates this can result in the final number being -1 day less than it actually is. I'm not sure exactly why and have run out of time to figure it out :(
    if (checkIfLeapYear(d2Year + 1) && (sDays + eDays) >= 366){
        remDays = (sDays + eDays)-366
        d2Year++
    } else if (!checkIfLeapYear(d2 + 1) && (sDays + eDays)>=365){
        remDays = (sDays + eDays)-365
        d2Year++
    } else {
        remDays = sDays + eDays
    }
    
    //Count the amount of leap years and non-leapyears between a year after the start date, up to the year of the end date.
    for (let i = d1Year + 1; i < d2Year; i++){
        if (checkIfLeapYear(i)){
            leapYears++
        } else {
            nonLeapYears++
        }
    }
    
    //Calculate total amount of days in this period
    let totalDays = (365 * nonLeapYears) + (366 * leapYears) + remDays
    
    //Set up a blank year (i.e. 01 Jan of the D2 year) then you can use the month and day figures from it in our returned values
    const cDate = new Date(d2Year, 0, 1).valueOf()
    const calcDate = new Date (cDate + (dayMs * (remDays-1)))

    //Choose what you want to be returned. "Array" is the only one used in this project, the rest I used for testing, or for "fun"
    switch (t){
        case "year":
            return leapYears + nonLeapYears
        case "month":
            return calcDate.getMonth()
        case "day":
            return calcDate.getDate()
        case "total days":
            return totalDays
        case "string":
            return `It's been ${leapYears + nonLeapYears} years, ${calcDate.getMonth()} months and ${calcDate.getDate()} days since ${d1.toDateString()}`
        case "array":
            return [leapYears + nonLeapYears, calcDate.getMonth(), calcDate.getDate()]
    }
}


const onClick = (event) => {
    //First collect the click target
    let elem = event.target;

    if (elem.id === "arrow-box" || elem.id ==="arrow-btn"){
        //Variables that track short and long months
        const sMonths = [9,4,6,11]
        const lMonths = [1,3,5,7,8,10,12]
        
        //Detects whether an error has been found in the error checking section below
        let errorDetected = false

        //Arrays consisting of HTML elements
        //--Input boxes
        const dateInput = [
            document.getElementById("year-input"), 
            document.getElementById("month-input"), 
            document.getElementById("day-input")
        ]
        //--Titles above input boxes
        const unitText = [
            document.getElementById("year-unit-text"),
            document.getElementById("month-unit-text"), 
            document.getElementById("day-unit-text")
        ]
        //--Error wording below input boxes
        const errorWording = [
            document.getElementById("year-error-text"),
            document.getElementById("month-error-text"), 
            document.getElementById("day-error-text")
        ]
        //--The text that displays the age or time since
        const activeText = [
            document.getElementById("active-years"),
            document.getElementById("active-months"),
            document.getElementById("active-days")
        ]

        //This is the date being checked, based on the inputs. I've added on the .setFullYear() to allow the age calculator to calculate based on years earlier than 100, which is the minimum normally (if you put the year for a date in as 99, it defaults the year to 1999).
        const dateToCheck = new Date(new Date(0, dateInput[1].value - 1,dateInput[2].value).setFullYear(dateInput[0].value))
        
        //Function to apply classes or styling if an error is detected, and set errorDetected to true
        const applyError = function (i){
            errorWording[i].style.display = "block"
            unitText[i].classList.add("unit-error-state")
            dateInput[i].classList.add("box-error-state") 
            errorDetected = true;
        }
        
        //Reset styling for a new check (errorDetected is reset in its declaration)
        for (let i = 0; i < 3; i++){
            errorWording[i].style.display = "none"
            unitText[i].classList.remove("unit-error-state")
            dateInput[i].classList.remove("box-error-state")
            activeText[i].innerText = "--"
        } 
        
        //ERROR DETECTION
        //Checks through various secenarios. The input type is set to number, so letters cannot be added, and so there's no error condition for it.
        for (let i = 0; i < 3; i++){
            //--Empty Field
            if (dateInput[i].value == ""){
                errorWording[i].innerText = "This field is required"
                applyError(i)
            //--Input contains .+-
            } else if (/[\.+-]/g.test(dateInput[i].value)){
                errorWording[i].innerText = "Invalid date"
                applyError(i)
            //--Number is 0 or below
            } else if (Number(dateInput[i].value) < 1){
                errorWording[i].innerText = "Must be higher than 0"
                applyError(i)
            //--Month is higher than 12
            } else if (dateInput[i].id ==="month-input" && dateInput[i].value >12){
                errorWording[i].innerText = "Invalid date"
                applyError(i)
            //--DAY CHECKS
            } else if (dateInput[i].id ==="day-input"){
                //---Date is 32+ when max number of days in that month is 31
                if (lMonths.includes(Number(dateInput[1].value)) && dateInput[i].value >31){
                    errorWording[i].innerText = "Invalid date"
                    applyError(i)
                //---Date is 31+ when max number of days in that month is 30
                } else if (sMonths.includes(Number(dateInput[1].value)) && dateInput[i].value >30){
                    errorWording[i].innerText = "Invalid date"
                    applyError(i)
                //---IF FEBRUARY
                } else if (Number(dateInput[1].value) === 2){
                    //----Date is 30+ when max number of days in that month is 29
                    if (checkIfLeapYear(Number(dateInput[0].value)) && dateInput[i].value >29){
                        errorWording[i].innerText = "Invalid date"
                        applyError(i)
                    //----Date is 29+ when max number of days in that month is 28
                    } else if (!checkIfLeapYear(Number(dateInput[0].value)) && dateInput[i].value >28){
                        errorWording[i].innerText = "Invalid date"
                        applyError(i)
                    }
                }
            //--Date is in the future
            } else if (dateToCheck.valueOf() > new Date().valueOf()){
                errorWording[i].innerText = "Must be in the past"
                applyError(i)
            }
        }
        //If no error is detected, then add the age numbers to the screen
        if (errorDetected === false){
            let numArray = howLongSince(dateToCheck,new Date(),"array")
            document.getElementById("active-years").innerText = numArray[0]
            document.getElementById("active-months").innerText = numArray[1]
            document.getElementById("active-days").innerText = numArray[2]
        }

    }
}

window.addEventListener('click', onClick)