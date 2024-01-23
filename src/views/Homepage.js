import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "../styles.css";
import popularDestinations, { currencies, interests } from "../const/Places";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import AlertComponent from "../components/AlertComponent";

function Homepage() {
  const [budget, setBudget] = useState("");
  const [currency, setCurrency] = useState("");
  const [interest, setInterest] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const navigate = useNavigate();
  const [errorStatus, setErrorStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("An Error Occured!");

  useEffect(() =>{
    if(maxBudget < 1000 && maxBudget >= 500){
      setBudget("Cheap");
    }
    else if(maxBudget < 2000 && maxBudget >= 1000)
    {
      setBudget("Medium");
    }
    else if(maxBudget <= 10000 && maxBudget >= 2000){
      setBudget("Expensive");
    }
    console.log(maxBudget);
  },[maxBudget])

  return (
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
      <Box sx={{ minWidth: 180 }}>
        <TextField
          label="Max Budget ($)"
          variant="outlined"
          id="maxBudget"
          sx={{minWidth: 300}}
          value={maxBudget}
          onChange={(value) => {
            setMaxBudget(value.target.value);
          }}
        />
      </Box>
      <Autocomplete
        disablePortal
        id="Interests"
        options={interests}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Interests" />}
        onInputChange={(event, newInputValue) => {
          setInterest(newInputValue);
        }}
      />
      <Autocomplete
        disablePortal
        id="Currencies"
        options={currencies.map((currency) => currency.name)}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Currencies" />}
        onInputChange={(event, newValue) => {
          setCurrency(newValue);
        }}
      />
      <Button
        variant="contained"
        onClick={() => {
          if (currency != "" && interest != "" && budget != "") {
              navigate("/detail", {
                state: {
                  budget: { budget },
                  interest: { interest },
                  currency: { currency },
                },
              });
          }
          else if(maxBudget < 500 && maxBudget != "")
          {
            setErrorStatus(true);
            setErrorMessage("You should have more than 500$!");
          }
          else{
            setErrorStatus(true);
            setErrorMessage("You have to fill all the empty spaces!");
          }
        }}
      >
        NEXT
      </Button>
    </div>
  );
}

export default Homepage;
