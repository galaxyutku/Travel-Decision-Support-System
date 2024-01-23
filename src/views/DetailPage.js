import {
  Autocomplete,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Stack,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import "../styles.css";
import {specificLocation} from "../const/Places";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import AlertComponent from "../components/AlertComponent";

function DetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const budget = location.state.budget.budget;
  const interest = location.state.interest.interest;
  const currency = location.state.currency.currency;
  const minPrice = (budget == "Cheap") ? 500 : (budget == "Medium") ? 2000 : (budget == "Expensive") ? 5000 : null;
  const maxPrice = (budget == "Cheap") ? 2000 : (budget == "Medium") ? 5000 : (budget == "Expensive") ? 10000 : null;

  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An Error Occured!");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationObject, setSelectedLocationObject] = useState("");
  const [isFlightReady, setIsFlightReady] = useState(false);
  const [isFlightLoading, setIsFlightLoading] = useState(false);
  const [isHotelReady, setIsHotelReady] = useState(false);
  const [isHotelLoading, setIsHotelLoading] = useState(false);

  const filteredLocations = specificLocation.filter(location => {
    return (
      location.interests.includes(interest)
    );
  });
  const filteredLocationNames = filteredLocations.map(location => location.location);

  const [checkinDate, setCheckinDate] = useState(null);
  const [checkoutDate, setCheckoutDate] = useState(null);
  const [adult, setAdult] = useState(0);
  const [child, setChild] = useState(0);
  const [flightResponse, setFlightResponse] = useState(null);
  const [hotelResponse, setHotelResponse] = useState(null);
  const childText = child === 0 ? '' : Array(child).fill('9').join(',');

  const getFlightData = async () => {
      setIsFlightLoading(true);
      setIsFlightReady(true);
      const options = {
          method: 'GET',
          url: 'https://booking-com13.p.rapidapi.com/flights/return',
          params: {
            location_from: 'Ankara, Turkey',
            location_to: selectedLocation,
            departure_date: checkinDate,
            return_date: checkoutDate,
            adult_number: adult,
            minPrice: 0,
            maxPrice: maxPrice,
            children_age: childText,
            page: '1'
          },
          headers: {
            'X-RapidAPI-Key': '6b30e9799dmsh2c8a2c72d326698p1b4afcjsn42ae8dc15dff',
            'X-RapidAPI-Host': 'booking-com13.p.rapidapi.com'
          }
        };
        
        try {
            const response = await axios.request(options);
            setFlightResponse(response);
            console.log(response.data);
            setIsFlightLoading(false);
        } catch (error) {
          console.error(error);
          setIsFlightLoading(false);
        }
  };
  const getHotelData = async () => {
    setIsHotelLoading(true);
    setIsHotelReady(true);
    const options = {
      method: 'GET',
      url: 'https://agoda-com.p.rapidapi.com/hotels-homes/auto-complete',
      params: {q: selectedLocation},
      headers: {
        'X-RapidAPI-Key': '6b30e9799dmsh2c8a2c72d326698p1b4afcjsn42ae8dc15dff',
        'X-RapidAPI-Host': 'agoda-com.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
      setHotelResponse(response);
      setIsHotelLoading(false);
    } catch (error) {
      console.error(error);
      setIsHotelLoading(false);
    }
  };
  return (
    <div style={{display:"flex", flexDirection:"row", justifyContent:"center", alignContent:"center", gap: 300}}>
    <div className="homeStyling">
      <Stack>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={errorStatus}
          autoHideDuration={2400}
          onClose={() => {
            setErrorStatus(false);
          }}
        >
          <div>
            <AlertComponent message={errorMessage} />
          </div>
        </Snackbar>
      </Stack>
      <span style={{ marginBottom: "10px" }}>How Many Adult</span>
      <Box sx={{ minWidth: 180 }}>
        <FormControl fullWidth>
          <InputLabel>Adult</InputLabel>
          <Select
            labelId="adult"
            id="adult"
            value={adult}
            label="adult"
            onChange={(value) => {
              setAdult(value.target.value);
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <span style={{ marginBottom: "10px" }}>How Many Children</span>
      <Box sx={{ minWidth: 180 }}>
        <FormControl fullWidth>
          <InputLabel>Children</InputLabel>
          <Select
            labelId="child"
            id="child"
            value={child}
            label="child"
            onChange={(value) => {
              setChild(value.target.value);
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <span style={{ marginBottom: "10px" }}>Select a check-in date</span>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            width: 300,
            bgcolor: "white",
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #eee",
            },
            "& legend": { display: "none" },
            "& fieldset": { top: 0 },
            "& .MuiInputLabel-shrink": {
              opacity: 0,
              transition: "all 0.2s ease-in",
            },
          }}
          label="Check-in Date"
          onChange={(newValue) => {
            const selectedDate = dayjs(newValue.$d).format("YYYY-MM-DD");
            const currentDate = dayjs().format("YYYY-MM-DD");
            if (dayjs(selectedDate).isBefore(currentDate)) {
              setErrorMessage("You cannot enter a date before today!");
              setErrorStatus(true);
            } else {
              setCheckinDate(selectedDate);
              setErrorStatus(false); 
              setErrorMessage("");
            }
          }}
        />
      </LocalizationProvider>
      <span style={{ marginBottom: "10px" }}>Select a check-out date</span>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{
            width: 300,
            bgcolor: "white",
            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #eee",
            },
            "& legend": { display: "none" },
            "& fieldset": { top: 0 },
            "& .MuiInputLabel-shrink": {
              opacity: 0,
              transition: "all 0.2s ease-in",
            },
          }}
          label="Check-out Date"
          onChange={(newValue) => {
            const selectedDate = dayjs(newValue.$d).format("YYYY-MM-DD");
            const currentDate = dayjs().format("YYYY-MM-DD");
            if (dayjs(selectedDate).isBefore(currentDate)) {
              setErrorMessage("You cannot enter a date before today!");
              setErrorStatus(true);
            } else if (dayjs(selectedDate).isBefore(checkinDate)) {
              setErrorMessage("Check-out date cannot be before Check-in date!");
              setErrorStatus(true);
            } else {
              setCheckoutDate(selectedDate);
              setErrorStatus(false); 
              setErrorMessage("");
            }
          }}
        />
      </LocalizationProvider>
      <span style={{ marginBottom: "10px" }}>Suggested Trip Locations</span>
      <Autocomplete
        disablePortal
        id="Locations"
        options={filteredLocationNames}
        sx={{ width: 300 }}
        onInputChange={(event, value)=>setSelectedLocation(value)}
        renderInput={(params) => <TextField {...params} label="Locations" />}
      />
      <Button variant="contained" onClick={() => {
        if(budget != "" && selectedLocation != "" && checkinDate != "" && checkoutDate != "" && adult != "")
        {
          getFlightData();
          getHotelData();
        }
        else{
          setErrorMessage("You have to fill all the empty spaces and children if you have any!");
          setErrorStatus(true);
        }
      }}>
        List Flights and Hotels
      </Button>
    </div>
    <div className="homeStyling">
      {isFlightReady ? (isFlightLoading ? <CircularProgress /> : <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 200, width: 400 }}
        image={require("../assets/flight.png")}
        title="Plane"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Flight
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Flight results found. You can find out cheapest flights.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=>{
          if(flightResponse) 
            window.open(flightResponse.data.data.flights[0].shareableUrl)
          }}>Learn More</Button>
      </CardActions>
    </Card>) : null}
    {isHotelReady ? isHotelLoading ? <CircularProgress /> : <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 200, width: 400 }}
        image={require("../assets/hotel.jpg")}
        title="Hotel"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Hotels
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hotel results found. You can find out cheapest hotels.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={()=>{
          if(hotelResponse) 
            window.open("https://agoda.com/" + hotelResponse.data.data[0].ResultUrl)
          }}>Learn More</Button>
      </CardActions>
    </Card> : null}
    </div>
    </div>
  );
}

export default DetailPage;
